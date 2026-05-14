import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { beds, rooms, students } from "@db/schema";
import { eq, and } from "drizzle-orm";

export const bedRouter = createRouter({
  listByRoom: publicQuery
    .input(z.object({ roomId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const bedList = await db.select().from(beds).where(eq(beds.roomId, input.roomId));

      const result = [];
      for (const bed of bedList) {
        const student = bed.studentId
          ? await db.select().from(students).where(eq(students.id, bed.studentId)).then(r => r[0] ?? null)
          : null;
        result.push({ ...bed, student });
      }
      return result;
    }),

  listVacant: publicQuery
    .input(z.object({ hostelId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const roomList = await db.select().from(rooms).where(eq(rooms.hostelId, input.hostelId));
      const vacantBeds = [];

      for (const room of roomList) {
        const roomBeds = await db.select().from(beds).where(
          and(eq(beds.roomId, room.id), eq(beds.status, "vacant"))
        );
        for (const bed of roomBeds) {
          vacantBeds.push({ ...bed, room });
        }
      }
      return vacantBeds;
    }),
});
