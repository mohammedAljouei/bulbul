import { create } from 'zustand';
import type { Booking } from '../types/database';

interface BookingsState {
  bookings: Booking[];
  setBookings: (bookings: Booking[]) => void;
  addBooking: (booking: Booking) => void;
  updateBooking: (booking: Booking) => void;
  removeBooking: (bookingId: string) => void;
}

export const useBookingsStore = create<BookingsState>((set) => ({
  bookings: [],
  setBookings: (bookings) => set({ bookings }),
  addBooking: (booking) => set((state) => ({ 
    bookings: [...state.bookings, booking] 
  })),
  updateBooking: (booking) => set((state) => ({
    bookings: state.bookings.map((b) => 
      b.id === booking.id ? { ...b, ...booking } : b
    )
  })),
  removeBooking: (bookingId) => set((state) => ({
    bookings: state.bookings.filter((b) => b.id !== bookingId)
  }))
}));