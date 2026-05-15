import { useState } from "react";
import { Link } from "react-router";
import { Search, Plus, Edit2, Trash2 } from "lucide-react";
import { trpc } from "@/providers/trpc";

export default function AdminStudents() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const utils = trpc.useUtils();
  const { data: students, isLoading } = trpc.student.list.useQuery({
    search: search || undefined,
    status: statusFilter === "all" ? undefined : (statusFilter as "active" | "vacated" | "pending"),
  });

  const deleteStudent = trpc.student.delete.useMutation({
    onSuccess: () => utils.student.list.invalidate(),
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-warm-taupe" />
            <input
              type="text"
              placeholder="Search by name, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white border border-warm-taupe/20 rounded-lg font-body text-sm text-warm-brown focus:border-deep-saffron focus:outline-none w-72"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-white border border-warm-taupe/20 rounded-lg font-body text-sm text-warm-brown focus:border-deep-saffron focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="vacated">Vacated</option>
          </select>
        </div>
        <Link
          to="/admin/students/new"
          className="flex items-center gap-2 px-6 py-2.5 bg-deep-saffron text-warm-ivory rounded-full font-body text-sm font-medium hover:bg-amber-accent transition-colors"
        >
          <Plus className="w-4 h-4" />
          Register Student
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-warm-taupe/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-warm-taupe/10 bg-warm-ivory/50">
                <th className="text-left px-6 py-4 font-body text-xs font-medium text-warm-taupe uppercase tracking-wider">Name</th>
                <th className="text-left px-6 py-4 font-body text-xs font-medium text-warm-taupe uppercase tracking-wider">Phone</th>
                <th className="text-left px-6 py-4 font-body text-xs font-medium text-warm-taupe uppercase tracking-wider">Hostel</th>
                <th className="text-left px-6 py-4 font-body text-xs font-medium text-warm-taupe uppercase tracking-wider">Occupation</th>
                <th className="text-left px-6 py-4 font-body text-xs font-medium text-warm-taupe uppercase tracking-wider">Rent</th>
                <th className="text-left px-6 py-4 font-body text-xs font-medium text-warm-taupe uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-4 font-body text-xs font-medium text-warm-taupe uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center font-body text-warm-taupe">Loading...</td></tr>
              ) : students?.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center font-body text-warm-taupe">No students found. Register your first student.</td></tr>
              ) : (
                students?.map((s) => (
                  <tr key={s.id} className="border-b border-warm-taupe/5 hover:bg-warm-ivory/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-body text-sm font-medium text-warm-brown">{s.fullName}</div>
                      {s.companyOrCollege && <div className="font-body text-xs text-warm-taupe">{s.companyOrCollege}</div>}
                    </td>
                    <td className="px-6 py-4 font-body text-sm text-warm-brown">{s.phone}</td>
                    <td className="px-6 py-4 font-body text-sm text-warm-brown">
                      {s.hostel ? s.hostel.name.split("SRI KAPOTHESWARA ")[1]?.replace(" WOMEN'S PG", "") ?? s.hostel.name : "-"}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full font-body text-xs font-medium ${
                        s.occupation === "working" ? "bg-amber-accent/10 text-amber-accent" : "bg-blue-500/10 text-blue-600"
                      }`}>
                        {s.occupation}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-body text-sm text-warm-brown">Rs. {Number(s.monthlyRent).toLocaleString("en-IN")}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full font-body text-xs font-medium ${
                        s.status === "active" ? "bg-green-500/10 text-green-600" :
                        s.status === "pending" ? "bg-amber-accent/10 text-amber-accent" :
                        "bg-red-500/10 text-red-500"
                      }`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link to={`/admin/students/${s.id}`} className="p-1.5 rounded-lg hover:bg-warm-ivory text-warm-taupe hover:text-deep-saffron transition-colors" title="Edit">
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this student?")) {
                              deleteStudent.mutate({ id: s.id });
                            }
                          }}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-warm-taupe hover:text-red-500 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
