import { Users, CreditCard, AlertTriangle, TrendingUp, CheckCircle, XCircle } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { Link } from "react-router";

export default function AdminDashboard() {
  const { data: stats } = trpc.student.dashboardStats.useQuery();

  const cards = [
    { label: "Total Students", value: stats?.totalStudents ?? 0, icon: Users, color: "text-deep-saffron", bg: "bg-deep-saffron/10" },
    { label: "Active Students", value: stats?.activeStudents ?? 0, icon: TrendingUp, color: "text-green-600", bg: "bg-green-600/10" },
    { label: "Advance Paid", value: stats?.advancePaid ?? 0, icon: CheckCircle, color: "text-green-600", bg: "bg-green-600/10" },
    { label: "Advance Pending", value: stats?.advancePending ?? 0, icon: XCircle, color: "text-red-500", bg: "bg-red-500/10" },
    { label: "Pending Rent", value: stats?.pendingPayments ?? 0, icon: CreditCard, color: "text-deep-saffron", bg: "bg-deep-saffron/10" },
    { label: "Overdue Rent", value: stats?.overduePayments ?? 0, icon: AlertTriangle, color: "text-red-500", bg: "bg-red-500/10" },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-xl p-6 border border-warm-taupe/10 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-body text-sm text-warm-taupe">{card.label}</p>
                  <p className="font-display text-3xl text-warm-brown mt-1">{card.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${card.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 border border-warm-taupe/10 shadow-sm">
        <h3 className="font-display text-lg text-warm-brown mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin/students/new"
            className="px-6 py-3 bg-deep-saffron text-warm-ivory rounded-full font-body text-sm font-medium hover:bg-amber-accent transition-colors"
          >
            + Register New Student
          </Link>
          <Link
            to="/admin/payments"
            className="px-6 py-3 border border-deep-saffron text-deep-saffron rounded-full font-body text-sm font-medium hover:bg-deep-saffron hover:text-warm-ivory transition-colors"
          >
            Manage Payments
          </Link>
          <Link
            to="/admin/rooms"
            className="px-6 py-3 border border-warm-taupe text-warm-taupe rounded-full font-body text-sm font-medium hover:bg-warm-taupe hover:text-warm-ivory transition-colors"
          >
            Manage Rooms
          </Link>
        </div>
      </div>
    </div>
  );
}
