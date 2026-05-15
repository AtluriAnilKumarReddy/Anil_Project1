import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { payments, students } from "@db/schema";
import { eq, and, desc } from "drizzle-orm";

export const paymentRouter = createRouter({
  list: publicQuery
    .input(z.object({
      studentId: z.number().optional(),
      status: z.enum(["pending", "paid", "overdue", "waived"]).optional(),
    }).optional())
    .query(async ({ input }) => {
      const db = getDb();
      const conditions = [];

      if (input?.studentId) conditions.push(eq(payments.studentId, input.studentId));
      if (input?.status) conditions.push(eq(payments.status, input.status));

      let query;
      if (conditions.length > 0) {
        query = db.select().from(payments).where(and(...conditions)).orderBy(desc(payments.dueDate));
      } else {
        query = db.select().from(payments).orderBy(desc(payments.dueDate));
      }

      const results = await query;

      const enriched = [];
      for (const p of results) {
        const student = await db.select().from(students).where(eq(students.id, p.studentId)).then(r => r[0] ?? null);
        enriched.push({ ...p, student });
      }
      return enriched;
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const results = await db.select().from(payments).where(eq(payments.id, input.id));
      if (!results[0]) return null;
      const student = await db.select().from(students).where(eq(students.id, results[0].studentId)).then(r => r[0] ?? null);
      return { ...results[0], student };
    }),

  markPaid: publicQuery
    .input(z.object({
      id: z.number(),
      paidDate: z.string(),
      paymentMode: z.enum(["cash", "upi", "bank_transfer", "other"]),
      receiptNumber: z.string().optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(payments).set({
        status: "paid",
        paidDate: new Date(input.paidDate),
        paymentMode: input.paymentMode,
        receiptNumber: input.receiptNumber || null,
        notes: input.notes || null,
      }).where(eq(payments.id, input.id));
      return { success: true };
    }),

  markOverdue: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(payments).set({ status: "overdue" }).where(eq(payments.id, input.id));
      return { success: true };
    }),

  waive: publicQuery
    .input(z.object({ id: z.number(), notes: z.string().optional() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(payments).set({ status: "waived", notes: input.notes || null }).where(eq(payments.id, input.id));
      return { success: true };
    }),

  generateMonthly: publicQuery
    .input(z.object({
      month: z.string(),
      year: z.number(),
      dueDate: z.string(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const activeStudents = await db.select().from(students).where(eq(students.status, "active"));
      let created = 0;
      let skipped = 0;

      for (const student of activeStudents) {
        const existing = await db.select().from(payments).where(
          and(
            eq(payments.studentId, student.id),
            eq(payments.month, input.month),
            eq(payments.year, input.year)
          )
        );

        if (existing.length > 0) {
          skipped++;
          continue;
        }

        await db.insert(payments).values({
          studentId: student.id,
          amount: student.monthlyRent,
          month: input.month,
          year: input.year,
          dueDate: new Date(input.dueDate),
        });
        created++;
      }

      return { created, skipped, total: activeStudents.length };
    }),

  checkOverdue: publicQuery.mutation(async () => {
    const db = getDb();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const pendingPayments = await db.select().from(payments).where(eq(payments.status, "pending"));
    let marked = 0;

    for (const payment of pendingPayments) {
      const dueDate = payment.dueDate instanceof Date ? payment.dueDate : new Date(payment.dueDate as unknown as string);
      if (dueDate < today) {
        await db.update(payments).set({ status: "overdue" }).where(eq(payments.id, payment.id));
        marked++;
      }
    }

    return { marked };
  }),

  summary: publicQuery.query(async () => {
    const db = getDb();
    const allPayments = await db.select().from(payments);

    const totalPending = allPayments.filter(p => p.status === "pending").length;
    const totalOverdue = allPayments.filter(p => p.status === "overdue").length;
    const totalPaid = allPayments.filter(p => p.status === "paid").length;
    const totalWaived = allPayments.filter(p => p.status === "waived").length;

    const pendingAmount = allPayments
      .filter(p => p.status === "pending" || p.status === "overdue")
      .reduce((sum, p) => sum + Number(p.amount), 0);

    const collectedAmount = allPayments
      .filter(p => p.status === "paid")
      .reduce((sum, p) => sum + Number(p.amount), 0);

    return {
      total: allPayments.length,
      pending: totalPending,
      overdue: totalOverdue,
      paid: totalPaid,
      waived: totalWaived,
      pendingAmount,
      collectedAmount,
    };
  }),
});
