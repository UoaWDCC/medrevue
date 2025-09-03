import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Seat } from '../models/Seat';
import { seedSeatData } from '../utils/seedSeatData';

dotenv.config();

const dates = ['2025-08-14', '2025-08-15', '2025-08-16'];

export const seedSeats = async (test = false) => {
  try {
    if (test === false) {
      await mongoose.connect(
        process.env.DB_URL || 'mongodb://localhost:27017/medrevue',
      );
      console.log('✅ Connected to MongoDB');
    }

    await Seat.deleteMany({});
    console.log('🗑️  Cleared existing seats');

    for (const date of dates) {
      const seatData = seedSeatData();
      // const allSeats = Object.values(seatData).flat();
      const allSeats = Object.values(seatData)
        .flat()
        .map((seat) => ({
          ...seat,
          date,
        }));

      await Seat.insertMany(allSeats);
      console.log(`✅ Inserted ${allSeats.length} seats for date ${date}`);
    }
  } catch (error) {
    console.error('❌ Error seeding seats:', error);
  }
};

// seedSeats();
