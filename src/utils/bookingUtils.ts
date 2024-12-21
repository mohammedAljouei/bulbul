import type { Booking } from '../types/database';

interface BookingActions {
  addBooking: (booking: Booking) => void;
  updateBooking: (booking: Booking) => void;
  removeBooking: (bookingId: string) => void;
}

export function handleBookingUpdate(
  payload: any, 
  actions: BookingActions
) {
  const { eventType, new: newBooking, old: oldBooking } = payload;

  switch (eventType) {
    case 'INSERT':
      actions.addBooking(newBooking as Booking);
      break;
    case 'UPDATE':
      actions.updateBooking(newBooking as Booking);
      break;
    case 'DELETE':
      actions.removeBooking(oldBooking.id);
      break;
  }
}