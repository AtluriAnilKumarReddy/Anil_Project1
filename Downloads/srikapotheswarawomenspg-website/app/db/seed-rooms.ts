import { getDb } from "../api/queries/connection";
import { hostels, rooms, beds } from "./schema";
import { eq } from "drizzle-orm";

async function seedRooms() {
  const db = getDb();

  // Get Deluxe hostel id
  const hostelList = await db.select().from(hostels).where(eq(hostels.slug, "deluxe"));
  let deluxeId = hostelList[0]?.id;

  if (!deluxeId) {
    // Seed hostels first
    await db.insert(hostels).values([
      { name: "SRI KAPOTHESWARA DELUXE WOMEN'S PG", slug: "deluxe", addressLine1: "LIG-669, Kukatpally Housing Board Colony", addressLine2: "Dharma Reddy Colony Phase I, Kukatpally", city: "Hyderabad", state: "Telangana", pincode: "500072", landmark: "Near Malabar Gold", mapUrl: "https://maps.app.goo.gl/j4WWSQFQUMfzAHkD6", phone: "+919849937305" },
      { name: "SRI KAPOTHESWARA EXECUTIVE WOMEN'S PG", slug: "executive", addressLine1: "Second Left, Back Side, Malabar Gold, LIG-645, Road No. 5", addressLine2: "Kukatpally Housing Board Colony, Dharma Reddy Colony Phase I, Kukatpally", city: "Hyderabad", state: "Telangana", pincode: "500072", landmark: "Behind Malabar Gold", mapUrl: "https://maps.app.goo.gl/yYXXRyjaAmp3fPYz8", phone: "+919849937305" },
      { name: "SRI KAPOTHESWARA PREMIUM WOMEN'S PG", slug: "premium", addressLine1: "Back Side, Malabar Gold, LIG-608, Road No. 5, Street Number 1", addressLine2: "Kukatpally Housing Board Colony", city: "Hyderabad", state: "Telangana", pincode: "500072", landmark: "Behind Malabar Gold", mapUrl: "", phone: "+919849937305" },
    ]);
    const newHostels = await db.select().from(hostels).where(eq(hostels.slug, "deluxe"));
    deluxeId = newHostels[0]!.id;
  }

  // Check if rooms already exist for Deluxe
  const existingRooms = await db.select().from(rooms).where(eq(rooms.hostelId, deluxeId));
  if (existingRooms.length > 0) {
    console.log(`Deluxe PG already has ${existingRooms.length} rooms. Skipping seed.`);
    return;
  }

  // Seed sample rooms for Deluxe PG
  const roomData = [
    { roomNumber: "101", floor: 1, sharingType: "3" as const, capacity: 3 },
    { roomNumber: "102", floor: 1, sharingType: "3" as const, capacity: 3 },
    { roomNumber: "103", floor: 1, sharingType: "2" as const, capacity: 2 },
    { roomNumber: "201", floor: 2, sharingType: "4" as const, capacity: 4 },
    { roomNumber: "202", floor: 2, sharingType: "3" as const, capacity: 3 },
    { roomNumber: "301", floor: 3, sharingType: "5" as const, capacity: 5 },
  ];

  for (const room of roomData) {
    const result = await db.insert(rooms).values({
      hostelId: deluxeId,
      roomNumber: room.roomNumber,
      floor: room.floor,
      sharingType: room.sharingType,
      capacity: room.capacity,
    });

    const roomId = Number(result[0].insertId);

    // Auto-create beds
    const bedLetters = ["A", "B", "C", "D", "E"];
    for (let i = 0; i < room.capacity; i++) {
      await db.insert(beds).values({
        roomId,
        bedNumber: bedLetters[i],
        status: "vacant",
      });
    }

    console.log(`Created Room ${room.roomNumber} with ${room.capacity} beds (A-${bedLetters[room.capacity - 1]})`);
  }

  console.log("Rooms and beds seeded successfully!");
}

seedRooms().catch(console.error);
