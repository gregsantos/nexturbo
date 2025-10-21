import {ResetPasswordForm} from "@/components/auth/reset-password-form"
import {AuthLayout} from "@/components/auth/auth-layout"
import Link from "next/link"
import {Suspense} from "react"

export const metadata = {
  title: "Reset Password",
  description: "Set a new password for your account",
}

function ResetPasswordContent() {
  return (
    <AuthLayout
      title='Reset Password'
      description='Enter your new password below'
      footer={
        <Link
          href='/auth/signin'
          className='font-medium underline underline-offset-4 hover:text-primary'
        >
          Back to Sign In
        </Link>
      }
    >
      <ResetPasswordForm />
    </AuthLayout>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  )
}
