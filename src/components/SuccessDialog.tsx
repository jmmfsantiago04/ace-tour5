'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { getBookingByStripeId } from '@/app/actions/booking';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';

export function SuccessDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const searchParams = useSearchParams();
  const t = useTranslations('Success');

  useEffect(() => {
    const fetchBookingDetails = async () => {
      const sessionId = searchParams.get('session_id');
      if (sessionId) {
        const result = await getBookingByStripeId(sessionId);
        if (result.success && result.data) {
          setBookingDetails(result.data);
          setIsOpen(true);
        }
      }
    };

    if (searchParams.get('payment') === 'success') {
      fetchBookingDetails();
      // Remove the payment parameter from the URL
      const url = new URL(window.location.href);
      url.searchParams.delete('payment');
      url.searchParams.delete('session_id');
      window.history.replaceState({}, '', url);
    }
  }, [searchParams]);

  if (!bookingDetails) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('title')}</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <span className="space-y-2 block">
              <span className="block">{t('message')}</span>
              <span className="font-medium block">Booking Details:</span>
              <span className="text-sm space-y-1 block">
                <span className="block">From: {bookingDetails.from}</span>
                <span className="block">To: {bookingDetails.to}</span>
                <span className="block">Date: {new Date(bookingDetails.departingDate).toLocaleDateString()}</span>
                <span className="block">Time: {bookingDetails.departureTime}</span>
                <span className="block">Passengers: {bookingDetails.passengers}</span>
                {bookingDetails.address && <span className="block">Address: {bookingDetails.address}</span>}
              </span>
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction>{t('close')}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
} 