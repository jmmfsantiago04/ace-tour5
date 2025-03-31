import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { format } from 'date-fns'

interface BookingDialogProps {
  booking: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BookingDialog({ booking, open, onOpenChange }: BookingDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Booking Details</DialogTitle>
        </DialogHeader>
        
        <div className="mt-6 space-y-6">
          {/* Status Section */}
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-sm text-gray-500">Status</h3>
            <div className="flex gap-4">
              <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' : 
                booking.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {booking.status}
              </span>
              <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                booking.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' :
                booking.paymentStatus === 'FAILED' ? 'bg-red-100 text-red-800' :
                booking.paymentStatus === 'REFUNDED' ? 'bg-gray-100 text-gray-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                Payment: {booking.paymentStatus}
              </span>
            </div>
          </div>

          {/* Customer Information */}
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-sm text-gray-500">Customer Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Name</p>
                <p className="text-sm text-gray-600">{booking.customerName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Email</p>
                <a 
                  href={`mailto:${booking.customerEmail}`}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  {booking.customerEmail}
                </a>
              </div>
              {booking.customerPhone && (
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-gray-600">{booking.customerPhone}</p>
                </div>
              )}
              {booking.address && (
                <div className="col-span-2">
                  <p className="text-sm font-medium">Address</p>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">{booking.address}</p>
                </div>
              )}
            </div>
          </div>

          {/* Trip Details */}
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-sm text-gray-500">Trip Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Trip Type</p>
                <p className="text-sm text-gray-600">{booking.tripType}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Price</p>
                <p className="text-sm text-gray-600">${booking.price}</p>
              </div>
              <div>
                <p className="text-sm font-medium">From</p>
                <p className="text-sm text-gray-600">{booking.from}</p>
              </div>
              <div>
                <p className="text-sm font-medium">To</p>
                <p className="text-sm text-gray-600">{booking.to}</p>
              </div>
            </div>
          </div>

          {/* Schedule Information */}
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-sm text-gray-500">Schedule</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Departure Date</p>
                <p className="text-sm text-gray-600">
                  {format(new Date(booking.departingDate), 'MMMM d, yyyy')}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Departure Time</p>
                <p className="text-sm text-gray-600">{booking.departureTime}</p>
              </div>
              {booking.returnDate && (
                <>
                  <div>
                    <p className="text-sm font-medium">Return Date</p>
                    <p className="text-sm text-gray-600">
                      {format(new Date(booking.returnDate), 'MMMM d, yyyy')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Return Time</p>
                    <p className="text-sm text-gray-600">{booking.returnTime}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Additional Details */}
          {booking.additionalNotes && (
            <div className="flex flex-col gap-2">
              <h3 className="font-semibold text-sm text-gray-500">Additional Notes</h3>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{booking.additionalNotes}</p>
            </div>
          )}

          {/* Booking Metadata */}
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-sm text-gray-500">Booking Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Booking ID</p>
                <p className="text-sm text-gray-600">{booking.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Created At</p>
                <p className="text-sm text-gray-600">
                  {format(new Date(booking.createdAt), 'MMMM d, yyyy HH:mm')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 