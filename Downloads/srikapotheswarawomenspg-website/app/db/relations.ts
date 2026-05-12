import { relations } from "drizzle-orm";
import { hostels, rooms, beds, students, payments, reminders } from "./schema";

export const hostelsRelations = relations(hostels, ({ many }) => ({
  rooms: many(rooms),
  students: many(students),
}));

export const roomsRelations = relations(rooms, ({ one, many }) => ({
  hostel: one(hostels, { fields: [rooms.hostelId], references: [hostels.id] }),
  beds: many(beds),
  students: many(students),
}));

export const bedsRelations = relations(beds, ({ one }) => ({
  room: one(rooms, { fields: [beds.roomId], references: [rooms.id] }),
  student: one(students, { fields: [beds.studentId], references: [students.id] }),
}));

export const studentsRelations = relations(students, ({ one, many }) => ({
  hostel: one(hostels, { fields: [students.hostelId], references: [hostels.id] }),
  room: one(rooms, { fields: [students.roomId], references: [rooms.id] }),
  bed: one(beds, { fields: [students.bedId], references: [beds.id] }),
  payments: many(payments),
  reminders: many(reminders),
}));

export const paymentsRelations = relations(payments, ({ one, many }) => ({
  student: one(students, { fields: [payments.studentId], references: [students.id] }),
  reminders: many(reminders),
}));

export const remindersRelations = relations(reminders, ({ one }) => ({
  student: one(students, { fields: [reminders.studentId], references: [students.id] }),
  payment: one(payments, { fields: [reminders.paymentId], references: [payments.id] }),
}));
