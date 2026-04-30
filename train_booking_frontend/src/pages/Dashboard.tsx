import { useState, useEffect, useRef } from "react";
import { TicketModal } from "@/components/organisms/TicketModal";

import { Navigate, useNavigate } from "react-router-dom";
import {
  Train as TrainIcon,
  Calendar,
  LogOut,
  Ticket,
  Loader2,
  Clock,
} from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Schedule } from "@/types/schedule";
import { Badge } from "@/components/atoms/Badge";
import { useAuth } from "@/hooks/useAuth";
import { useBooking } from "@/hooks/useBooking";
import { useTrains } from "@/hooks/useTrains";
import { useStations } from "@/hooks/useStations";
import { scheduleService } from "@/services/scheduleService";
import { formatDate, formatCurrency } from "@/utils/fareCalculator";
import { Booking } from "@/types/booking";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, isLoading: authLoading } = useAuth();
  const { getUserBookings } = useBooking();
  const { trains } = useTrains();
  const { stations } = useStations();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [scheduleDetails, setScheduleDetails] = useState<
    Record<string, Schedule>
  >({});
  const [ticketModal, setTicketModal] = useState<{
    booking: Booking | null;
    open: boolean;
  }>({ booking: null, open: false });
  const ticketRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!isAuthenticated) return;
      setIsLoading(true);
      try {
        const data = await getUserBookings();
        setBookings(data);
        // Fetch all unique schedule details in parallel
        const uniqueScheduleIds = Array.from(
          new Set(data.map((b) => b.scheduleId)),
        );
        const details: Record<string, Schedule> = {};
        await Promise.all(
          uniqueScheduleIds.map(async (id) => {
            try {
              details[id] = await scheduleService.getScheduleById(
                id,
                trains,
                stations,
              );
            } catch (err) {
              // Optionally log error
            }
          }),
        );
        setScheduleDetails(details);
      } finally {
        setIsLoading(false);
      }
    };
    void fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getUserBookings, isAuthenticated, trains.length, stations.length]);

  if (authLoading) {
    return null;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  // Split bookings into upcoming and past
  const today = new Date().toISOString().slice(0, 10);
  const upcomingBookings: Booking[] = [];
  const pastBookings: Booking[] = [];
  bookings.forEach((b) => {
    if (b.travelDate >= today && b.status === "confirmed") {
      upcomingBookings.push(b);
    } else {
      pastBookings.push(b);
    }
  });

  const handleViewTicket = (booking: Booking) => {
    setTicketModal({ booking, open: true });
  };

  const handleCloseTicket = () => {
    setTicketModal({ booking: null, open: false });
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
    pdf.save("ticket.pdf");
  };

  const renderBookingDetails = (booking: Booking) => {
    const schedule = scheduleDetails[booking.scheduleId];
    const trainName = schedule?.trainData?.name || "-";
    const fromStation = schedule?.fromStationData?.name || "-";
    const toStation = schedule?.toStationData?.name || "-";
    // Normalize station IDs for comparison
    type StationLike =
      | string
      | { id?: string; _id?: string }
      | null
      | undefined;
    const getStationId = (station: StationLike): string => {
      if (!station) return "";
      if (typeof station === "string") return station;
      if (station.id) return station.id;
      if (station._id) return station._id;
      return "";
    };
    let departureTime = "-",
      arrivalTime = "-";
    if (schedule?.route?.length) {
      const fromStationId = getStationId(schedule.fromStation);
      const toStationId = getStationId(schedule.toStation);
      const fromStop = schedule.route.find(
        (r) => getStationId(r.station) === fromStationId,
      );
      const toStop = schedule.route.find(
        (r) => getStationId(r.station) === toStationId,
      );
      if (fromStop) departureTime = fromStop.departureTime || "-";
      if (toStop) arrivalTime = toStop.arrivalTime || "-";
    }
    const seatNumbers = booking.seats.map((s) => s.seatNumber).join(", ");
    const classType = booking.seats[0]?.classType || "-";
    return (
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Booking Reference</p>
            <p className="font-bold text-accent">{booking.referenceNumber}</p>
          </div>
          <Badge
            variant={booking.status === "confirmed" ? "success" : "secondary"}
          >
            {booking.status}
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mb-2">
          <div className="flex items-center gap-2">
            <TrainIcon className="w-4 h-4 text-muted-foreground" />
            <span>{trainName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span>{formatDate(booking.travelDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>From:</span>
            <span>{fromStation}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>To:</span>
            <span>{toStation}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span>Dep: {departureTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span>Arr: {arrivalTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Class:</span>
            <span>{classType}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Seats:</span>
            <span>{seatNumbers}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Price:</span>
            <span>{formatCurrency(booking.totalAmount)}</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Button size="sm" onClick={() => handleViewTicket(booking)}>
              View Ticket
            </Button>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          Booked on: {formatDate(booking.createdAt)}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
              <TrainIcon className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">RailBooker</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {user.name}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Ticket Modal (only one, at root) */}
        <TicketModal
          ref={ticketRef}
          booking={ticketModal.booking as Booking}
          schedule={
            ticketModal.booking
              ? scheduleDetails[ticketModal.booking.scheduleId]
              : undefined
          }
          open={ticketModal.open}
          onClose={handleCloseTicket}
          onDownload={handleDownloadTicket}
        />
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-foreground">My Bookings</h1>
          <Button onClick={() => navigate("/")}>Book New Trip</Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
          </div>
        ) : (
          <>
            <section className="mb-10">
              <h2 className="text-lg font-semibold mb-3">Upcoming Bookings</h2>
              {upcomingBookings.length === 0 ? (
                <div className="bg-card rounded-xl border border-border p-8 text-center">
                  <Ticket className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <div className="text-muted-foreground">
                    No upcoming bookings
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingBookings.map(renderBookingDetails)}
                </div>
              )}
            </section>
            <section>
              <h2 className="text-lg font-semibold mb-3">Past Bookings</h2>
              {pastBookings.length === 0 ? (
                <div className="bg-card rounded-xl border border-border p-8 text-center">
                  <Ticket className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <div className="text-muted-foreground">No past bookings</div>
                </div>
              ) : (
                <div className="space-y-4">
                  {pastBookings.map(renderBookingDetails)}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
