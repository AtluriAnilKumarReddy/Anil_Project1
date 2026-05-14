import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { BedDouble, CheckCircle, ArrowRightLeft } from "lucide-react";

export default function AdminBeds() {
  const [selectedHostel, setSelectedHostel] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  const [selectedBed, setSelectedBed] = useState<number | null>(null);

  const utils = trpc.useUtils();
  const { data: hostels } = trpc.hostel.list.useQuery();
  const { data: rooms } = trpc.room.list.useQuery({ hostelId: selectedHostel });
  const { data: students } = trpc.student.list.useQuery({ hostelId: selectedHostel, status: "active" });
  const { data: vacantBeds } = trpc.bed.listVacant.useQuery({ hostelId: selectedHostel });

  const assignBed = trpc.student.assignBed.useMutation({
    onSuccess: () => {
      utils.student.list.invalidate();
      utils.bed.listVacant.invalidate();
      utils.bed.listByRoom.invalidate();
      utils.student.dashboardStats.invalidate();
      setSelectedStudent(null);
      setSelectedBed(null);
    },
  });

  const selectedStudentData = students?.find(s => s.id === selectedStudent);
  const selectedBedData = vacantBeds?.find(b => b.id === selectedBed);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <select
          value={selectedHostel}
          onChange={(e) => { setSelectedHostel(parseInt(e.target.value)); setSelectedStudent(null); setSelectedBed(null); }}
          className="px-4 py-2.5 bg-white border border-warm-taupe/20 rounded-lg font-body text-sm focus:border-deep-saffron focus:outline-none"
        >
          {hostels?.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
        </select>
        <div className="font-body text-sm text-warm-taupe">
          {vacantBeds?.length ?? 0} vacant beds available
        </div>
      </div>

      {/* Allocation Panel */}
      <div className="bg-white rounded-xl border border-warm-taupe/10 shadow-sm p-6">
        <h3 className="font-display text-lg text-deep-saffron mb-4">Bed Allocation</h3>
        <div className="grid grid-cols-3 gap-6">
          {/* Student Selection */}
          <div>
            <label className="block font-body text-sm font-medium text-warm-brown mb-2">1. Select Student</label>
            <div className="border border-warm-taupe/20 rounded-lg max-h-64 overflow-y-auto">
              {students?.map(s => (
                <button key={s.id} onClick={() => setSelectedStudent(s.id)}
                  className={`w-full text-left px-4 py-3 font-body text-sm border-b border-warm-taupe/5 last:border-0 transition-colors ${
                    selectedStudent === s.id ? "bg-deep-saffron/10 text-deep-saffron" : "hover:bg-warm-ivory/50"
                  }`}>
                  <div className="font-medium">{s.fullName}</div>
                  <div className="text-xs text-warm-taupe">{s.phone}</div>
                  {s.bed && <div className="text-xs text-amber-accent">Bed {s.bed.bedNumber} (Rm {s.room?.roomNumber})</div>}
                </button>
              ))}
              {(!students || students.length === 0) && (
                <p className="px-4 py-6 text-center font-body text-sm text-warm-taupe">No active students</p>
              )}
            </div>
          </div>

          {/* Bed Selection */}
          <div>
            <label className="block font-body text-sm font-medium text-warm-brown mb-2">2. Select Vacant Bed</label>
            <div className="border border-warm-taupe/20 rounded-lg max-h-64 overflow-y-auto">
              {vacantBeds?.map(b => (
                <button key={b.id} onClick={() => setSelectedBed(b.id)}
                  className={`w-full text-left px-4 py-3 font-body text-sm border-b border-warm-taupe/5 last:border-0 transition-colors ${
                    selectedBed === b.id ? "bg-green-500/10 text-green-600" : "hover:bg-warm-ivory/50"
                  }`}>
                  <div className="font-medium">Room {b.room.roomNumber} - Bed {b.bedNumber}</div>
                  <div className="text-xs text-warm-taupe">Floor {b.room.floor} | {b.room.sharingType} Sharing</div>
                </button>
              ))}
              {(!vacantBeds || vacantBeds.length === 0) && (
                <p className="px-4 py-6 text-center font-body text-sm text-warm-taupe">No vacant beds</p>
              )}
            </div>
          </div>

          {/* Confirm */}
          <div className="flex flex-col justify-center">
            {selectedStudentData && selectedBedData ? (
              <div className="space-y-4">
                <div className="bg-warm-ivory rounded-lg p-4 text-center">
                  <p className="font-body text-sm text-warm-taupe">Assigning</p>
                  <p className="font-display text-lg text-warm-brown mt-1">{selectedStudentData.fullName}</p>
                  <ArrowRightLeft className="w-5 h-5 mx-auto my-2 text-warm-taupe" />
                  <p className="font-body text-sm font-medium text-deep-saffron">
                    Room {selectedBedData.room.roomNumber} - Bed {selectedBedData.bedNumber}
                  </p>
                  {selectedStudentData.bed && (
                    <p className="font-body text-xs text-amber-accent mt-1">
                      Will vacate: Room {selectedStudentData.room?.roomNumber} - Bed {selectedStudentData.bed.bedNumber}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => assignBed.mutate({ studentId: selectedStudent!, bedId: selectedBed! })}
                  disabled={assignBed.isPending}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-deep-saffron text-warm-ivory rounded-full font-body text-sm font-medium hover:bg-amber-accent transition-colors disabled:opacity-50"
                >
                  <CheckCircle className="w-4 h-4" />
                  {assignBed.isPending ? "Assigning..." : "Confirm Assignment"}
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <BedDouble className="w-12 h-12 text-warm-taupe/20 mb-3" />
                <p className="font-body text-sm text-warm-taupe">
                  Select a student and a vacant bed to assign
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Room Overview */}
      <div className="bg-white rounded-xl border border-warm-taupe/10 shadow-sm p-6">
        <h3 className="font-display text-lg text-deep-saffron mb-4">Room Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms?.map(room => (
            <RoomBedGrid key={room.id} roomId={room.id} roomNumber={room.roomNumber} />
          ))}
        </div>
      </div>
    </div>
  );
}

function RoomBedGrid({ roomId, roomNumber }: { roomId: number; roomNumber: string }) {
  const { data: bedList } = trpc.bed.listByRoom.useQuery({ roomId });

  return (
    <div className="border border-warm-taupe/10 rounded-lg p-4">
      <h4 className="font-body text-sm font-medium text-warm-brown mb-2">Room {roomNumber}</h4>
      <div className="grid grid-cols-2 gap-2">
        {bedList?.map(bed => (
          <div key={bed.id} className={`px-3 py-2 rounded-lg text-center ${
            bed.status === "occupied"
              ? "bg-deep-saffron/10 text-deep-saffron"
              : "bg-green-500/10 text-green-600"
          }`}>
            <BedDouble className="w-4 h-4 mx-auto mb-1" />
            <div className="font-body text-xs font-medium">Bed {bed.bedNumber}</div>
            <div className="font-body text-[10px] opacity-70">{bed.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
