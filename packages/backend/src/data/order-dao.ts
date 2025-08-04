import dotenv from 'dotenv';
import Stripe from 'stripe';
import { type IOrder, Order } from '../models/order';

dotenv.config();
const stripeKey = process.env.STRIPE_SECRET_KEY;
if (!stripeKey) throw new Error('Missing STRIPE_SECRET_KEY in environment');

const stripe = new Stripe(stripeKey, {
  apiVersion: '2025-05-28.basil',
});

const baseFrontendUrl =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:5173'
    : 'https://www.medrevue.co.nz';

async function createOrder(
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  isStudent: boolean,
  studentCount: number,
  selectedDate: string,
  selectedSeats: {
    rowLabel: string;
    number: number;
    seatType: 'Standard' | 'VIP';
  }[],
  totalPrice: number,
) {
  try {
    const vipPrice = 45;
    const standardStudentPrice = 25;
    const standardPrice = 35;
    let remainingStudent = Math.min(
      studentCount,
      selectedSeats.filter((s) => s.seatType === 'Standard').length,
    );
    const lineItems = selectedSeats.map((seat) => {
      let price = vipPrice;
      if (seat.seatType === 'Standard') {
        if (remainingStudent > 0) {
          price = standardStudentPrice;
          remainingStudent -= 1;
        } else {
          price = standardPrice;
        }
      }
      return {
        name: `MedRevue Ticket (${seat.seatType}) - Row ${seat.rowLabel} Seat ${seat.number}`,
        price,
        quantity: 1,
      };
    });

    // Calculate booking fee as 3% of the ticket subtotal
    const bookingFee = +(totalPrice * 0.03).toFixed(2);
    const totalPriceWithFee = +(totalPrice + bookingFee).toFixed(2);

    lineItems.push({
      name: 'Booking Fee',
      price: bookingFee,
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems.map(
        (item: { name: string; price: number; quantity: number }) => ({
          price_data: {
            currency: 'nzd',
            product_data: {
              name: item.name,
            },
            unit_amount: Math.round(item.price * 100),
          },
          quantity: item.quantity,
        }),
      ),
      mode: 'payment',
      success_url: `${baseFrontendUrl}/success`,
      cancel_url: `${baseFrontendUrl}/cancel`,
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
    });

    const checkoutSessionId = session.id;

    if (!checkoutSessionId) {
      throw new Error('Failed to create Stripe checkout session');
    }

    const dbOrder = new Order({
      firstName,
      lastName,
      email,
      phone,
      isStudent,
      studentCount,
      selectedDate,
      selectedSeats,
      totalPrice: totalPriceWithFee,
      checkoutSessionId,
      paid: false,
    });
    return await dbOrder.save();
  } catch (error) {
    console.error('Error creating order:', error);
    throw new Error('Failed to create order');
  }
}

async function retrieveOrderList(): Promise<IOrder[]> {
  return await Order.find().exec();
}

async function retrieveOrderByEmail(email: string) {
  return await Order.findOne({ email: email });
}

async function retrieveOrderById(id: string): Promise<IOrder | null> {
  return await Order.findById(id).exec();
}

async function updateOrder(order: IOrder): Promise<boolean> {
  try {
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: order._id },
      {
        firstName: order.firstName,
        lastName: order.lastName,
        email: order.email,
        phone: order.phone,
        isStudent: order.isStudent,
        studentCount: order.studentCount,
        selectedDate: order.selectedDate,
        selectedSeats: order.selectedSeats,
        totalPrice: order.totalPrice,
        // checkoutSessionId: order.checkoutSessionId,
        paid: order.paid,
      },
      { new: true },
    ).exec();
    return updatedOrder !== null;
  } catch (error) {
    console.error('Error updating order:', error);
    return false;
  }
}

async function getOrderStatistics() {
  const result = await Order.aggregate([
    { $match: { paid: true } },
    { $project: { seatsCount: { $size: '$selectedSeats' }, totalPrice: 1 } },
    {
      $group: {
        _id: null,
        totalSoldPrice: { $sum: '$totalPrice' },
        totalOrders: { $sum: 1 },
        totalSeatsOrdered: { $sum: '$seatsCount' },
      },
    },
  ]).exec();

  if (result.length === 0) {
    return { totalSoldPrice: 0, totalOrders: 0, totalSeatsOrdered: 0 };
  }

  const stats = result[0] as {
    totalSoldPrice: number;
    totalOrders: number;
    totalSeatsOrdered: number;
  };
  return {
    totalSoldPrice: stats.totalSoldPrice,
    totalOrders: stats.totalOrders,
    totalSeatsOrdered: stats.totalSeatsOrdered,
  };
}

async function deleteOrder(id: string): Promise<boolean> {
  try {
    const result = await Order.deleteOne({ _id: id }).exec();
    return result.deletedCount > 0;
  } catch (error) {
    console.error('Error deleting order:', error);
    return false;
  }
}

interface DuplicateTicketReport {
  duplicateSeats: {
    date: string;
    rowLabel: string;
    number: number;
    seatType: string;
    orderIds: string[];
    orderDetails: Array<{
      orderId: string;
      customerName: string;
      email: string;
      paid: boolean;
      createdAt: Date;
    }>;
  }[];
  duplicateOrders: {
    customerEmail: string;
    duplicateOrderGroups: Array<{
      orderIds: string[];
      selectedSeats: Array<{
        rowLabel: string;
        number: number;
        seatType: string;
      }>;
      orderDetails: Array<{
        orderId: string;
        customerName: string;
        paid: boolean;
        createdAt: Date;
      }>;
    }>;
  }[];
  summary: {
    totalDuplicateSeats: number;
    totalDuplicateOrders: number;
    affectedCustomers: number;
  };
}

/**
 * Checks for duplicate ticket sales across all orders
 * @param dateFilter Optional date filter to check duplicates for a specific date only
 * @param includeUnpaidOrders Whether to include unpaid orders in the duplicate check (default: false)
 * @returns Detailed report of duplicate tickets found
 */
async function checkDuplicateTickets(
  dateFilter?: string,
  includeUnpaidOrders = false,
): Promise<DuplicateTicketReport> {
  try {
    // Build query filter
    const matchFilter: { selectedDate?: string; paid?: boolean } = {};
    if (dateFilter) {
      matchFilter.selectedDate = dateFilter;
    }
    if (!includeUnpaidOrders) {
      matchFilter.paid = true;
    }

    // Find duplicate seats - same seat sold to multiple orders
    const duplicateSeatsAggregation = await Order.aggregate([
      { $match: matchFilter },
      { $unwind: '$selectedSeats' },
      {
        $group: {
          _id: {
            date: '$selectedDate',
            rowLabel: '$selectedSeats.rowLabel',
            number: '$selectedSeats.number',
            seatType: '$selectedSeats.seatType',
          },
          orders: {
            $push: {
              orderId: '$_id',
              customerName: { $concat: ['$firstName', ' ', '$lastName'] },
              email: '$email',
              paid: '$paid',
              createdAt: '$createdAt',
            },
          },
          count: { $sum: 1 },
        },
      },
      { $match: { count: { $gt: 1 } } },
      {
        $project: {
          date: '$_id.date',
          rowLabel: '$_id.rowLabel',
          number: '$_id.number',
          seatType: '$_id.seatType',
          orderIds: '$orders.orderId',
          orderDetails: '$orders',
          _id: 0,
        },
      },
    ]).exec();

    // Find duplicate orders - same customer with same seat selections
    const duplicateOrdersAggregation = await Order.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: {
            email: '$email',
            selectedDate: '$selectedDate',
            selectedSeats: '$selectedSeats',
          },
          orders: {
            $push: {
              orderId: '$_id',
              customerName: { $concat: ['$firstName', ' ', '$lastName'] },
              paid: '$paid',
              createdAt: '$createdAt',
            },
          },
          count: { $sum: 1 },
        },
      },
      { $match: { count: { $gt: 1 } } },
      {
        $group: {
          _id: '$_id.email',
          duplicateOrderGroups: {
            $push: {
              orderIds: '$orders.orderId',
              selectedSeats: '$_id.selectedSeats',
              orderDetails: '$orders',
            },
          },
        },
      },
      {
        $project: {
          customerEmail: '$_id',
          duplicateOrderGroups: 1,
          _id: 0,
        },
      },
    ]).exec();

    // Calculate summary statistics
    const totalDuplicateSeats = duplicateSeatsAggregation.length;
    const totalDuplicateOrders = duplicateOrdersAggregation.reduce(
      (total, customer) =>
        total +
        customer.duplicateOrderGroups.reduce(
          (customerTotal: number, group: { orderIds: string[] }) =>
            customerTotal + group.orderIds.length,
          0,
        ),
      0,
    );
    const affectedCustomers = duplicateOrdersAggregation.length;

    return {
      duplicateSeats: duplicateSeatsAggregation,
      duplicateOrders: duplicateOrdersAggregation,
      summary: {
        totalDuplicateSeats,
        totalDuplicateOrders,
        affectedCustomers,
      },
    };
  } catch (error) {
    console.error('Error checking duplicate tickets:', error);
    throw new Error('Failed to check duplicate tickets');
  }
}

/**
 * Checks if a specific seat has been sold to multiple orders
 * @param date The date of the show
 * @param rowLabel The row label of the seat
 * @param number The seat number
 * @param includeUnpaidOrders Whether to include unpaid orders (default: false)
 * @returns Array of order IDs that contain this seat
 */
async function checkSpecificSeatDuplicate(
  date: string,
  rowLabel: string,
  number: number,
  includeUnpaidOrders = false,
): Promise<string[]> {
  try {
    const matchFilter: {
      selectedDate: string;
      'selectedSeats.rowLabel': string;
      'selectedSeats.number': number;
      paid?: boolean;
    } = {
      selectedDate: date,
      'selectedSeats.rowLabel': rowLabel,
      'selectedSeats.number': number,
    };
    if (!includeUnpaidOrders) {
      matchFilter.paid = true;
    }

    const orders = await Order.find(matchFilter).select('_id').exec();
    return orders.map((order) => (order._id as string).toString());
  } catch (error) {
    console.error('Error checking specific seat duplicate:', error);
    throw new Error('Failed to check specific seat duplicate');
  }
}

export {
  createOrder,
  retrieveOrderList,
  retrieveOrderByEmail,
  retrieveOrderById,
  updateOrder,
  deleteOrder,
  getOrderStatistics,
  checkDuplicateTickets,
  checkSpecificSeatDuplicate,
  type DuplicateTicketReport,
};
