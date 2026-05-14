import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { rooms, beds, students } from "@db/schema";
import { eq } from "drizzle-orm";

export const roomRouter = createRouter({
  list: publicQuery
    .input(z.object({ hostelId: z.number() }).optional())
    .query(async ({ input }) => {
      const db = getDb();
      if (input?.hostelId) {
        return db.select().from(rooms).where(eq(rooms.hostelId, input.hostelId));
      }
      return db.select().from(rooms);
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const results = await db.select().from(rooms).where(eq(rooms.id, input.id));
      return results[0] ?? null;
    }),

  create: publicQuery
    .input(z.object({
      hostelId: z.number(),
      roomNumber: z.string(),
      floor: z.number(),
      sharingType: z.enum(["2", "3", "4", "5"]),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const sharingType = input.sharingType;
      const sharingMap: Record<string, number> = { "2": 2, "3": 3, "4": 4, "5": 5 };
      const capacity = sharingMap[sharingType] ?? parseInt(sharingType);

      const result = await db.insert(rooms).values({
        hostelId: input.hostelId,
        roomNumber: input.roomNumber,
        floor: input.floor,
        sharingType: sharingType as "2" | "3" | "4" | "5",
        capacity,
      });

      const roomId = Number(result[0].insertId);

      // Auto-create beds
      const bedLetters = ["A", "B", "C", "D", "E"];
      for (let i = 0; i < capacity; i++) {
        await db.insert(beds).values({
          roomId,
          bedNumber: bedLetters[i],
          status: "vacant",
        });
      }

      return { id: roomId, bedsCreated: capacity };
    }),

  delete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(beds).where(eq(beds.roomId, input.id));
      await db.delete(rooms).where(eq(rooms.id, input.id));
      return { success: true };
    }),

  occupancy: publicQuery
    .input(z.object({ hostelId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const roomList = await db.select().from(rooms).where(eq(rooms.hostelId, input.hostelId));
      const bedList = await db.select().from(beds);
      const studentList = await db.select({ id: students.id, status: students.status }).from(students).where(eq(students.status, "active"));

      const activeStudents = studentList.length;
      const totalBeds = bedList.length;
      const occupiedBeds = bedList.filter(b => b.status === "occupied").length;

      return {
        totalRooms: roomList.length,
        totalBeds,
        occupiedBeds,
        vacantBeds: totalBeds - occupiedBeds,
        totalStudents: activeStudents,
      };
    }),
});
