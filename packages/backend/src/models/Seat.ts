import type { SeatType } from '@medrevue/types';
import mongoose, { Schema, type Document, type Model } from 'mongoose';

interface ISeat extends SeatType, Document {
  date: string;
}

// interface Seat extends Document {
//   seatNumber: string;
//   reserved: boolean;
//   reservedBy?: string;
// }

const seatSchema: Schema<ISeat> = new Schema(
  {
    number: { type: Number, required: true },
    rowLabel: { type: String, required: true },
    available: { type: Boolean, required: true },
    selected: { type: Boolean, required: true },
    seatType: {
      type: String,
      enum: ['Standard', 'VIP'],
      required: true,
    },
    date: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

seatSchema.index({ date: 1, rowLabel: 1, number: 1 }, { unique: true });

const Seat: Model<ISeat> =
  mongoose.models.Seat || mongoose.model<ISeat>('Seat', seatSchema);

export { Seat, type ISeat };
