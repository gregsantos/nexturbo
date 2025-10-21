import {Suspense} from "react"
import {VerifyEmailContent} from "./verify-email-content"

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  )
}
