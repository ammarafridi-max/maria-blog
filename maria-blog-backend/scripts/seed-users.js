/**
 * seed-users.js — create specific admin users (idempotent).
 *
 * Usage:
 *   npm run seed-users:dev     # reads .env.development
 *   npm run seed-users:prod    # reads .env.production
 *
 * Skips any user whose email or username already exists. Passwords are hashed
 * by the AdminUserSchema pre-save hook.
 */

import mongoose from "mongoose";
import AdminUserSchema from "../src/domains/auth/schema.js";

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("❌  MONGO_URI is not set. Run with --env-file.");
  process.exit(1);
}

const USERS = [
  { name: "Ammar Afridi", username: "ammarafridi", email: "ammar.afridi95@gmail.com", password: "Obaid123", role: "admin", status: "ACTIVE" },
  { name: "Maria Bangash", username: "mariabangash", email: "mariatariqbangash@gmail.com", password: "AmmarJaan123", role: "admin", status: "ACTIVE" },
];

const conn = await mongoose.createConnection(MONGO_URI).asPromise();
console.log(`✅  Connected → ${MONGO_URI.replace(/:\/\/[^@]+@/, "://***@")}`);

const AdminUser = conn.model("admin-user", AdminUserSchema);

for (const u of USERS) {
  const existing = await AdminUser.findOne({
    $or: [{ email: u.email }, { username: u.username }],
  }).lean();

  if (existing) {
    console.log(`ℹ️   skip: ${u.email} (${u.username}) already exists`);
    continue;
  }

  await AdminUser.create(u); // pre-save hook hashes the password
  console.log(`🎉  created: ${u.name} <${u.email}> as @${u.username} (${u.role})`);
}

await conn.close();
console.log("Done.");
