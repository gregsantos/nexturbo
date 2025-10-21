import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "./db"
import { users, sessions, accounts, verifications } from "./db/schema"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: users,
      session: sessions,
      account: accounts,
      verification: verifications,
    },
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Disabled for local development
    sendResetPassword: async ({ user, url }) => {
      // Send password reset email
      // TODO: Replace with actual email service (e.g., Resend, SendGrid)
      console.log(`Password reset for ${user.email}: ${url}`)
      // Example with Resend:
      // await resend.emails.send({
      //   from: "noreply@yourapp.com",
      //   to: user.email,
      //   subject: "Reset your password",
      //   html: `<p>Click <a href="${url}">here</a> to reset your password</p>`
      // })
    },
  },
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL,
  socialProviders: {
    // Add social providers here when needed
  },
})
