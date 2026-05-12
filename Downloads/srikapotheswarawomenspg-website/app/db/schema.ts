import {
  mysqlTable,
  serial,
  varchar,
  text,
  timestamp,
  bigint,
  int,
  date,
  decimal,
  mysqlEnum,
} from "drizzle-orm/mysql-core";

// ===== HOSTELS =====
export const hostels = mysqlTable("hostels", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 50 }).notNull().unique(),
  addressLine1: varchar("address_line_1", { length: 255 }).notNull(),
  addressLine2: varchar("address_line_2", { length: 255 }),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 100 }).notNull(),
  pincode: varchar("pincode", { length: 10 }).notNull(),
  landmark: varchar("landmark", { length: 255 }),
  mapUrl: text("map_url"),
  phone: varchar("phone", { length: 20 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ===== ROOMS =====
export const rooms = mysqlTable("rooms", {
  id: serial("id").primaryKey(),
  hostelId: bigint("hostel_id", { mode: "number", unsigned: true }).notNull(),
  roomNumber: varchar("room_number", { length: 20 }).notNull(),
  floor: int("floor").notNull(),
  sharingType: mysqlEnum("sharing_type", ["2", "3", "4", "5"]).notNull(),
  capacity: int("capacity").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ===== BEDS =====
export const beds = mysqlTable("beds", {
  id: serial("id").primaryKey(),
  roomId: bigint("room_id", { mode: "number", unsigned: true }).notNull(),
  bedNumber: varchar("bed_number", { length: 10 }).notNull(),
  status: mysqlEnum("status", ["vacant", "occupied"]).notNull().default("vacant"),
  studentId: bigint("student_id", { mode: "number", unsigned: true }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ===== STUDENTS =====
export const students = mysqlTable("students", {
  id: serial("id").primaryKey(),
  hostelId: bigint("hostel_id", { mode: "number", unsigned: true }).notNull(),
  roomId: bigint("room_id", { mode: "number", unsigned: true }),
  bedId: bigint("bed_id", { mode: "number", unsigned: true }),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  email: varchar("email", { length: 255 }),
  dateOfBirth: date("date_of_birth"),
  aadharNumber: varchar("aadhar_number", { length: 20 }),
  occupation: mysqlEnum("occupation", ["working", "student"]).notNull().default("student"),
  companyOrCollege: varchar("company_or_college", { length: 255 }),
  parentName: varchar("parent_name", { length: 255 }),
  parentPhone: varchar("parent_phone", { length: 20 }),
  emergencyContact: varchar("emergency_contact", { length: 20 }),
  emergencyRelation: varchar("emergency_relation", { length: 50 }),
  address: text("address"),
  monthlyRent: decimal("monthly_rent", { precision: 10, scale: 2 }).notNull(),
  deposit: decimal("deposit", { precision: 10, scale: 2 }).notNull().default("0"),
  advancePaid: decimal("advance_paid", { precision: 10, scale: 2 }).notNull().default("0"),
  joiningDate: date("joining_date").notNull(),
  status: mysqlEnum("status", ["active", "vacated", "pending"]).notNull().default("active"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

// ===== PAYMENTS =====
export const payments = mysqlTable("payments", {
  id: serial("id").primaryKey(),
  studentId: bigint("student_id", { mode: "number", unsigned: true }).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  month: varchar("month", { length: 20 }).notNull(),
  year: int("year").notNull(),
  dueDate: date("due_date").notNull(),
  paidDate: date("paid_date"),
  status: mysqlEnum("status", ["pending", "paid", "overdue", "waived"]).notNull().default("pending"),
  paymentMode: mysqlEnum("payment_mode", ["cash", "upi", "bank_transfer", "other"]),
  receiptNumber: varchar("receipt_number", { length: 50 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

// ===== ADMIN USERS =====
export const adminUsers = mysqlTable("admin_users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  fullName: varchar("full_name", { length: 255 }),
  isVerified: int("is_verified", { unsigned: true }).notNull().default(0),
  otpCode: varchar("otp_code", { length: 6 }),
  otpExpiry: timestamp("otp_expiry"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

// ===== REMINDERS =====
export const reminders = mysqlTable("reminders", {
  id: serial("id").primaryKey(),
  studentId: bigint("student_id", { mode: "number", unsigned: true }).notNull(),
  paymentId: bigint("payment_id", { mode: "number", unsigned: true }),
  reminderDate: date("reminder_date").notNull(),
  status: mysqlEnum("status", ["pending", "sent", "acknowledged"]).notNull().default("pending"),
  message: text("message"),
  channel: mysqlEnum("channel", ["whatsapp", "sms", "email"]).notNull().default("whatsapp"),
  sentAt: timestamp("sent_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
