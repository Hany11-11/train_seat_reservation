import { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, Download, User } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { BookingSummary } from "@/components/organisms/BookingSummary";
import { PaymentPanel } from "@/components/organisms/PaymentPanel";
import { CustomerForm } from "@/components/molecules/CustomerForm";
import { useBooking } from "@/hooks/useBooking";
import { useAuth } from "@/hooks/useAuth";
import { useTrains } from "@/hooks/useTrains";
import { useStations } from "@/hooks/useStations";
import { PassengerDetails } from "@/types/booking";
import { Booking } from "@/types/booking";
import { Schedule } from "@/types/schedule";
import { scheduleService } from "@/services/scheduleService";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { trainInfo, selectedSeats, totalAmount, passengers } =
    location.state || {};
  const { createBooking } = useBooking();
  const { login, register, user, isAuthenticated } = useAuth();
  const { trains } = useTrains();
  const { stations } = useStations();
  const ticketRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState<"details" | "payment" | "success">(
    isAuthenticated ? "payment" : "details",
  );
  const [passengerDetails, setPassengerDetails] =
    useState<PassengerDetails | null>(
      isAuthenticated && user
        ? {
            nic: user.nic,
            name: user.name,
            email: user.email,
            mobile: user.mobile,
          }
        : null,
    );
  const [isNewUser, setIsNewUser] = useState(!isAuthenticated);
  const [existingUserId, setExistingUserId] = useState<string | null>(
    isAuthenticated && user ? user.id : null,
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingRef, setBookingRef] = useState("");
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(
    null,
  );
  const [scheduleDetails, setScheduleDetails] = useState<Schedule | null>(null);

  if (!trainInfo || !selectedSeats) {
    navigate("/");
    return null;
  }

  const handleDetailsSubmit = (
    details: PassengerDetails,
    newUser: boolean,
    userId?: string,
  ) => {
    setPassengerDetails(details);
    setIsNewUser(newUser);
    setExistingUserId(userId || null);
    setStep("payment");
  };

  const handleDownloadTicket = async () => {
    if (!ticketRef.current) return;
    const element = ticketRef.current;
    const html2canvas = (await import("html2canvas")).default;
    const jsPDF = (await import("jspdf")).default;
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save(`ticket-${bookingRef}.pdf`);
  };

  const handlePaymentComplete = async () => {
    if (!passengerDetails) return;
    setIsProcessing(true);

    try {
      let userIdForBooking: string | undefined;

      if (isNewUser) {
        const defaultPassword = passengerDetails.nic;
        const result = await register({
          ...passengerDetails,
          password: defaultPassword,
        });

        if (!result.success) {
          console.error("Registration failed:", result.error);
          setIsProcessing(false);
          return;
        }

        userIdForBooking = result.user?.id;
      } else {
        userIdForBooking = existingUserId || undefined;
      }

      const booking = await createBooking(
        trainInfo.scheduleId,
        trainInfo.trainId,
        trainInfo.fromStation.id,
        trainInfo.toStation.id,
        trainInfo.date,
        selectedSeats,
        passengerDetails!,
        userIdForBooking,
      );

      if (booking) {
        setConfirmedBooking(booking);
        setBookingRef(booking.referenceNumber);

        const schedule = await scheduleService.getScheduleById(
          trainInfo.scheduleId,
          trains,
          stations,
        );
        setScheduleDetails(schedule);

        setStep("success");
      }
    } catch (error: unknown) {
      console.error("Checkout error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (step === "success" && confirmedBooking) {
    const trainName = scheduleDetails?.trainData?.name || "-";
    const fromStation = scheduleDetails?.fromStationData?.name || "-";
    const toStation = scheduleDetails?.toStationData?.name || "-";
    const seatNumbers = confirmedBooking.seats
      .map((s) => s.seatNumber)
      .join(", ");
    const classType = confirmedBooking.seats[0]?.classType || "-";

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-card rounded-2xl border border-border p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-muted-foreground mb-6">
            {isNewUser
              ? "Your account has been created with a default password."
              : isAuthenticated
                ? "Your ticket has been booked successfully."
                : "Your ticket has been booked. Please login to manage your bookings."}
          </p>
          <div className="bg-muted/50 rounded-lg p-4 mb-6">
            <p className="text-sm text-muted-foreground">Booking Reference</p>
            <p className="text-2xl font-bold text-accent">{bookingRef}</p>
          </div>

          <div className="hidden">
            <div
              ref={ticketRef}
              className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md"
              style={{ width: 400 }}
            >
              <h2 className="text-xl font-bold mb-2 text-center">
                Train Ticket
              </h2>
              <div className="flex flex-col items-center mb-4">
                <div style={{ background: "white", padding: 8 }}>
                  <div className="w-24 h-24 bg-gray-200 flex items-center justify-center text-xs">
                    QR
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  {confirmedBooking.referenceNumber}
                </div>
              </div>
              <div className="mb-2">
                <b>Passenger:</b> {passengerDetails?.name}
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
                <b>Date:</b> {trainInfo.date}
              </div>
              <div className="mb-2">
                <b>Class:</b> {classType}
              </div>
              <div className="mb-2">
                <b>Seats:</b> {seatNumbers}
              </div>
              <div className="mb-2">
                <b>Price:</b> {totalAmount}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button onClick={handleDownloadTicket} className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Download Ticket
            </Button>
            {isNewUser || isAuthenticated ? (
              <Button onClick={() => navigate("/dashboard")} className="w-full">
                Go to Dashboard
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => navigate("/login")}
                className="w-full"
              >
                Login to Manage Bookings
              </Button>
            )}
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="w-full"
            >
              Book Another Trip
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() =>
              step === "details" ? navigate(-1) : setStep("details")
            }
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {step === "details" ? "Back to Seats" : "Back to Details"}
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {step === "details" && (
              <div className="bg-card rounded-xl border border-border p-6">
                <h2 className="text-xl font-bold text-foreground mb-6">
                  Passenger Details
                </h2>
                <CustomerForm onSubmit={handleDetailsSubmit} />
                <Button
                  onClick={() => {
                    const form = document.querySelector("form");
                    form?.requestSubmit();
                  }}
                  className="w-full mt-6 bg-accent hover:bg-accent/90"
                >
                  Continue to Payment
                </Button>
              </div>
            )}

            {step === "payment" && (
              <>
                {isAuthenticated && user && (
                  <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 mb-6 flex items-center gap-3">
                    <User className="w-5 h-5 text-accent" />
                    <div>
                      <p className="text-sm font-medium text-accent">
                        Booking as {user.email}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user.name} | NIC: {user.nic} | Mobile: {user.mobile}
                      </p>
                    </div>
                  </div>
                )}
                <PaymentPanel
                  amount={totalAmount}
                  onPaymentComplete={handlePaymentComplete}
                  isProcessing={isProcessing}
                />
              </>
            )}
          </div>

          <div>
            <BookingSummary
              trainInfo={trainInfo}
              selectedSeats={selectedSeats}
              totalAmount={totalAmount}
              passengerCount={passengers}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
