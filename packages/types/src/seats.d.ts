export interface SeatType {
  number: number;
  rowLabel: string;
  available: boolean;
  selected?: boolean;
  seatType: 'Standard' | 'VIP';
}
