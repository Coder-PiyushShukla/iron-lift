import { PrismaClient } from "@prisma/client"

declare global {
  var prisma: PrismaClient | undefined
}

 
const url = process.env.DATABASE_URL;
if (!url) {
  console.error("❌ ERROR: DATABASE_URL is missing! Check your .env file.");
} else {
  console.log("✅ Database URL Found:", url.substring(0, 20) + "...");
}

export const db = globalThis.prisma || new PrismaClient()

if (process.env.NODE_ENV !== "production") globalThis.prisma = db