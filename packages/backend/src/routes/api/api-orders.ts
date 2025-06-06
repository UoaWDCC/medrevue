import express, { type Request, type Response } from 'express';
import mongoose from 'mongoose';
import {
  createOrder,
  retrieveOrder,
  updateOrderPaid,
} from '../../data/order-dao';

const router = express.Router();

interface CreateOrderRequest extends Request {
  body: {
    userID: string;
    numberOfTickets: number;
    seats: string[];
    paid: boolean;
  };
}

router.post(
  '/create-order',
  async (req: CreateOrderRequest, res: Response): Promise<void> => {
    // Create order is a route which takes valid order information
    // and creates an order in the database
    // ------------------------------------
    // ROUTE BODY:
    // userID (ObjectID): ID of the user with the order
    // numberOfTickets (int): The number of tickets the order contains
    // seats (seats[]): An array of seats
    // TODO: Difference between students etc.
    // ------------------------------------
    // ROUTE RETURN:
    // data: {
    //  orderID: ObjectID
    // }
    const { userID, numberOfTickets, seats } = req.body;
    // Check for missing fields
    if (!userID) {
      res.status(400).json({
        error: 'Missing user id',
      });
      return;
    }
    if (!numberOfTickets) {
      res.status(400).json({
        error: 'Missing number of tickets',
      });
      return;
    }
    if (!seats) {
      res.status(400).json({
        error: 'Missing number of seats',
      });
      return;
    }
    if (numberOfTickets !== seats.length) {
      res.status(400).json({
        error: "Number of tickets doesn't match number of seats booked",
      });
      return;
    }
    // Check that all the seats follow the correct format
    const formattedSeats = seats.slice();
    for (let i = 0; i < seats.length; i++) {
      const seat = seats[i];
      const match = seat.match(/^(\d+)([a-zA-Z])$/);
      if (!match) {
        res.status(400).json({
          error: 'The seats are not in the right format',
        });
        return;
      }
      const [, number, letter] = match as [string, string, string];
      formattedSeats[i] =
        `${Number.parseInt(number, 10)}${letter.toUpperCase()}`;
    }

    const order = await createOrder(userID, numberOfTickets, formattedSeats);
    if (!order) {
      res.status(500).json({
        error: 'Unable to save document to database',
      });
      return;
    }
    // If the order saves, then return the orderID to the user

    res.status(200).json({
      data: {
        orderID: order._id,
      },
    });
  },
);

router.get('/get-order', async (req: Request, res: Response): Promise<void> => {
  // Get order is a route which takes a orderID
  // and returns the order information
  // ------------------------------------
  // ROUTE BODY:
  // orderID (ObjectID): ID of the order
  // ------------------------------------
  // ROUTE RETURN:
  // data: {
  // orderID: ObjectID
  // userID: ObjectID
  // numberOfTickets: int
  // seats: seats[]
  // paid: boolean
  // }
  // ------------------------------------
  const { orderID } = req.body;
  // The user does not provide a order id on the route
  if (!orderID) {
    res.status(400).json({
      error: 'Missing the order id',
    });
    return;
  }
  // Check if valid id for mongoose
  const isValidID = mongoose.Types.ObjectId.isValid(orderID);
  if (!isValidID) {
    res.status(400).json({
      error: 'Incorrect orderID format',
    });
    return;
  }
  // Find the order in the DB
  const order = await retrieveOrder(orderID);
  // If the order exists return the information
  if (order) {
    res.status(200).json({
      order,
    });
    return;
  }
  // If the order doesn't exist, exit on 404
  res.status(404).json({
    error: 'OrderID not in database',
  });
});

router.patch(
  '/order-paid',
  async (req: Request, res: Response): Promise<void> => {
    // Order paid is a route which takes a orderID
    // and updates the order to paid
    // ------------------------------------
    // ROUTE BODY:
    // orderID (ObjectID): ID of the order
    // ------------------------------------
    // ROUTE RETURN:
    // data: {
    // orderID: ObjectID
    // userID: ObjectID
    // numberOfTickets: int
    // seats: seats[]
    // paid: boolean
    // }
    // ------------------------------------
    const { orderID } = req.body;
    if (!orderID) {
      res.status(400).json({
        error: 'Missing the order id',
      });
      return;
    }
    const isValidID = mongoose.Types.ObjectId.isValid(orderID);
    if (!isValidID) {
      res.status(400).json({
        error: 'Incorrect orderID format',
      });
      return;
    }
    const order = await updateOrderPaid(orderID);
    if (!order) {
      res.status(404).json({
        error: 'OrderID not in database',
      });
      return;
    }
    res.status(200).json({
      order,
    });
  },
);

export default router;
