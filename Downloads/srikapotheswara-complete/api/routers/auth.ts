import { z } from "zod";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { adminUsers } from "@db/schema";
import { eq } from "drizzle-orm";

const JWT_SECRET = process.env.JWT_SECRET || "kapotheswara-pg-secret-key-2024";

// Owner credentials - ONLY this email/password can login
const OWNER_EMAIL = "srikapotheswarawomenspg@gmail.com";
const OWNER_PASSWORD_HASH = "$2a$10$rQJW8.Vv5Uf.f3NIXR.ntO/4wQXZVQhLzF2E3R7Jm0pVqG5yK6he"; // bcrypt hash of "Skpwomenspg@2026"

function generateToken(userId: number): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
}

function verifyToken(token: string): { userId: number } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: number };
  } catch {
    return null;
  }
}

// Ensure admin account exists in database
async function ensureAdminAccount(db: any) {
  const existing = await db.select().from(adminUsers).where(eq(adminUsers.email, OWNER_EMAIL));

  if (existing.length === 0) {
    await db.insert(adminUsers).values({
      email: OWNER_EMAIL,
      passwordHash: OWNER_PASSWORD_HASH,
      fullName: "SRI KAPOTHESWARA PG Owner",
      isVerified: 1,
    });
  }
}

export const authRouter = createRouter({
  // Simple direct login - NO OTP, NO EMAIL
  login: publicQuery
    .input(z.object({
      email: z.string().email(),
      password: z.string(),
    }))
    .mutation(async ({ input }) => {
      if (input.email.toLowerCase() !== OWNER_EMAIL.toLowerCase()) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Access denied" });
      }

      const db = getDb();
      await ensureAdminAccount(db);

      const users = await db.select().from(adminUsers).where(eq(adminUsers.email, input.email));
      if (users.length === 0) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Account not found" });
      }

      const user = users[0];

      // Verify password
      const valid = await bcrypt.compare(input.password, user.passwordHash);
      if (!valid) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid password" });
      }

      // Ensure user is verified
      if (user.isVerified !== 1) {
        await db.update(adminUsers).set({ isVerified: 1 }).where(eq(adminUsers.id, user.id));
      }

      const token = generateToken(user.id);

      return {
        token,
        user: { id: user.id, email: user.email, fullName: user.fullName },
      };
    }),

  // Check session
  me: publicQuery
    .query(async ({ ctx }) => {
      const headerToken = ctx.req?.headers?.get("x-admin-token") as string | undefined;
      if (!headerToken) return null;

      const decoded = verifyToken(headerToken);
      if (!decoded) return null;

      const db = getDb();
      await ensureAdminAccount(db);

      const users = await db.select().from(adminUsers).where(eq(adminUsers.id, decoded.userId));
      if (users.length === 0) return null;

      const user = users[0];
      if (user.isVerified !== 1) return null;

      return {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      };
    }),
});
