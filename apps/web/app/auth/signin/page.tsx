import {SignInForm} from "@/components/auth/signin-form"
import {AuthLayout} from "@/components/auth/auth-layout"
import Link from "next/link"
import {Suspense} from "react"

export const metadata = {
  title: "Sign In",
  description: "Sign in to your account",
}

function SignInContent() {
  return (
    <AuthLayout
      title='Sign In'
      description='Enter your credentials to access your account'
      footer={
        <span>
          <span className='text-muted-foreground'>
            Don&apos;t have an account?{" "}
          </span>
          <Link
            href='/auth/signup'
            className='font-medium underline underline-offset-4 hover:text-primary'
          >
            Sign up
          </Link>
        </span>
      }
    >
      <SignInForm />
    </AuthLayout>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInContent />
    </Suspense>
  )
}
