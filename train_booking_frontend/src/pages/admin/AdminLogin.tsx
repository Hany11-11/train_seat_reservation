import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Train, Lock } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { adminLogin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await adminLogin(email, password);
    if (result.success) {
      navigate("/admin");
    } else {
      setError(result.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-sidebar-primary flex items-center justify-center mx-auto mb-4">
            <Train className="w-8 h-8 text-sidebar-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-primary-foreground">
            Admin Portal
          </h1>
          <p className="text-primary-foreground/70">
            Railway Management System
          </p>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full">
              <Lock className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Demo: admin@railway.lk / admin123
          </p>
        </div>

        <p className="text-center text-sm text-primary-foreground/70 mt-4">
          <Link to="/" className="hover:text-primary-foreground">
            ← Back to Home
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
