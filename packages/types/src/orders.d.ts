export interface OrderType {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  isStudent: boolean;
  studentCount: number;
  selectedDate: string;
  selectedSeats: {
    rowLabel: string;
    number: number;
    seatType: 'Standard' | 'VIP';
  }[];
  totalPrice: number;
  checkoutSessionId: string;
  paid: boolean;
}
