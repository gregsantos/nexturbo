import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import { users, sessions, accounts, verifications } from "./schema"

const connectionString = process.env.DATABASE_URL!

export const client = postgres(connectionString)
export const db = drizzle(client, {
  schema: {
    users,
    sessions,
    accounts,
    verifications,
  },
})
