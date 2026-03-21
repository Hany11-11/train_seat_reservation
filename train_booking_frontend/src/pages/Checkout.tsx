import { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { BookingSummary } from "@/components/organisms/BookingSummary";
import { PaymentPanel } from "@/components/organisms/PaymentPanel";
import { CustomerForm } from "@/components/molecules/CustomerForm";
import { useBooking } from "@/hooks/useBooking";
import { useAuth } from "@/hooks/useAuth";
import { PassengerDetails } from "@/types/booking";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { trainInfo, selectedSeats, totalAmount, passengers } =
    location.state || {};
  const { createBooking } = useBooking();
  const { user, register } = useAuth();

  const [step, setStep] = useState<"details" | "payment" | "success">(
    "details",
  );
  const [passengerDetails, setPassengerDetails] =
    useState<PassengerDetails | null>(null);
  const [isNewUser, setIsNewUser] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingRef, setBookingRef] = useState("");

  if (!trainInfo || !selectedSeats) {
    navigate("/");
    return null;
  }

  const handleDetailsSubmit = (details: PassengerDetails, newUser: boolean) => {
    setPassengerDetails(details);
    setIsNewUser(newUser);
    setStep("payment");
  };

  const handlePaymentComplete = async () => {
    if (!passengerDetails) return;
    setIsProcessing(true);

    try {
      // Register new user if needed
      let userId = user?.id;
      if (isNewUser && !user) {
        const result = await register({
          ...passengerDetails,
          password: "temp123", // In real app, would ask for password
        });
        if (result.success && result.user) {
          userId = result.user.id;
        }
      }

      // Create booking and update seat status
      const booking = await createBooking(
        userId || "guest",
        trainInfo.scheduleId,
        trainInfo.trainId,
        trainInfo.date,
        selectedSeats,
        passengerDetails,
      );

      if (booking) {
        setBookingRef(booking.referenceNumber);
        setStep("success");
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (step === "success") {
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
            Your train tickets have been booked successfully.
          </p>
          <div className="bg-muted/50 rounded-lg p-4 mb-6">
            <p className="text-sm text-muted-foreground">Booking Reference</p>
            <p className="text-2xl font-bold text-accent">{bookingRef}</p>
          </div>
          <div className="space-y-3">
            <Button onClick={() => navigate("/dashboard")} className="w-full">
              View My Bookings
            </Button>
            <Button
              variant="outline"
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
              <PaymentPanel
                amount={totalAmount}
                onPaymentComplete={handlePaymentComplete}
                isProcessing={isProcessing}
              />
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
