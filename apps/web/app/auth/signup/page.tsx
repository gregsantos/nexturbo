import { SignUpForm } from "@/components/auth/signup-form"
import Link from "next/link"

export const metadata = {
  title: "Sign Up",
  description: "Create a new account",
}

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Create Account</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your information to get started
          </p>
        </div>

        <SignUpForm />

        <div className="text-center text-sm">
          <span className="text-muted-foreground">Already have an account? </span>
          <Link href="/auth/signin" className="font-medium underline underline-offset-4">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
