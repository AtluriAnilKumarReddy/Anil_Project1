import { useState } from "react";
import { Link } from "react-router";
import {
  CheckCircle, XCircle, AlertTriangle, Clock,
  Calendar, RefreshCw, Search, IndianRupee, Phone, MessageCircle
} from "lucide-react";
import { trpc } from "@/providers/trpc";

const MONTHS = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

export default function AdminPayments() {
  const [view, setView] = useState<'all' | 'student'>('all');
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [showGenerate, setShowGenerate] = useState(false);
  const [genMonth, setGenMonth] = useState(MONTHS[new Date().getMonth()]);
  const [genYear, setGenYear] = useState(new Date().getFullYear());
  const [genDueDay, setGenDueDay] = useState(5);

  const utils = trpc.useUtils();
  const { data: stats } = trpc.student.dashboardStats.useQuery();
  const { data: allStudents } = trpc.student.list.useQuery({ status: "active" });
  const { data: allPayments } = trpc.payment.list.useQuery();
  const { data: studentStatus } = trpc.student.getPaymentStatus.useQuery(
    { studentId: selectedStudentId! },
    { enabled: !!selectedStudentId }
  );

  const markPaid = trpc.payment.markPaid.useMutation({
    onSuccess: () => { utils.payment.list.invalidate(); utils.student.dashboardStats.invalidate(); utils.student.getPaymentStatus.invalidate(); },
  });
  const checkOverdue = trpc.payment.checkOverdue.useMutation({
    onSuccess: () => { utils.payment.list.invalidate(); utils.student.dashboardStats.invalidate(); },
  });
  const generateMonthly = trpc.payment.generateMonthly.useMutation({
    onSuccess: (data) => {
      utils.payment.list.invalidate();
      utils.student.dashboardStats.invalidate();
      alert(`Generated ${data.created} payments. Skipped ${data.skipped}.`);
      setShowGenerate(false);
    },
  });
  const updateAdvance = trpc.student.updateAdvance.useMutation({
    onSuccess: () => { utils.student.list.invalidate(); utils.student.getPaymentStatus.invalidate(); utils.student.dashboardStats.invalidate(); },
  });

  const currentYear = new Date().getFullYear();
  const currentMonth = MONTHS[new Date().getMonth()];

  // Get payment status for a specific student and month
  const getStudentMonthPayment = (studentId: number, month: string, year: number) => {
    return allPayments?.find(p => p.studentId === studentId && p.month === month && p.year === year);
  };

  // Filter students by search
  const filteredStudents = allStudents?.filter(s =>
    !search || s.fullName.toLowerCase().includes(search.toLowerCase()) || s.phone.includes(search)
  );

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Students", value: stats?.totalStudents ?? 0, color: "text-warm-brown", bg: "bg-warm-taupe/10" },
          { label: "Active", value: stats?.activeStudents ?? 0, color: "text-green-600", bg: "bg-green-600/10" },
          { label: "Advance Paid", value: stats?.advancePaid ?? 0, color: "text-deep-saffron", bg: "bg-deep-saffron/10" },
          { label: "Advance Pending", value: stats?.advancePending ?? 0, color: "text-amber-accent", bg: "bg-amber-accent/10" },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-xl p-4`}>
            <p className="font-body text-xs text-warm-taupe uppercase">{s.label}</p>
            <p className={`font-display text-2xl ${s.color} mt-1`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* View Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button onClick={() => { setView('all'); setSelectedStudentId(null); }}
            className={`px-5 py-2 rounded-full font-body text-sm transition-colors ${view === 'all' ? 'bg-deep-saffron text-warm-ivory' : 'bg-white text-warm-taupe border border-warm-taupe/20'}`}>
            All Students
          </button>
          <button onClick={() => setView('student')}
            className={`px-5 py-2 rounded-full font-body text-sm transition-colors ${view === 'student' ? 'bg-deep-saffron text-warm-ivory' : 'bg-white text-warm-taupe border border-warm-taupe/20'}`}>
            By Student
          </button>
        </div>
        <div className="flex gap-2">
          <button onClick={() => checkOverdue.mutate()}
            className="px-4 py-2 border border-red-400 text-red-500 rounded-full font-body text-sm hover:bg-red-50 transition-colors">
            <RefreshCw className="w-4 h-4 inline mr-1" /> Check Overdue
          </button>
          <button onClick={() => setShowGenerate(!showGenerate)}
            className="px-5 py-2 bg-deep-saffron text-warm-ivory rounded-full font-body text-sm font-medium hover:bg-amber-accent transition-colors">
            <Calendar className="w-4 h-4 inline mr-1" /> Generate Monthly
          </button>
        </div>
      </div>

      {/* Generate Monthly Form */}
      {showGenerate && (
        <div className="bg-white rounded-xl border border-warm-taupe/10 p-6">
          <h3 className="font-display text-lg text-deep-saffron mb-4">Generate Monthly Payments for All Active Students</h3>
          <div className="flex items-end gap-4">
            <div>
              <label className="block font-body text-sm text-warm-brown mb-1">Month</label>
              <select value={genMonth} onChange={e => setGenMonth(e.target.value)} className="px-4 py-2.5 border rounded-lg font-body text-sm">
                {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-body text-sm text-warm-brown mb-1">Year</label>
              <input type="number" value={genYear} onChange={e => setGenYear(parseInt(e.target.value))} className="px-4 py-2.5 border rounded-lg font-body text-sm w-24" />
            </div>
            <div>
              <label className="block font-body text-sm text-warm-brown mb-1">Due Day</label>
              <input type="number" min={1} max={31} value={genDueDay} onChange={e => setGenDueDay(parseInt(e.target.value))} className="px-4 py-2.5 border rounded-lg font-body text-sm w-20" />
            </div>
            <button onClick={() => generateMonthly.mutate({ month: genMonth, year: genYear, dueDate: `${genYear}-${String(MONTHS.indexOf(genMonth) + 1).padStart(2, "0")}-${String(genDueDay).padStart(2, "0")}` })}
              disabled={generateMonthly.isPending}
              className="px-6 py-2.5 bg-deep-saffron text-warm-ivory rounded-full font-body text-sm font-medium hover:bg-amber-accent transition-colors disabled:opacity-50">
              {generateMonthly.isPending ? "Generating..." : "Generate"}
            </button>
          </div>
        </div>
      )}

      {/* VIEW 1: All Students with Monthly Status */}
      {view === 'all' && (
        <>
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-warm-taupe" />
            <input type="text" placeholder="Search student by name or phone..." value={search} onChange={e => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white border border-warm-taupe/20 rounded-lg font-body text-sm w-full focus:border-deep-saffron focus:outline-none" />
          </div>

          {/* Students Payment Table */}
          <div className="bg-white rounded-xl border border-warm-taupe/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-warm-taupe/10 bg-warm-ivory/50">
                    <th className="text-left px-4 py-3 font-body text-xs font-medium text-warm-taupe uppercase">Student</th>
                    <th className="text-left px-4 py-3 font-body text-xs font-medium text-warm-taupe uppercase">Advance</th>
                    <th className="text-left px-4 py-3 font-body text-xs font-medium text-warm-taupe uppercase">{currentMonth} {currentYear}</th>
                    <th className="text-left px-4 py-3 font-body text-xs font-medium text-warm-taupe uppercase">Rent</th>
                    <th className="text-left px-4 py-3 font-body text-xs font-medium text-warm-taupe uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents?.length === 0 && (
                    <tr><td colSpan={5} className="px-4 py-12 text-center font-body text-warm-taupe">No students found</td></tr>
                  )}
                  {filteredStudents?.map(s => {
                    const monthPayment = getStudentMonthPayment(s.id, currentMonth, currentYear);
                    const advancePaid = Number(s.advancePaid) >= 2000;
                    return (
                      <tr key={s.id} className="border-b border-warm-taupe/5 hover:bg-warm-ivory/30">
                        <td className="px-4 py-3">
                          <div className="font-body text-sm font-medium text-warm-brown">{s.fullName}</div>
                          <div className="font-body text-xs text-warm-taupe">{s.phone}</div>
                        </td>
                        <td className="px-4 py-3">
                          {advancePaid ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/10 text-green-600 rounded-full font-body text-xs">
                              <CheckCircle className="w-3 h-3" /> Paid
                            </span>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-500/10 text-red-500 rounded-full font-body text-xs">
                                <XCircle className="w-3 h-3" /> Pending
                              </span>
                              <button onClick={() => updateAdvance.mutate({ id: s.id, advancePaid: "2000" })}
                                className="px-2 py-1 bg-deep-saffron text-warm-ivory rounded font-body text-[10px] hover:bg-amber-accent transition-colors">
                                Mark Paid
                              </button>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {!monthPayment ? (
                            <span className="font-body text-xs text-warm-taupe">Not generated</span>
                          ) : monthPayment.status === 'paid' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/10 text-green-600 rounded-full font-body text-xs">
                              <CheckCircle className="w-3 h-3" /> Paid
                            </span>
                          ) : monthPayment.status === 'overdue' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-500/10 text-red-500 rounded-full font-body text-xs">
                              <AlertTriangle className="w-3 h-3" /> Overdue
                            </span>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-accent/10 text-amber-accent rounded-full font-body text-xs">
                                <Clock className="w-3 h-3" /> Pending
                              </span>
                              <button onClick={() => markPaid.mutate({ id: monthPayment.id, paidDate: new Date().toISOString().split("T")[0], paymentMode: "cash" })}
                                className="px-2 py-1 bg-green-500 text-white rounded font-body text-[10px] hover:bg-green-600 transition-colors">
                                Mark Paid
                              </button>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 font-body text-sm text-warm-brown">
                          <IndianRupee className="w-3 h-3 inline" /> {Number(s.monthlyRent).toLocaleString("en-IN")}
                        </td>
                        <td className="px-4 py-3">
                          <button onClick={() => { setSelectedStudentId(s.id); setView('student'); }}
                            className="px-3 py-1.5 border border-deep-saffron text-deep-saffron rounded-lg font-body text-xs hover:bg-deep-saffron hover:text-warm-ivory transition-colors">
                            View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* VIEW 2: Individual Student Payment Details */}
      {view === 'student' && studentStatus && (
        <div className="space-y-6">
          {/* Back button */}
          <button onClick={() => { setView('all'); setSelectedStudentId(null); }}
            className="px-4 py-2 border border-warm-taupe text-warm-taupe rounded-full font-body text-sm hover:bg-warm-taupe hover:text-warm-ivory transition-colors">
            Back to All Students
          </button>

          {/* Student Info Card */}
          <div className="bg-white rounded-xl border border-warm-taupe/10 p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-display text-xl text-warm-brown">{studentStatus.student.fullName}</h3>
                <p className="font-body text-sm text-warm-taupe">{studentStatus.student.phone}</p>
                <p className="font-body text-xs text-warm-taupe mt-1">
                  {studentStatus.student.hostel?.name} | Monthly Rent: <IndianRupee className="w-3 h-3 inline" /> {Number(studentStatus.student.monthlyRent).toLocaleString("en-IN")}
                </p>
              </div>
              <div className="flex gap-3">
                <a href={`tel:${studentStatus.student.phone}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-deep-saffron text-warm-ivory rounded-full font-body text-sm hover:bg-amber-accent transition-colors">
                  <Phone className="w-4 h-4" /> Call
                </a>
                <a href={`https://wa.me/${studentStatus.student.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-full font-body text-sm hover:bg-green-600 transition-colors">
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Advance Status */}
          <div className="bg-white rounded-xl border border-warm-taupe/10 p-6">
            <h4 className="font-display text-lg text-deep-saffron mb-4">Advance Payment</h4>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="font-body text-xs text-warm-taupe uppercase">Required</p>
                <p className="font-display text-2xl text-warm-brown"><IndianRupee className="w-5 h-5 inline" /> 2,000</p>
              </div>
              <div className="text-center">
                <p className="font-body text-xs text-warm-taupe uppercase">Paid</p>
                <p className={`font-display text-2xl ${Number(studentStatus.advancePaid) >= 2000 ? 'text-green-600' : 'text-red-500'}`}>
                  <IndianRupee className="w-5 h-5 inline" /> {Number(studentStatus.advancePaid).toLocaleString("en-IN")}
                </p>
              </div>
              <div>
                {Number(studentStatus.advancePaid) >= 2000 ? (
                  <span className="inline-flex items-center gap-1 px-4 py-2 bg-green-500/10 text-green-600 rounded-full font-body text-sm">
                    <CheckCircle className="w-4 h-4" /> Advance Fully Paid
                  </span>
                ) : (
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1 px-4 py-2 bg-red-500/10 text-red-500 rounded-full font-body text-sm">
                      <XCircle className="w-4 h-4" /> Pending: <IndianRupee className="w-3 h-3 inline" /> {2000 - Number(studentStatus.advancePaid)}
                    </span>
                    <button onClick={() => updateAdvance.mutate({ id: selectedStudentId!, advancePaid: "2000" })}
                      className="px-4 py-2 bg-deep-saffron text-warm-ivory rounded-full font-body text-sm hover:bg-amber-accent transition-colors">
                      Mark as Paid
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Monthly Payment History */}
          <div className="bg-white rounded-xl border border-warm-taupe/10 p-6">
            <h4 className="font-display text-lg text-deep-saffron mb-4">Monthly Rent History</h4>
            {studentStatus.payments.length === 0 ? (
              <p className="font-body text-sm text-warm-taupe text-center py-8">No payment records yet. Generate monthly payments first.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-warm-taupe/10">
                      <th className="text-left px-4 py-3 font-body text-xs text-warm-taupe uppercase">Month/Year</th>
                      <th className="text-left px-4 py-3 font-body text-xs text-warm-taupe uppercase">Amount</th>
                      <th className="text-left px-4 py-3 font-body text-xs text-warm-taupe uppercase">Due Date</th>
                      <th className="text-left px-4 py-3 font-body text-xs text-warm-taupe uppercase">Status</th>
                      <th className="text-left px-4 py-3 font-body text-xs text-warm-taupe uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentStatus.payments.map(p => (
                      <tr key={p.id} className="border-b border-warm-taupe/5">
                        <td className="px-4 py-3 font-body text-sm text-warm-brown">{p.month} {p.year}</td>
                        <td className="px-4 py-3 font-body text-sm text-warm-brown"><IndianRupee className="w-3 h-3 inline" /> {Number(p.amount).toLocaleString("en-IN")}</td>
                        <td className="px-4 py-3 font-body text-sm text-warm-brown">{p.dueDate instanceof Date ? p.dueDate.toLocaleDateString("en-IN") : String(p.dueDate)}</td>
                        <td className="px-4 py-3">
                          {p.status === 'paid' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/10 text-green-600 rounded-full font-body text-xs">
                              <CheckCircle className="w-3 h-3" /> Paid {p.paidDate && `on ${p.paidDate}`}
                            </span>
                          ) : p.status === 'overdue' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-500/10 text-red-500 rounded-full font-body text-xs">
                              <AlertTriangle className="w-3 h-3" /> Overdue
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-accent/10 text-amber-accent rounded-full font-body text-xs">
                              <Clock className="w-3 h-3" /> Pending
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {p.status !== 'paid' && (
                            <button onClick={() => markPaid.mutate({ id: p.id, paidDate: new Date().toISOString().split("T")[0], paymentMode: "cash" })}
                              className="px-3 py-1.5 bg-green-500 text-white rounded-lg font-body text-xs hover:bg-green-600 transition-colors">
                              Mark Paid
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4 text-center">
              <p className="font-body text-xs text-green-600 uppercase">Total Paid</p>
              <p className="font-display text-xl text-green-600 mt-1"><IndianRupee className="w-5 h-5 inline" /> {studentStatus.totalPaid.toLocaleString("en-IN")}</p>
            </div>
            <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 text-center">
              <p className="font-body text-xs text-red-500 uppercase">Total Pending</p>
              <p className="font-display text-xl text-red-500 mt-1"><IndianRupee className="w-5 h-5 inline" /> {studentStatus.totalPending.toLocaleString("en-IN")}</p>
            </div>
            <div className="bg-deep-saffron/5 border border-deep-saffron/20 rounded-xl p-4 text-center">
              <p className="font-body text-xs text-deep-saffron uppercase">Monthly Rent</p>
              <p className="font-display text-xl text-deep-saffron mt-1"><IndianRupee className="w-5 h-5 inline" /> {Number(studentStatus.student.monthlyRent).toLocaleString("en-IN")}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
