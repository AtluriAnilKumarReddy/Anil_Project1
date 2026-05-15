import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { hostels } from "@db/schema";
import { eq } from "drizzle-orm";

export const hostelRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(hostels);
  }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const results = await db.select().from(hostels).where(eq(hostels.id, input.id));
      return results[0] ?? null;
    }),

  getBySlug: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const results = await db.select().from(hostels).where(eq(hostels.slug, input.slug));
      return results[0] ?? null;
    }),

  // Seed hostels if none exist
  seed: publicQuery.mutation(async () => {
    const db = getDb();
    const existing = await db.select().from(hostels);
    if (existing.length > 0) return { seeded: false, count: existing.length };

    await db.insert(hostels).values([
      {
        name: "SRI KAPOTHESWARA DELUXE WOMEN'S PG",
        slug: "deluxe",
        addressLine1: "LIG-669, Kukatpally Housing Board Colony",
        addressLine2: "Dharma Reddy Colony Phase I, Kukatpally",
        city: "Hyderabad",
        state: "Telangana",
        pincode: "500072",
        landmark: "Near Malabar Gold",
        mapUrl: "https://maps.app.goo.gl/j4WWSQFQUMfzAHkD6",
        phone: "+919849937305",
      },
      {
        name: "SRI KAPOTHESWARA EXECUTIVE WOMEN'S PG",
        slug: "executive",
        addressLine1: "Second Left, Back Side, Malabar Gold, LIG-645, Road No. 5",
        addressLine2: "Kukatpally Housing Board Colony, Dharma Reddy Colony Phase I, Kukatpally",
        city: "Hyderabad",
        state: "Telangana",
        pincode: "500072",
        landmark: "Behind Malabar Gold",
        mapUrl: "https://maps.app.goo.gl/yYXXRyjaAmp3fPYz8",
        phone: "+919849937305",
      },
      {
        name: "SRI KAPOTHESWARA PREMIUM WOMEN'S PG",
        slug: "premium",
        addressLine1: "Back Side, Malabar Gold, LIG-608, Road No. 5, Street Number 1",
        addressLine2: "Kukatpally Housing Board Colony",
        city: "Hyderabad",
        state: "Telangana",
        pincode: "500072",
        landmark: "Behind Malabar Gold",
        mapUrl: "",
        phone: "+919849937305",
      },
    ]);
    return { seeded: true, count: 3 };
  }),
});
