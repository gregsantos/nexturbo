import { pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"

export const verifications = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

// Zod schemas for validation
export const insertVerificationSchema = createInsertSchema(verifications)
export const selectVerificationSchema = createSelectSchema(verifications)

export type Verification = z.infer<typeof selectVerificationSchema>
export type NewVerification = z.infer<typeof insertVerificationSchema>

