export const HOTEL = { name: 'Harbour Hotel', city: 'Shanghai', price: 399 } as const;
export type Booking = {
  id: string;
  nights: number;
  total: number;
  status: 'confirmed' | 'cancelled';
};
export function changeNights(nights: number, delta: number): number {
  if (!Number.isInteger(nights) || !Number.isInteger(delta)) throw new Error('Invalid nights');
  return Math.max(1, Math.min(7, nights + delta));
}
export function totalPrice(nights: number): number {
  if (!Number.isInteger(nights) || nights < 1 || nights > 7) throw new Error('Nights must be 1 to 7');
  return HOTEL.price * nights;
}
export function createBooking(nights: number): Booking {
  return { id: 'DEMO-001', nights, total: totalPrice(nights), status: 'confirmed' };
}
export function cancelBooking(booking: Booking): Booking {
  return { ...booking, status: 'cancelled' };
}
