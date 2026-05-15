import { Outlet, Link, useLocation } from "react-router";
import { useState, useEffect } from "react";
import {
  LayoutDashboard, Users, Bed, CreditCard,
  DoorOpen, ArrowLeft, Building2, LogOut
} from "lucide-react";
import { trpc } from "@/providers/trpc";
import AdminLogin from "@/pages/admin/Login";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Students", href: "/admin/students", icon: Users },
  { label: "Rooms", href: "/admin/rooms", icon: DoorOpen },
  { label: "Bed Allocation", href: "/admin/beds", icon: Bed },
  { label: "Payments", href: "/admin/payments", icon: CreditCard },
];

export default function AdminLayout() {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Check auth status from backend
  const { data: user, isLoading } = trpc.auth.me.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!isLoading) {
      setIsLoggedIn(!!user);
      setIsChecking(false);
    }
  }, [user, isLoading]);

  if (isChecking || isLoading) {
    return (
      <div className="min-h-screen bg-dark-brown flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Show login if not authenticated
  if (!isLoggedIn) {
    return <AdminLogin onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="flex h-screen bg-warm-ivory overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-dark-brown text-warm-ivory flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-warm-ivory/10">
          <Link
            to="/"
            className="flex items-center gap-2 text-amber-accent hover:text-amber-accent/80 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-body text-xs uppercase tracking-wider">Back to Website</span>
          </Link>
          <h2 className="font-display text-lg text-amber-accent mt-3 leading-tight">
            SRI KAPOTHESWARA
          </h2>
          <p className="font-body text-[10px] text-warm-ivory/40 uppercase tracking-wider mt-1">
            Admin Panel
          </p>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href ||
              (item.href !== "/admin" && location.pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-body text-sm transition-all duration-200 ${
                  isActive
                    ? "bg-amber-accent/20 text-amber-accent"
                    : "text-warm-ivory/60 hover:text-warm-ivory hover:bg-warm-ivory/5"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-warm-ivory/10 space-y-2">
          <div className="flex items-center gap-2 text-warm-ivory/40">
            <Building2 className="w-4 h-4" />
            <span className="font-body text-xs">3 Properties</span>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem("admin_auth");
              localStorage.removeItem("admin_token");
              window.location.reload();
            }}
            className="flex items-center gap-2 w-full px-3 py-2 text-red-400/60 hover:text-red-400 hover:bg-red-400/10 rounded-lg font-body text-xs transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-warm-taupe/10 px-8 py-4 flex items-center justify-between flex-shrink-0">
          <h1 className="font-display text-xl text-deep-saffron">
            {NAV_ITEMS.find(n => location.pathname === n.href || (n.href !== "/admin" && location.pathname.startsWith(n.href)))?.label || "Admin"}
          </h1>
          <div className="font-body text-sm text-warm-taupe">
            {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
