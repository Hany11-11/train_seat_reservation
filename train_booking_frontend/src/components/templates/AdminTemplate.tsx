import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Train,
  LayoutDashboard,
  Calendar,
  DollarSign,
  Armchair,
  Users,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminTemplateProps {
  children: ReactNode;
  title: string;
  onLogout: () => void;
}

const navItems = [
  { path: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/admin/trains", icon: Train, label: "Trains" },
  { path: "/admin/schedules", icon: Calendar, label: "Schedules" },
  { path: "/admin/prices", icon: DollarSign, label: "Prices" },
  { path: "/admin/seats", icon: Armchair, label: "Seats" },
  { path: "/admin/users", icon: Users, label: "Users" },
];

export const AdminTemplate = ({
  children,
  title,
  onLogout,
}: AdminTemplateProps) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
        <div className="p-6 border-b border-sidebar-border">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sidebar-primary flex items-center justify-center">
              <Train className="w-5 h-5 text-sidebar-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-sidebar-foreground">RailAdmin</h1>
              <p className="text-xs text-sidebar-foreground/60">
                Management Panel
              </p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                location.pathname === item.path
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <button
            onClick={onLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-card border-b border-border px-8 py-6">
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        </header>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
};
