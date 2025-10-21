# Claude Skills for Next.js 15 Starter

This directory contains Claude Skills that help you develop features in this Next.js 15 application following best practices.

## Available Skills

### 1. Add Feature (`add-feature`)
Guides you through adding a complete new feature with routes, database tables, server actions, and components.

**When to use:**
- Adding a major new section to the app
- Building a new feature with multiple components
- Need guidance on architecture

**Example:**
```
Can you help me add a blog feature?
Use the add-feature skill.
```

### 2. Add Database Table (`add-db-table`)
Helps create a new database table with Drizzle ORM including schema, types, and validation.

**When to use:**
- Adding a new database table
- Creating relations between tables
- Setting up Zod validation schemas

**Example:**
```
I need to add a comments table for the blog posts.
Use the add-db-table skill.
```

### 3. Add Component (`add-component`)
Guides component creation following Next.js 15 and shadcn/ui patterns.

**When to use:**
- Creating new UI components
- Building forms
- Adding interactive elements

**Example:**
```
Create a reusable comment card component.
Use the add-component skill.
```

## How to Use Skills

Skills provide structured guidance for common development tasks. They ensure:
- ✅ Following Next.js 15 best practices
- ✅ Proper TypeScript typing
- ✅ Correct Server/Client component usage
- ✅ Database schema best practices
- ✅ Accessibility compliance

## Skill Workflow

Each skill follows a similar pattern:

1. **Understanding Requirements** - Asks clarifying questions
2. **Planning** - Outlines the implementation approach
3. **Implementation** - Guides step-by-step creation
4. **Validation** - Ensures best practices are followed

## Tips

- Skills work best when you provide clear requirements
- Answer the clarifying questions to get better results
- Skills can be combined (e.g., add-feature uses add-db-table internally)
- All skills follow the project's established patterns

## Creating Custom Skills

You can add your own skills by:

1. Creating a new `.md` file in `.claude/skills/`
2. Adding YAML frontmatter with description
3. Writing the skill prompt/guidance

Example:
```markdown
---
description: Your skill description
---

# Your Skill Name

Your skill content here...
```

## Related Documentation

- `/CLAUDE.md` - Comprehensive development guide
- `/apps/web/DEVELOPMENT.md` - Quick reference
- `/README.md` - Project overview
