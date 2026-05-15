import { useState } from "react";
import { Plus, Trash2, BedDouble, Users, Database } from "lucide-react";
import { trpc } from "@/providers/trpc";

export default function AdminRooms() {
  const [showAdd, setShowAdd] = useState(false);
  const [newRoom, setNewRoom] = useState({ hostelId: 1, roomNumber: "", floor: 1, sharingType: "3" as "2" | "3" | "4" | "5" });
  const [selectedHostel, setSelectedHostel] = useState(1);

  const utils = trpc.useUtils();
  const { data: hostels } = trpc.hostel.list.useQuery();
  const { data: rooms } = trpc.room.list.useQuery({ hostelId: selectedHostel });
  const { data: occupancy } = trpc.room.occupancy.useQuery({ hostelId: selectedHostel });

  const createRoom = trpc.room.create.useMutation({
    onSuccess: () => {
      utils.room.list.invalidate();
      utils.room.occupancy.invalidate();
      utils.bed.listByRoom.invalidate();
      setShowAdd(false);
      setNewRoom({ hostelId: 1, roomNumber: "", floor: 1, sharingType: "3" });
    },
  });

  const deleteRoom = trpc.room.delete.useMutation({
    onSuccess: () => {
      utils.room.list.invalidate();
      utils.room.occupancy.invalidate();
      utils.bed.listByRoom.invalidate();
    },
  });

  const seedRooms = trpc.seed.rooms.useMutation({
    onSuccess: (data) => {
      if (data.seeded) {
        alert(`Created ${data.roomsCreated} rooms with ${data.bedsCreated} beds!`);
      } else {
        alert(data.message);
      }
      utils.room.list.invalidate();
      utils.room.occupancy.invalidate();
      utils.hostel.list.invalidate();
    },
    onError: (err) => {
      alert("Error: " + err.message);
    },
  });

  return (
    <div className="space-y-6">
      {/* Stats */}
      {occupancy && (
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Total Rooms", value: occupancy.totalRooms, icon: BedDouble },
            { label: "Total Beds", value: occupancy.totalBeds, icon: BedDouble },
            { label: "Occupied", value: occupancy.occupiedBeds, icon: Users },
            { label: "Vacant", value: occupancy.vacantBeds, icon: Users },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl p-5 border border-warm-taupe/10">
              <p className="font-body text-xs text-warm-taupe uppercase">{stat.label}</p>
              <p className="font-display text-2xl text-warm-brown mt-1">{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* No rooms - show seed button */}
      {(!rooms || rooms.length === 0) && (
        <div className="bg-amber-accent/5 border border-amber-accent/20 rounded-xl p-8 text-center">
          <Database className="w-12 h-12 text-amber-accent mx-auto mb-4" />
          <h3 className="font-display text-lg text-warm-brown mb-2">No Rooms Found</h3>
          <p className="font-body text-sm text-warm-taupe mb-4">
            Click the button below to create sample rooms with beds for the Deluxe PG.
          </p>
          <button
            onClick={() => seedRooms.mutate()}
            disabled={seedRooms.isPending}
            className="px-6 py-3 bg-deep-saffron text-warm-ivory rounded-full font-body text-sm font-medium hover:bg-amber-accent transition-colors disabled:opacity-50"
          >
            {seedRooms.isPending ? "Creating..." : "Create Sample Rooms & Beds"}
          </button>
        </div>
      )}

      {/* Header */}
      {rooms && rooms.length > 0 && (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <select
                value={selectedHostel}
                onChange={(e) => setSelectedHostel(parseInt(e.target.value))}
                className="px-4 py-2.5 bg-white border border-warm-taupe/20 rounded-lg font-body text-sm focus:border-deep-saffron focus:outline-none"
              >
                {hostels?.map(h => (
                  <option key={h.id} value={h.id}>{h.name}</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => setShowAdd(!showAdd)}
              className="flex items-center gap-2 px-6 py-2.5 bg-deep-saffron text-warm-ivory rounded-full font-body text-sm font-medium hover:bg-amber-accent transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Room
            </button>
          </div>

          {/* Add Room Form */}
          {showAdd && (
            <div className="bg-white rounded-xl border border-warm-taupe/10 shadow-sm p-6">
              <h3 className="font-display text-lg text-deep-saffron mb-4">Add New Room</h3>
              <div className="grid grid-cols-4 gap-4">
                <select value={newRoom.hostelId} onChange={(e) => setNewRoom(p => ({ ...p, hostelId: parseInt(e.target.value) }))}
                  className="px-4 py-2.5 border border-warm-taupe/20 rounded-lg font-body text-sm">
                  {hostels?.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                </select>
                <input placeholder="Room Number (e.g. 101)" value={newRoom.roomNumber}
                  onChange={(e) => setNewRoom(p => ({ ...p, roomNumber: e.target.value }))}
                  className="px-4 py-2.5 border border-warm-taupe/20 rounded-lg font-body text-sm" />
                <input type="number" placeholder="Floor" value={newRoom.floor}
                  onChange={(e) => setNewRoom(p => ({ ...p, floor: parseInt(e.target.value) }))}
                  className="px-4 py-2.5 border border-warm-taupe/20 rounded-lg font-body text-sm" />
                <select value={newRoom.sharingType}
                  onChange={(e) => setNewRoom(p => ({ ...p, sharingType: e.target.value as "2" | "3" | "4" | "5" }))}
                  className="px-4 py-2.5 border border-warm-taupe/20 rounded-lg font-body text-sm">
                  <option value="2">2 Sharing</option>
                  <option value="3">3 Sharing</option>
                  <option value="4">4 Sharing</option>
                  <option value="5">5 Sharing</option>
                </select>
              </div>
              <button
                onClick={() => {
                  if (!newRoom.roomNumber) return;
                  createRoom.mutate(newRoom);
                }}
                disabled={createRoom.isPending}
                className="mt-4 px-6 py-2.5 bg-deep-saffron text-warm-ivory rounded-full font-body text-sm font-medium hover:bg-amber-accent transition-colors disabled:opacity-50"
              >
                {createRoom.isPending ? "Creating..." : "Create Room & Auto-Generate Beds"}
              </button>
            </div>
          )}

          {/* Rooms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms.map((room) => (
              <RoomCard key={room.id} room={room} onDelete={(id) => { if (confirm("Delete this room and all its beds?")) deleteRoom.mutate({ id }); }} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function RoomCard({ room, onDelete }: { room: { id: number; roomNumber: string; floor: number; sharingType: string; capacity: number }; onDelete: (id: number) => void }) {
  const { data: bedList } = trpc.bed.listByRoom.useQuery({ roomId: room.id });

  return (
    <div className="bg-white rounded-xl border border-warm-taupe/10 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="font-display text-lg text-warm-brown">Room {room.roomNumber}</h4>
          <div className="flex items-center gap-3 mt-1">
            <span className="font-body text-xs text-warm-taupe">Floor {room.floor}</span>
            <span className="px-2 py-0.5 bg-amber-accent/10 text-amber-accent rounded-full text-xs font-body font-medium">
              {room.sharingType} Sharing
            </span>
          </div>
        </div>
        <button onClick={() => onDelete(room.id)}
          className="p-1.5 rounded-lg hover:bg-red-50 text-warm-taupe hover:text-red-500 transition-colors">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Beds Grid */}
      <div className="space-y-2">
        <p className="font-body text-xs text-warm-taupe uppercase tracking-wider mb-2">Beds</p>
        <div className="grid grid-cols-3 gap-2">
          {bedList?.map((bed) => (
            <div
              key={bed.id}
              className={`flex flex-col items-center p-3 rounded-lg border ${
                bed.status === "occupied"
                  ? "bg-red-50 border-red-200 text-red-600"
                  : "bg-green-50 border-green-200 text-green-600"
              }`}
            >
              <BedDouble className="w-5 h-5 mb-1" />
              <span className="font-body text-sm font-semibold">Bed {bed.bedNumber}</span>
              <span className="font-body text-[10px] opacity-70">{bed.status}</span>
              {bed.student && (
                <span className="font-body text-[10px] text-warm-brown mt-1 truncate max-w-full text-center">
                  {bed.student.fullName}
                </span>
              )}
            </div>
          ))}
          {(!bedList || bedList.length === 0) && (
            <p className="col-span-3 text-center font-body text-xs text-warm-taupe py-4">No beds found</p>
          )}
        </div>
      </div>

      {/* Bed count summary */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-warm-taupe/10">
        <span className="font-body text-xs text-warm-taupe">
          {bedList?.filter(b => b.status === "vacant").length ?? 0} vacant / {bedList?.length ?? 0} total
        </span>
      </div>
    </div>
  );
}
