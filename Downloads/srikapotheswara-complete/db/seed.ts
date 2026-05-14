import { drizzle } from "drizzle-orm/mysql2";
import { getDb } from "../api/queries/connection";
import { hostels } from "./schema";

async function seed() {
  const db = getDb();

  // Seed 3 hostels
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

  console.log("Hostels seeded successfully!");
}

seed().catch(console.error);
