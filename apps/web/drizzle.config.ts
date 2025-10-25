import {defineConfig} from "drizzle-kit"
import dotenv from "dotenv"
dotenv.config({path: ".env.local"})

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set")
}

export default defineConfig({
  schema: "./lib/server/db/schema/index.ts",
  out: "./lib/server/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
