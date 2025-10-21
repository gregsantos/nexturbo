---
description: Add a new database table with Drizzle ORM
---

# Add Database Table Skill

You are helping add a new database table to a Next.js application using Drizzle ORM with PostgreSQL.

## Context

- **ORM**: Drizzle ORM
- **Database**: PostgreSQL
- **Schema Location**: `apps/web/lib/server/db/schema/`
- **Migration Tool**: Drizzle Kit

## Workflow

### 1. Understand Requirements

Ask the user:
- What is the table name? (use singular form, e.g., "user", "post")
- What fields are needed?
- What data types for each field?
- Are there relationships to other tables?
- What constraints? (unique, not null, default values)

### 2. Create Schema File

Create a new file in `lib/server/db/schema/`:

```typescript
// lib/server/db/schema/[table-name]s.ts
import {
  pgTable,
  text,
  timestamp,
  uuid,
  boolean,
  integer,
  varchar,
} from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { relations } from "drizzle-orm"

// Define the table
export const [tableName]s = pgTable("[table_name]", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Add your fields here
  // Examples:
  // name: text("name").notNull(),
  // email: varchar("email", { length: 255 }).notNull().unique(),
  // age: integer("age"),
  // isActive: boolean("isActive").default(true),

  // Timestamps (always include)
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

// Define relations (if any)
export const [tableName]sRelations = relations([tableName]s, ({ one, many }) => ({
  // Example: many-to-one
  // user: one(users, {
  //   fields: [tableName]s.userId],
  //   references: [users.id],
  // }),

  // Example: one-to-many
  // posts: many(posts),
}))

// Generate Zod schemas for validation
export const insert[TableName]Schema = createInsertSchema([tableName]s)
export const select[TableName]Schema = createSelectSchema([tableName]s)

// Export TypeScript types
export type [TableName] = typeof [tableName]s.$inferSelect
export type New[TableName] = typeof [tableName]s.$inferInsert
```

### 3. Common Field Types

```typescript
// Text fields
text("field_name")                          // Unlimited text
varchar("field_name", { length: 255 })      // Variable length (max 255)

// Numbers
integer("field_name")                       // Integer
serial("field_name")                        // Auto-increment
real("field_name")                          // Floating point

// Booleans
boolean("field_name")

// Dates
timestamp("field_name")                     // Date + time
date("field_name")                          // Date only

// UUIDs
uuid("field_name")

// JSON
json("field_name")                          // JSON field
jsonb("field_name")                         // Binary JSON (faster)
```

### 4. Common Constraints

```typescript
// Not null
.notNull()

// Unique
.unique()

// Default value
.default(value)
.defaultNow()                               // For timestamps
.defaultRandom()                            // For UUIDs

// Primary key
.primaryKey()

// Foreign key
.references(() => users.id, { onDelete: "cascade" })
```

### 5. Foreign Key Example

```typescript
import { users } from "./users"

export const posts = pgTable("post", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  content: text("content").notNull(),

  // Foreign key to users table
  userId: uuid("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

// Define the relation
export const postsRelations = relations(posts, ({ one }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
}))
```

### 6. Export from Index

Add export to `lib/server/db/schema/index.ts`:

```typescript
export * from "./users"
export * from "./posts"
export * from "./[new-table]"  // Add this line
```

### 7. Push Schema to Database

Run the migration:

```bash
# Push schema changes to database (development)
npm run db:push

# Or generate migration file (production)
npm run db:generate
npm run db:migrate
```

### 8. Example Queries

Show the user how to query the new table:

```typescript
import { db } from "@/lib/server/db"
import { [tableName]s } from "@/lib/server/db/schema"
import { eq, and, or, gt } from "drizzle-orm"

// Find all
const all = await db.query.[tableName]s.findMany()

// Find one
const one = await db.query.[tableName]s.findFirst({
  where: eq([tableName]s.id, id),
})

// With relations
const withRelations = await db.query.[tableName]s.findFirst({
  where: eq([tableName]s.id, id),
  with: {
    relatedTable: true,
  },
})

// Insert
const [created] = await db
  .insert([tableName]s)
  .values({
    // field: value,
  })
  .returning()

// Update
const [updated] = await db
  .update([tableName]s)
  .set({
    // field: value,
    updatedAt: new Date(),
  })
  .where(eq([tableName]s.id, id))
  .returning()

// Delete
await db
  .delete([tableName]s)
  .where(eq([tableName]s.id, id))
```

## Validation with Zod

The generated Zod schemas can be used for validation:

```typescript
import { insert[TableName]Schema } from "@/lib/server/db/schema"

// In a server action
export async function create[TableName](data: unknown) {
  try {
    // Validate with Zod
    const validated = insert[TableName]Schema.parse(data)

    // Insert into database
    const [created] = await db
      .insert([tableName]s)
      .values(validated)
      .returning()

    return { success: true, data: created }
  } catch (error) {
    return { success: false, error: "Validation failed" }
  }
}
```

## Custom Zod Validation

You can extend the generated schemas:

```typescript
import { z } from "zod"

export const customInsertSchema = insert[TableName]Schema.extend({
  email: z.string().email(),
  age: z.number().min(0).max(150),
  password: z.string().min(8),
})
```

## Complete Example: Blog Posts Table

```typescript
// lib/server/db/schema/posts.ts
import { pgTable, text, timestamp, uuid, boolean } from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { relations } from "drizzle-orm"
import { users } from "./users"

export const posts = pgTable("post", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  slug: text("slug").notNull().unique(),
  published: boolean("published").default(false),

  // Foreign key
  authorId: uuid("authorId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
})

// Relations
export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
}))

// Zod schemas
export const insertPostSchema = createInsertSchema(posts)
export const selectPostSchema = createSelectSchema(posts)

// TypeScript types
export type Post = typeof posts.$inferSelect
export type NewPost = typeof posts.$inferInsert
```

## Checklist

Before completing, ensure:

- [ ] Schema file created in `lib/server/db/schema/`
- [ ] Table name is singular (e.g., "user", not "users")
- [ ] All fields have appropriate types
- [ ] Constraints applied (notNull, unique, etc.)
- [ ] Foreign keys defined correctly
- [ ] Relations defined (if applicable)
- [ ] Zod schemas generated
- [ ] TypeScript types exported
- [ ] Exported from `schema/index.ts`
- [ ] Migration run (`npm run db:push`)
- [ ] Example queries provided

---

Now help the user create their database table!
