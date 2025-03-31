import { redirect } from 'next/navigation';
import { getBookingByStripeId } from '@/app/actions/booking';
import { format } from 'date-fns';

interface PageProps {
  searchParams: { session_id?: string };
}

export default async function SuccessPage({ searchParams }: PageProps) {
  const sessionId = searchParams.session_id;

  if (!sessionId) {
    redirect('/');
  }

  const { success, data: booking, error } = await getBookingByStripeId(sessionId);

  if (!success || !booking) {
    console.error('Error fetching booking:', error);
    redirect('/');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        <div className="mb-4">
          <svg
            className="mx-auto h-12 w-12 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Payment Successful!
        </h2>
        <p className="text-gray-600 mb-8">
          Thank you for your booking, {booking.customerName}. We have sent a confirmation email to {booking.customerEmail}.
        </p>
        
        <div className="text-left bg-gray-50 p-4 rounded-lg mb-8">
          <h3 className="font-semibold mb-2">Booking Details:</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p><span className="font-medium">Trip Type:</span> {booking.tripType}</p>
            <p><span className="font-medium">From:</span> {booking.from}</p>
            <p><span className="font-medium">To:</span> {booking.to}</p>
            <p>
              <span className="font-medium">Departing:</span>{' '}
              {format(new Date(booking.departingDate), 'PPP')} at {booking.departureTime}
            </p>
            {booking.returningDate && (
              <p>
                <span className="font-medium">Returning:</span>{' '}
                {format(new Date(booking.returningDate), 'PPP')} at {booking.returnTime}
              </p>
            )}
            <p><span className="font-medium">Passengers:</span> {booking.passengers}</p>
            {booking.address && (
              <p><span className="font-medium">Address:</span> {booking.address}</p>
            )}
            <p><span className="font-medium">Price:</span> ${booking.price}</p>
          </div>
        </div>

        <a
          href="/shuttle-service"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Return to Shuttle Service
        </a>
      </div>
    </div>
  );
} 