import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Train, LogIn, LogOut, User, Ticket } from "lucide-react";
import { TrainSearchForm } from "@/components/organisms/TrainSearchForm";
import { Button } from "@/components/atoms/Button";
import { useBooking, SearchParams } from "@/hooks/useBooking";
import { useAuth } from "@/hooks/useAuth";
import AnimatedTrainBackground from "@/components/atoms/AnimatedTrainBackground";

const Search = () => {
  const navigate = useNavigate();
  const { searchTrains } = useBooking();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  const handleSearch = async (params: SearchParams) => {
    const results = await searchTrains(params);
    navigate("/results", {
      state: {
        searchParams: params,
        results,
      },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
              <Train className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-foreground">RailBooker</h1>
              <p className="text-xs text-muted-foreground">
                Sri Lanka Railways
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated && user && !isAdmin ? (
              <>
                <span className="text-sm text-muted-foreground">
                  Welcome, {user.name}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/dashboard")}
                >
                  <Ticket className="w-4 h-4 mr-2" />
                  My Bookings
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/profile")}
                >
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Button>
                <Button variant="outline" size="sm" onClick={() => logout()}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate("/login")}>
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/admin/login")}
                >
                  Admin
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="gradient-hero px-4 relative overflow-hidden flex flex-col justify-center items-center"
        style={{ minHeight: 340 }}
      >
        <div className="container mx-auto text-center relative z-10 pt-10 pb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Book Your Train Journey
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Experience seamless train booking with live seat selection across
            Sri Lanka's railway network
          </p>
        </div>
      </section>

      {/* Search Form */}
      <section className="container mx-auto px-4 -mt-10 relative z-10 pb-20">
        <TrainSearchForm onSearch={handleSearch} />

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {[
            {
              title: "Live Seat Selection",
              desc: "Choose your preferred seats in real-time",
            },
            {
              title: "Instant Confirmation",
              desc: "Get your booking confirmed immediately",
            },
            {
              title: "Secure Payments",
              desc: "Multiple payment options with SSL security",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="bg-card rounded-xl border border-border p-6 text-center"
            >
              <h3 className="font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Search;
