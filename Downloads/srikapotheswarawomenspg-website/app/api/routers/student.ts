import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { students, beds, payments, hostels, rooms } from "@db/schema";
import { eq, desc, and } from "drizzle-orm";

export const studentRouter = createRouter({
  list: publicQuery
    .input(z.object({
      hostelId: z.number().optional(),
      status: z.enum(["active", "vacated", "pending"]).optional(),
      search: z.string().optional(),
    }).optional())
    .query(async ({ input }) => {
      const db = getDb();
      const conditions = [];
      if (input?.hostelId) conditions.push(eq(students.hostelId, input.hostelId));
      if (input?.status) conditions.push(eq(students.status, input.status));

      let query;
      if (conditions.length > 0) {
        query = db.select().from(students).where(and(...conditions)).orderBy(desc(students.createdAt));
      } else {
        query = db.select().from(students).orderBy(desc(students.createdAt));
      }

      let results = await query;

      if (input?.search) {
        const search = input.search.toLowerCase();
        results = results.filter(s =>
          s.fullName.toLowerCase().includes(search) ||
          s.phone.includes(search) ||
          (s.aadharNumber?.includes(search) ?? false)
        );
      }

      const enriched = [];
      for (const s of results) {
        const hostel = s.hostelId
          ? await db.select().from(hostels).where(eq(hostels.id, s.hostelId)).then(r => r[0] ?? null)
          : null;
        const room = s.roomId
          ? await db.select().from(rooms).where(eq(rooms.id, s.roomId)).then(r => r[0] ?? null)
          : null;
        const bed = s.bedId
          ? await db.select().from(beds).where(eq(beds.id, s.bedId)).then(r => r[0] ?? null)
          : null;
        enriched.push({ ...s, hostel, room, bed });
      }

      return enriched;
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const results = await db.select().from(students).where(eq(students.id, input.id));
      if (!results[0]) return null;

      const s = results[0];
      const hostel = s.hostelId
        ? await db.select().from(hostels).where(eq(hostels.id, s.hostelId)).then(r => r[0] ?? null)
        : null;
      const room = s.roomId
        ? await db.select().from(rooms).where(eq(rooms.id, s.roomId)).then(r => r[0] ?? null)
        : null;
      const bed = s.bedId
        ? await db.select().from(beds).where(eq(beds.id, s.bedId)).then(r => r[0] ?? null)
        : null;

      return { ...s, hostel, room, bed };
    }),

  create: publicQuery
    .input(z.object({
      hostelId: z.number(),
      roomId: z.number().optional(),
      bedId: z.number().optional(),
      fullName: z.string().min(1),
      phone: z.string().min(10),
      email: z.string().optional(),
      dateOfBirth: z.string().optional(),
      aadharNumber: z.string().optional(),
      occupation: z.enum(["working", "student"]).default("student"),
      companyOrCollege: z.string().optional(),
      parentName: z.string().optional(),
      parentPhone: z.string().optional(),
      emergencyContact: z.string().optional(),
      emergencyRelation: z.string().optional(),
      address: z.string().optional(),
      monthlyRent: z.string(),
      deposit: z.string().default("0"),
      joiningDate: z.string(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();

      const values: Record<string, unknown> = {
        hostelId: input.hostelId,
        fullName: input.fullName,
        phone: input.phone,
        monthlyRent: input.monthlyRent,
        deposit: input.deposit || "0",
        joiningDate: new Date(input.joiningDate),
        occupation: input.occupation,
      };

      if (input.roomId) values.roomId = input.roomId;
      if (input.bedId) values.bedId = input.bedId;
      if (input.email) values.email = input.email;
      if (input.dateOfBirth) values.dateOfBirth = new Date(input.dateOfBirth);
      if (input.aadharNumber) values.aadharNumber = input.aadharNumber;
      if (input.companyOrCollege) values.companyOrCollege = input.companyOrCollege;
      if (input.parentName) values.parentName = input.parentName;
      if (input.parentPhone) values.parentPhone = input.parentPhone;
      if (input.emergencyContact) values.emergencyContact = input.emergencyContact;
      if (input.emergencyRelation) values.emergencyRelation = input.emergencyRelation;
      if (input.address) values.address = input.address;
      if (input.notes) values.notes = input.notes;

      const result = await db.insert(students).values(values as typeof students.$inferInsert);
      const studentId = Number(result[0].insertId);

      if (input.bedId) {
        await db.update(beds)
          .set({ status: "occupied", studentId })
          .where(eq(beds.id, input.bedId));
      }

      // Create first month payment
      const now = new Date();
      const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      await db.insert(payments).values({
        studentId,
        amount: input.monthlyRent,
        month: monthNames[now.getMonth()],
        year: now.getFullYear(),
        dueDate: lastDay,
      } as typeof payments.$inferInsert);

      return { id: studentId };
    }),

  update: publicQuery
    .input(z.object({
      id: z.number(),
      hostelId: z.number().optional(),
      roomId: z.number().optional(),
      bedId: z.number().optional(),
      fullName: z.string().min(1).optional(),
      phone: z.string().optional(),
      email: z.string().optional(),
      dateOfBirth: z.string().optional(),
      aadharNumber: z.string().optional(),
      occupation: z.enum(["working", "student"]).optional(),
      companyOrCollege: z.string().optional(),
      parentName: z.string().optional(),
      parentPhone: z.string().optional(),
      emergencyContact: z.string().optional(),
      emergencyRelation: z.string().optional(),
      address: z.string().optional(),
      monthlyRent: z.string().optional(),
      deposit: z.string().optional(),
      joiningDate: z.string().optional(),
      notes: z.string().optional(),
      status: z.enum(["active", "vacated", "pending"]).optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, bedId, roomId, dateOfBirth, joiningDate, status, ...rest } = input;

      const updateData: Record<string, unknown> = {};
      if (rest.fullName !== undefined) updateData.fullName = rest.fullName;
      if (rest.phone !== undefined) updateData.phone = rest.phone;
      if (rest.email !== undefined) updateData.email = rest.email;
      if (dateOfBirth !== undefined) updateData.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : null;
      if (rest.aadharNumber !== undefined) updateData.aadharNumber = rest.aadharNumber;
      if (rest.occupation !== undefined) updateData.occupation = rest.occupation;
      if (rest.companyOrCollege !== undefined) updateData.companyOrCollege = rest.companyOrCollege;
      if (rest.parentName !== undefined) updateData.parentName = rest.parentName;
      if (rest.parentPhone !== undefined) updateData.parentPhone = rest.parentPhone;
      if (rest.emergencyContact !== undefined) updateData.emergencyContact = rest.emergencyContact;
      if (rest.emergencyRelation !== undefined) updateData.emergencyRelation = rest.emergencyRelation;
      if (rest.address !== undefined) updateData.address = rest.address;
      if (rest.monthlyRent !== undefined) updateData.monthlyRent = rest.monthlyRent;
      if (rest.deposit !== undefined) updateData.deposit = rest.deposit;
      if (joiningDate !== undefined) updateData.joiningDate = joiningDate ? new Date(joiningDate) : null;
      if (rest.notes !== undefined) updateData.notes = rest.notes;
      if (status !== undefined) updateData.status = status;
      if (rest.hostelId !== undefined) updateData.hostelId = rest.hostelId;
      if (roomId !== undefined) updateData.roomId = roomId;

      // Handle bed change
      if (bedId !== undefined) {
        const current = await db.select().from(students).where(eq(students.id, id));
        const oldBedId = current[0]?.bedId;

        updateData.bedId = bedId || null;

        if (oldBedId && oldBedId !== bedId) {
          await db.update(beds).set({ status: "vacant", studentId: null }).where(eq(beds.id, oldBedId));
        }

        if (bedId) {
          await db.update(beds).set({ status: "occupied", studentId: id }).where(eq(beds.id, bedId));
        }
      }

      await db.update(students).set(updateData).where(eq(students.id, id));

      if (status === "vacated") {
        const current = await db.select().from(students).where(eq(students.id, id));
        if (current[0]?.bedId) {
          await db.update(beds).set({ status: "vacant", studentId: null }).where(eq(beds.id, current[0].bedId));
        }
      }

      return { success: true };
    }),

  delete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const s = await db.select().from(students).where(eq(students.id, input.id));
      if (s[0]?.bedId) {
        await db.update(beds).set({ status: "vacant", studentId: null }).where(eq(beds.id, s[0].bedId));
      }
      await db.delete(students).where(eq(students.id, input.id));
      return { success: true };
    }),

  assignBed: publicQuery
    .input(z.object({ studentId: z.number(), bedId: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();

      const s = await db.select().from(students).where(eq(students.id, input.studentId));
      if (s[0]?.bedId) {
        await db.update(beds).set({ status: "vacant", studentId: null }).where(eq(beds.id, s[0].bedId));
      }

      await db.update(beds)
        .set({ status: "occupied", studentId: input.studentId })
        .where(eq(beds.id, input.bedId));

      const bed = await db.select().from(beds).where(eq(beds.id, input.bedId));
      await db.update(students)
        .set({ bedId: input.bedId, roomId: bed[0]?.roomId })
        .where(eq(students.id, input.studentId));

      return { success: true };
    }),

  updateAdvance: publicQuery
    .input(z.object({
      id: z.number(),
      advancePaid: z.string(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(students)
        .set({ advancePaid: input.advancePaid })
        .where(eq(students.id, input.id));
      return { success: true };
    }),

  getPaymentStatus: publicQuery
    .input(z.object({ studentId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const student = await db.select().from(students).where(eq(students.id, input.studentId)).then(r => r[0] ?? null);
      if (!student) return null;

      const studentPayments = await db.select().from(payments).where(eq(payments.studentId, input.studentId)).orderBy(desc(payments.year), desc(payments.dueDate));

      const hostel = student.hostelId
        ? await db.select().from(hostels).where(eq(hostels.id, student.hostelId)).then(r => r[0] ?? null)
        : null;

      return {
        student: { ...student, hostel },
        advancePaid: student.advancePaid,
        advanceRequired: 2000,
        payments: studentPayments,
        totalPaid: studentPayments.filter(p => p.status === "paid").reduce((sum, p) => sum + Number(p.amount), 0),
        totalPending: studentPayments.filter(p => p.status === "pending" || p.status === "overdue").reduce((sum, p) => sum + Number(p.amount), 0),
      };
    }),

  dashboardStats: publicQuery.query(async () => {
    const db = getDb();
    const allStudents = await db.select().from(students);
    const allPayments = await db.select().from(payments);

    const advancePaid = allStudents.filter(s => Number(s.advancePaid) >= 2000).length;
    const advancePending = allStudents.filter(s => Number(s.advancePaid) < 2000 && s.status === "active").length;

    return {
      totalStudents: allStudents.length,
      activeStudents: allStudents.filter(s => s.status === "active").length,
      vacatedStudents: allStudents.filter(s => s.status === "vacated").length,
      pendingStudents: allStudents.filter(s => s.status === "pending").length,
      totalPayments: allPayments.length,
      pendingPayments: allPayments.filter(p => p.status === "pending").length,
      overduePayments: allPayments.filter(p => p.status === "overdue").length,
      advancePaid,
      advancePending,
    };
  }),
});
