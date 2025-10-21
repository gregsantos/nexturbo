import { defineConfig } from "drizzle-kit"

export default defineConfig({
  schema: "./lib/server/db/schema/index.ts",
  out: "./lib/server/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
