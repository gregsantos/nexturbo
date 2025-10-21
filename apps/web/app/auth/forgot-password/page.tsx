import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"
import Link from "next/link"

export const metadata = {
  title: "Forgot Password",
  description: "Reset your password",
}

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Forgot Password</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your email to receive a password reset link
          </p>
        </div>

        <ForgotPasswordForm />

        <div className="text-center text-sm">
          <Link href="/auth/signin" className="font-medium underline underline-offset-4">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
