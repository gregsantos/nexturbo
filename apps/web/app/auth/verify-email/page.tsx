"use client"

import {useSearchParams} from "next/navigation"
import {Mail, CheckCircle} from "lucide-react"
import Link from "next/link"
import {Button} from "@/components/ui/button"
import {AuthLayout} from "@/components/auth/auth-layout"

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email")
  const verified = searchParams.get("verified")

  if (verified === "true") {
    return (
      <AuthLayout
        title='Email Verified!'
        description='Your email has been successfully verified. You can now sign in to your account.'
        icon={<CheckCircle className='h-12 w-12 text-green-600 sm:h-16 sm:w-16' />}
      >
        <Button asChild className='h-11 w-full sm:h-10'>
          <Link href='/auth/signin'>Sign In</Link>
        </Button>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title='Check Your Email'
      description={
        <>
          We&apos;ve sent a verification link to{" "}
          {email ? (
            <span className='font-medium text-foreground'>{email}</span>
          ) : (
            "your email address"
          )}
          .
        </>
      }
      icon={<Mail className='h-12 w-12 text-primary sm:h-16 sm:w-16' />}
    >
      <div className='space-y-3 sm:space-y-4'>
        <p className='text-center text-xs text-muted-foreground sm:text-sm'>
          Click the link in the email to verify your account and complete the
          signup process.
        </p>

        <div className='rounded-lg border bg-muted/50 p-3 sm:p-4'>
          <p className='text-xs text-muted-foreground sm:text-sm'>
            Didn&apos;t receive the email? Check your spam folder or{" "}
            <button className='font-medium text-primary underline underline-offset-4 hover:text-primary/80'>
              resend verification email
            </button>
            .
          </p>
        </div>

        <div className='text-center'>
          <Link
            href='/auth/signin'
            className='text-sm font-medium underline underline-offset-4 hover:text-primary'
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    </AuthLayout>
  )
}
