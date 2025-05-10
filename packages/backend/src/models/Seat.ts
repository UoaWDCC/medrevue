import mongoose, { Schema, type Document } from 'mongoose';

interface Seat extends Document {
  seatNumber: string;
  reserved: boolean;
  reservedBy?: string;
}

const SeatSchema: Schema = new Schema<Seat>({
  seatNumber: { type: String, required: true, unique: true },
  reserved: { type: Boolean, default: false },
  reservedBy: { type: String },
});

export default mongoose.model<Seat>('Seat', SeatSchema);
