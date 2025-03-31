'use server';

import { prisma } from '@/lib/prisma';

export async function getBookingByStripeId(sessionId: string) {
  try {
    const booking = await prisma.booking.findUnique({
      where: {
        stripeId: sessionId
      },
      select: {
        id: true,
        customerEmail: true,
        customerName: true,
        tripType: true,
        from: true,
        to: true,
        departingDate: true,
        returningDate: true,
        departureTime: true,
        returnTime: true,
        passengers: true,
        address: true,
        price: true,
        status: true,
        paymentStatus: true,
        paidAt: true
      }
    });

    return { success: true, data: booking };
  } catch (error) {
    console.error('Error fetching booking:', error);
    return { success: false, error: 'Failed to fetch booking details' };
  }
}

export async function getBookingsByEmail(email: string) {
  try {
    const bookings = await prisma.booking.findMany({
      where: {
        customerEmail: email,
        paymentStatus: 'PAID'
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        customerEmail: true,
        customerName: true,
        tripType: true,
        from: true,
        to: true,
        departingDate: true,
        returningDate: true,
        departureTime: true,
        returnTime: true,
        passengers: true,
        address: true,
        price: true,
        status: true,
        paymentStatus: true,
        paidAt: true
      }
    });

    return { success: true, data: bookings };
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return { success: false, error: 'Failed to fetch booking history' };
  }
}

export async function getAllBookings() {
  console.log('Starting getAllBookings function...');
  try {
    console.log('Attempting to fetch bookings from database...');
    const bookings = await prisma.booking.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        stripeId: true,
        customerEmail: true,
        customerName: true,
        tripType: true,
        from: true,
        to: true,
        departingDate: true,
        returningDate: true,
        departureTime: true,
        returnTime: true,
        passengers: true,
        address: true,
        price: true,
        status: true,
        paymentStatus: true,
        paymentMethod: true,
        paidAt: true,
        createdAt: true
      }
    });

    console.log('Bookings fetched successfully:', {
      count: bookings.length,
      firstBooking: bookings[0] ? {
        id: bookings[0].id,
        email: bookings[0].customerEmail,
        status: bookings[0].status
      } : 'No bookings found'
    });

    return { success: true, data: bookings };
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Error in getAllBookings:', {
      name: err.name,
      message: err.message,
      stack: err.stack
    });
    return { success: false, error: 'Failed to fetch bookings' };
  }
}

interface BookingCountResponse {
  success: true;
  count: number;
  remainingSpots: number;
  maxSpots: number;
}

interface BookingCountError {
  success: false;
  error: string;
}

type BookingCountResult = BookingCountResponse | BookingCountError;

export async function getBookingCountForRoute(from: string, to: string, date: Date): Promise<BookingCountResult> {
  try {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const count = await prisma.booking.count({
      where: {
        from,
        to,
        departingDate: {
          gte: startOfDay,
          lte: endOfDay
        },
        paymentStatus: 'PAID'  // Only count paid bookings
      }
    });

    const MAX_SPOTS = 30;
    const remainingSpots = MAX_SPOTS - count;

    return { 
      success: true, 
      count,
      remainingSpots,
      maxSpots: MAX_SPOTS
    };
  } catch (error) {
    console.error('Error counting bookings:', error);
    return { success: false, error: 'Failed to count bookings' };
  }
} 