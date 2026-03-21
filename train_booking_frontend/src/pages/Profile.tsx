import { Navigate, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  BadgeCheck,
  CreditCard,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { useAuth } from "@/hooks/useAuth";

const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated || !user || isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">My Profile</h1>
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-card border border-border rounded-xl p-6 space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-border">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Signed in as</p>
              <p className="text-lg font-semibold text-foreground">
                {user.name}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-border p-4">
              <p className="text-xs text-muted-foreground mb-2">Email</p>
              <p className="text-sm font-medium flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                {user.email}
              </p>
            </div>

            <div className="rounded-lg border border-border p-4">
              <p className="text-xs text-muted-foreground mb-2">Mobile</p>
              <p className="text-sm font-medium flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                {user.mobile}
              </p>
            </div>

            <div className="rounded-lg border border-border p-4">
              <p className="text-xs text-muted-foreground mb-2">NIC</p>
              <p className="text-sm font-medium flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-muted-foreground" />
                {user.nic}
              </p>
            </div>

            <div className="rounded-lg border border-border p-4">
              <p className="text-xs text-muted-foreground mb-2">Role</p>
              <p className="text-sm font-medium capitalize flex items-center gap-2">
                <BadgeCheck className="w-4 h-4 text-muted-foreground" />
                {user.role}
              </p>
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <Button onClick={() => navigate("/dashboard")}>
              View My Bookings
            </Button>
            <Button variant="outline" onClick={() => navigate("/")}>
              Go Home
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
