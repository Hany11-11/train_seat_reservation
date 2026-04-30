import React, { forwardRef } from "react";
import { Booking } from "@/types/booking";
import { Schedule } from "@/types/schedule";
import { Button } from "@/components/atoms/Button";
import QRCode from "react-qr-code";

interface TicketModalProps {
  booking: Booking;
  schedule: Schedule | undefined;
  open: boolean;
  onClose: () => void;
  onDownload: () => void;
}

export const TicketModal = forwardRef<HTMLDivElement, TicketModalProps>(
  ({ booking, schedule, open, onClose, onDownload }, ref) => {
    if (!open || !booking) return null;
    const trainName = schedule?.trainData?.name || "-";
    const fromStation = schedule?.fromStationData?.name || "-";
    const toStation = schedule?.toStationData?.name || "-";
    const seatNumbers = booking.seats.map((s) => s.seatNumber).join(", ");
    const classType = booking.seats[0]?.classType || "-";
    const qrValue = booking.referenceNumber;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div
          ref={ref}
          className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative"
        >
          <button className="absolute top-3 right-3 text-xl" onClick={onClose}>
            &times;
          </button>
          <h2 className="text-xl font-bold mb-2 text-center">Train Ticket</h2>
          <div className="flex flex-col items-center mb-4">
            <div style={{ background: "white", padding: 8 }}>
              <QRCode value={qrValue} size={96} />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              {booking.referenceNumber}
            </div>
          </div>
          <div className="mb-2">
            <b>Passenger:</b> {booking.passengerDetails.name}
          </div>
          <div className="mb-2">
            <b>Train:</b> {trainName}
          </div>
          <div className="mb-2">
            <b>From:</b> {fromStation}
          </div>
          <div className="mb-2">
            <b>To:</b> {toStation}
          </div>
          <div className="mb-2">
            <b>Date:</b> {booking.travelDate}
          </div>
          <div className="mb-2">
            <b>Class:</b> {classType}
          </div>
          <div className="mb-2">
            <b>Seats:</b> {seatNumbers}
          </div>
          <div className="mb-2">
            <b>Price:</b> {booking.totalAmount}
          </div>
          <div className="flex gap-2 mt-6">
            <Button onClick={onDownload}>Download PDF</Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    );
  },
);
