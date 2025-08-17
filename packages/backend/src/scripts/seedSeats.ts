import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Seat } from '../models/Seat';
import { seedSeatData } from '../utils/seedSeatData';

dotenv.config();

const dates = ['2025-08-14', '2025-08-15', '2025-08-16'];

const seedSeats = async () => {
  try {
    await mongoose.connect(
      process.env.DB_URL || 'mongodb://localhost:27017/medrevue',
    );
    console.log('✅ Connected to MongoDB');

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
      console.log(`✅ Inserted ${allSeats.length} seats`);
    }
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding seats:', error);
    process.exit(1);
  }
};

seedSeats();
