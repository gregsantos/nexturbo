import {SignUpForm} from "@/components/auth/signup-form"
import {AuthLayout} from "@/components/auth/auth-layout"
import Link from "next/link"

export const metadata = {
  title: "Sign Up",
  description: "Create a new account",
}

export default function SignUpPage() {
  return (
    <AuthLayout
      title='Create Account'
      description='Enter your information to get started'
      footer={
        <span>
          <span className='text-muted-foreground'>
            Already have an account?{" "}
          </span>
          <Link
            href='/auth/signin'
            className='font-medium underline underline-offset-4 hover:text-primary'
          >
            Sign in
          </Link>
        </span>
      }
    >
      <SignUpForm />
    </AuthLayout>
  )
}
