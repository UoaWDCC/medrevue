import type { OrderType } from '@medrevue/types';
import mongoose, { Schema, type Document, type Model } from 'mongoose';

interface IOrder extends OrderType, Document {}

const orderSchema: Schema<IOrder> = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    isStudent: { type: Boolean, required: true },
    studentCount: { type: Number, required: true },
    selectedDate: { type: String, required: true },
    selectedSeats: [
      {
        rowLabel: { type: String, required: true },
        number: { type: Number, required: true },
        seatType: { type: String, enum: ['Standard', 'VIP'], required: true },
      },
    ],
    totalPrice: { type: Number, required: true },
    checkoutSessionId: { type: String, required: true },
    paid: { type: Boolean, required: true },
  },
  {
    timestamps: true,
  },
);

const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>('Order', orderSchema);

export { Order, type IOrder };
