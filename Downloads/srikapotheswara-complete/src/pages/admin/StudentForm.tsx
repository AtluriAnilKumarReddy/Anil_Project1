import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { ArrowLeft, Save } from "lucide-react";
import { trpc } from "@/providers/trpc";

const EMPTY_FORM = {
  hostelId: 1,
  fullName: "",
  phone: "",
  email: "",
  dateOfBirth: "",
  aadharNumber: "",
  occupation: "student" as "working" | "student",
  companyOrCollege: "",
  parentName: "",
  parentPhone: "",
  emergencyContact: "",
  emergencyRelation: "",
  address: "",
  monthlyRent: "",
  deposit: "0",
  joiningDate: new Date().toISOString().split("T")[0],
  notes: "",
  bedId: undefined as number | undefined,
};

export default function AdminStudentForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;
  const studentId = id ? parseInt(id) : 0;

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const utils = trpc.useUtils();
  const { data: hostels } = trpc.hostel.list.useQuery();
  const { data: vacantBeds } = trpc.bed.listVacant.useQuery(
    { hostelId: form.hostelId },
    { enabled: !!form.hostelId }
  );
  const { data: existingStudent } = trpc.student.getById.useQuery(
    { id: studentId },
    { enabled: isEdit }
  );

  const createStudent = trpc.student.create.useMutation({
    onSuccess: () => {
      utils.student.list.invalidate();
      utils.student.dashboardStats.invalidate();
      navigate("/admin/students");
    },
  });

  const updateStudent = trpc.student.update.useMutation({
    onSuccess: () => {
      utils.student.list.invalidate();
      utils.student.dashboardStats.invalidate();
      navigate("/admin/students");
    },
  });

  useEffect(() => {
    if (existingStudent) {
      setForm({
        hostelId: existingStudent.hostelId,
        fullName: existingStudent.fullName,
        phone: existingStudent.phone,
        email: existingStudent.email || "",
        dateOfBirth: existingStudent.dateOfBirth ? (existingStudent.dateOfBirth instanceof Date ? existingStudent.dateOfBirth.toISOString().split("T")[0] : String(existingStudent.dateOfBirth).split("T")[0]) : "",
        aadharNumber: existingStudent.aadharNumber || "",
        occupation: existingStudent.occupation,
        companyOrCollege: existingStudent.companyOrCollege || "",
        parentName: existingStudent.parentName || "",
        parentPhone: existingStudent.parentPhone || "",
        emergencyContact: existingStudent.emergencyContact || "",
        emergencyRelation: existingStudent.emergencyRelation || "",
        address: existingStudent.address || "",
        monthlyRent: String(existingStudent.monthlyRent),
        deposit: String(existingStudent.deposit),
        joiningDate: existingStudent.joiningDate instanceof Date ? existingStudent.joiningDate.toISOString().split("T")[0] : String(existingStudent.joiningDate).split("T")[0],
        notes: existingStudent.notes || "",
        bedId: existingStudent.bedId ?? undefined,
      });
    }
  }, [existingStudent]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.fullName.trim()) newErrors.fullName = "Name is required";
    if (!form.phone.trim()) newErrors.phone = "Phone is required";
    if (!form.monthlyRent) newErrors.monthlyRent = "Monthly rent is required";
    if (!form.joiningDate) newErrors.joiningDate = "Joining date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const data = {
      hostelId: form.hostelId,
      fullName: form.fullName,
      phone: form.phone,
      email: form.email || undefined,
      dateOfBirth: form.dateOfBirth || undefined,
      aadharNumber: form.aadharNumber || undefined,
      occupation: form.occupation,
      companyOrCollege: form.companyOrCollege || undefined,
      parentName: form.parentName || undefined,
      parentPhone: form.parentPhone || undefined,
      emergencyContact: form.emergencyContact || undefined,
      emergencyRelation: form.emergencyRelation || undefined,
      address: form.address || undefined,
      monthlyRent: form.monthlyRent,
      deposit: form.deposit || "0",
      joiningDate: form.joiningDate,
      notes: form.notes || undefined,
      bedId: form.bedId,
    };

    if (isEdit) {
      updateStudent.mutate({ id: studentId, ...data });
    } else {
      createStudent.mutate(data);
    }
  };

  const updateField = (field: string, value: unknown) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => { const e = { ...prev }; delete e[field]; return e; });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/admin/students" className="p-2 rounded-lg hover:bg-warm-taupe/10 text-warm-taupe transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h2 className="font-display text-2xl text-warm-brown">
          {isEdit ? "Edit Student" : "Register New Student"}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-warm-taupe/10 shadow-sm p-8 space-y-6">
        {/* Personal Info */}
        <div>
          <h3 className="font-display text-lg text-deep-saffron mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-body text-sm font-medium text-warm-brown mb-1">Full Name *</label>
              <input
                value={form.fullName}
                onChange={(e) => updateField("fullName", e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-lg font-body text-sm focus:border-deep-saffron focus:outline-none ${errors.fullName ? "border-red-400" : "border-warm-taupe/20"}`}
              />
              {errors.fullName && <p className="font-body text-xs text-red-500 mt-1">{errors.fullName}</p>}
            </div>
            <div>
              <label className="block font-body text-sm font-medium text-warm-brown mb-1">Phone *</label>
              <input
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                placeholder="+91 XXXXX XXXXX"
                className={`w-full px-4 py-2.5 border rounded-lg font-body text-sm focus:border-deep-saffron focus:outline-none ${errors.phone ? "border-red-400" : "border-warm-taupe/20"}`}
              />
              {errors.phone && <p className="font-body text-xs text-red-500 mt-1">{errors.phone}</p>}
            </div>
            <div>
              <label className="block font-body text-sm font-medium text-warm-brown mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                className="w-full px-4 py-2.5 border border-warm-taupe/20 rounded-lg font-body text-sm focus:border-deep-saffron focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-body text-sm font-medium text-warm-brown mb-1">Date of Birth</label>
              <input
                type="date"
                value={form.dateOfBirth}
                onChange={(e) => updateField("dateOfBirth", e.target.value)}
                className="w-full px-4 py-2.5 border border-warm-taupe/20 rounded-lg font-body text-sm focus:border-deep-saffron focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-body text-sm font-medium text-warm-brown mb-1">Aadhar Number</label>
              <input
                value={form.aadharNumber}
                onChange={(e) => updateField("aadharNumber", e.target.value)}
                className="w-full px-4 py-2.5 border border-warm-taupe/20 rounded-lg font-body text-sm focus:border-deep-saffron focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-body text-sm font-medium text-warm-brown mb-1">Occupation</label>
              <select
                value={form.occupation}
                onChange={(e) => updateField("occupation", e.target.value)}
                className="w-full px-4 py-2.5 border border-warm-taupe/20 rounded-lg font-body text-sm focus:border-deep-saffron focus:outline-none"
              >
                <option value="student">Student</option>
                <option value="working">Working</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block font-body text-sm font-medium text-warm-brown mb-1">
                {form.occupation === "student" ? "College Name" : "Company Name"}
              </label>
              <input
                value={form.companyOrCollege}
                onChange={(e) => updateField("companyOrCollege", e.target.value)}
                className="w-full px-4 py-2.5 border border-warm-taupe/20 rounded-lg font-body text-sm focus:border-deep-saffron focus:outline-none"
              />
            </div>
          </div>
        </div>

        <hr className="border-warm-taupe/10" />

        {/* Emergency Contact */}
        <div>
          <h3 className="font-display text-lg text-deep-saffron mb-4">Emergency Contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-body text-sm font-medium text-warm-brown mb-1">Parent/Guardian Name</label>
              <input value={form.parentName} onChange={(e) => updateField("parentName", e.target.value)}
                className="w-full px-4 py-2.5 border border-warm-taupe/20 rounded-lg font-body text-sm focus:border-deep-saffron focus:outline-none" />
            </div>
            <div>
              <label className="block font-body text-sm font-medium text-warm-brown mb-1">Parent Phone</label>
              <input value={form.parentPhone} onChange={(e) => updateField("parentPhone", e.target.value)}
                className="w-full px-4 py-2.5 border border-warm-taupe/20 rounded-lg font-body text-sm focus:border-deep-saffron focus:outline-none" />
            </div>
            <div>
              <label className="block font-body text-sm font-medium text-warm-brown mb-1">Emergency Contact</label>
              <input value={form.emergencyContact} onChange={(e) => updateField("emergencyContact", e.target.value)}
                className="w-full px-4 py-2.5 border border-warm-taupe/20 rounded-lg font-body text-sm focus:border-deep-saffron focus:outline-none" />
            </div>
            <div>
              <label className="block font-body text-sm font-medium text-warm-brown mb-1">Relation</label>
              <input value={form.emergencyRelation} onChange={(e) => updateField("emergencyRelation", e.target.value)}
                className="w-full px-4 py-2.5 border border-warm-taupe/20 rounded-lg font-body text-sm focus:border-deep-saffron focus:outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block font-body text-sm font-medium text-warm-brown mb-1">Permanent Address</label>
              <textarea value={form.address} onChange={(e) => updateField("address", e.target.value)} rows={3}
                className="w-full px-4 py-2.5 border border-warm-taupe/20 rounded-lg font-body text-sm focus:border-deep-saffron focus:outline-none resize-none" />
            </div>
          </div>
        </div>

        <hr className="border-warm-taupe/10" />

        {/* Hostel & Bed */}
        <div>
          <h3 className="font-display text-lg text-deep-saffron mb-4">Hostel & Accommodation</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-body text-sm font-medium text-warm-brown mb-1">Hostel *</label>
              <select value={form.hostelId} onChange={(e) => updateField("hostelId", parseInt(e.target.value))}
                className="w-full px-4 py-2.5 border border-warm-taupe/20 rounded-lg font-body text-sm focus:border-deep-saffron focus:outline-none">
                {hostels?.map(h => (
                  <option key={h.id} value={h.id}>{h.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-body text-sm font-medium text-warm-brown mb-1">Select Bed</label>
              <select value={form.bedId || ""} onChange={(e) => updateField("bedId", e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full px-4 py-2.5 border border-warm-taupe/20 rounded-lg font-body text-sm focus:border-deep-saffron focus:outline-none">
                <option value="">-- Select a bed --</option>
                {vacantBeds?.map(b => (
                  <option key={b.id} value={b.id}>
                    Room {b.room.roomNumber} - Bed {b.bedNumber} (Floor {b.room.floor})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-body text-sm font-medium text-warm-brown mb-1">Monthly Rent *</label>
              <input type="number" value={form.monthlyRent} onChange={(e) => updateField("monthlyRent", e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-lg font-body text-sm focus:border-deep-saffron focus:outline-none ${errors.monthlyRent ? "border-red-400" : "border-warm-taupe/20"}`} />
              {errors.monthlyRent && <p className="font-body text-xs text-red-500 mt-1">{errors.monthlyRent}</p>}
            </div>
            <div>
              <label className="block font-body text-sm font-medium text-warm-brown mb-1">Security Deposit</label>
              <input type="number" value={form.deposit} onChange={(e) => updateField("deposit", e.target.value)}
                className="w-full px-4 py-2.5 border border-warm-taupe/20 rounded-lg font-body text-sm focus:border-deep-saffron focus:outline-none" />
            </div>
            <div>
              <label className="block font-body text-sm font-medium text-warm-brown mb-1">Joining Date *</label>
              <input type="date" value={form.joiningDate} onChange={(e) => updateField("joiningDate", e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-lg font-body text-sm focus:border-deep-saffron focus:outline-none ${errors.joiningDate ? "border-red-400" : "border-warm-taupe/20"}`} />
            </div>
            <div>
              <label className="block font-body text-sm font-medium text-warm-brown mb-1">Notes</label>
              <textarea value={form.notes} onChange={(e) => updateField("notes", e.target.value)} rows={2}
                className="w-full px-4 py-2.5 border border-warm-taupe/20 rounded-lg font-body text-sm focus:border-deep-saffron focus:outline-none resize-none" />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Link to="/admin/students" className="px-6 py-2.5 border border-warm-taupe text-warm-taupe rounded-full font-body text-sm hover:bg-warm-taupe hover:text-warm-ivory transition-colors">
            Cancel
          </Link>
          <button type="submit" disabled={createStudent.isPending || updateStudent.isPending}
            className="flex items-center gap-2 px-6 py-2.5 bg-deep-saffron text-warm-ivory rounded-full font-body text-sm font-medium hover:bg-amber-accent transition-colors disabled:opacity-50">
            <Save className="w-4 h-4" />
            {createStudent.isPending || updateStudent.isPending ? "Saving..." : (isEdit ? "Update" : "Register Student")}
          </button>
        </div>
      </form>
    </div>
  );
}
