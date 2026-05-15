import { getDb } from "../api/queries/connection";
import { sql } from "drizzle-orm";

async function migrate() {
  const db = getDb();

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS admin_users (
      id bigint unsigned NOT NULL AUTO_INCREMENT,
      email varchar(255) NOT NULL,
      password_hash varchar(255) NOT NULL,
      full_name varchar(255),
      is_verified int unsigned NOT NULL DEFAULT 0,
      otp_code varchar(6),
      otp_expiry timestamp NULL,
      created_at timestamp NOT NULL DEFAULT NOW(),
      updated_at timestamp NOT NULL DEFAULT NOW() ON UPDATE NOW(),
      PRIMARY KEY (id),
      UNIQUE KEY email_unique (email)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  console.log("admin_users table created successfully!");
}

migrate().catch(console.error);
