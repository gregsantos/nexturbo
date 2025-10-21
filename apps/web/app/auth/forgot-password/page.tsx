import {ForgotPasswordForm} from "@/components/auth/forgot-password-form"
import {AuthLayout} from "@/components/auth/auth-layout"
import Link from "next/link"

export const metadata = {
  title: "Forgot Password",
  description: "Reset your password",
}

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title='Forgot Password'
      description='Enter your email to receive a password reset link'
      footer={
        <Link
          href='/auth/signin'
          className='font-medium underline underline-offset-4 hover:text-primary'
        >
          Back to Sign In
        </Link>
      }
    >
      <ForgotPasswordForm />
    </AuthLayout>
  )
}
