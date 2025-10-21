"use client"

import { useSearchParams } from "next/navigation"
import { Mail, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email")
  const verified = searchParams.get("verified")

  if (verified === "true") {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="flex justify-center">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Email Verified!</h1>
            <p className="text-muted-foreground">
              Your email has been successfully verified. You can now sign in to your account.
            </p>
          </div>

          <Button asChild className="w-full">
            <Link href="/auth/signin">Sign In</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="flex justify-center">
          <Mail className="h-16 w-16 text-primary" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Check Your Email</h1>
          <p className="text-muted-foreground">
            We&apos;ve sent a verification link to{" "}
            {email ? (
              <span className="font-medium text-foreground">{email}</span>
            ) : (
              "your email address"
            )}
            .
          </p>
          <p className="text-sm text-muted-foreground">
            Click the link in the email to verify your account and complete the signup process.
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border bg-muted/50 p-4">
            <p className="text-sm text-muted-foreground">
              Didn&apos;t receive the email? Check your spam folder or{" "}
              <button className="font-medium text-primary underline underline-offset-4">
                resend verification email
              </button>
              .
            </p>
          </div>

          <div className="text-center text-sm">
            <Link href="/auth/signin" className="font-medium underline underline-offset-4">
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
