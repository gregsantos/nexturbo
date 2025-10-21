import { ResetPasswordForm } from "@/components/auth/reset-password-form"
import Link from "next/link"
import { Suspense } from "react"

export const metadata = {
  title: "Reset Password",
  description: "Set a new password for your account",
}

function ResetPasswordContent() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Reset Password</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your new password below
          </p>
        </div>

        <ResetPasswordForm />

        <div className="text-center text-sm">
          <Link href="/auth/signin" className="font-medium underline underline-offset-4">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  )
}
