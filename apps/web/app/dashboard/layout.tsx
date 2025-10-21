import { redirect } from "next/navigation"
import { auth } from "@/lib/server/auth"
import { headers } from "next/headers"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"

export const metadata = {
  title: "Dashboard",
  description: "Manage your account",
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/auth/signin")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardNav user={session.user} />
      <main className="flex-1">{children}</main>
    </div>
  )
}
