import { Suspense } from "react"
import { StatsCard } from "@/components/dashboard/stats-card"
import { RecentActivity } from "@/components/dashboard/recent-activity"

// Simulated async data fetching - replace with real database queries
async function getStats() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return {
    totalUsers: 1234,
    activeUsers: 567,
    revenue: 89012,
    growth: 12.5,
  }
}

async function getRecentActivity() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  return [
    {
      id: "1",
      title: "New user registered",
      description: "john.doe@example.com",
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    },
    {
      id: "2",
      title: "Payment received",
      description: "$99.00 from subscription",
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
      id: "3",
      title: "Profile updated",
      description: "jane.smith@example.com",
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
  ]
}

export default async function DashboardPage() {
  // Fetch data in parallel
  const [stats, activity] = await Promise.all([getStats(), getRecentActivity()])

  return (
    <div className="container mx-auto space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s an overview of your account.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          description="+12% from last month"
        />
        <StatsCard
          title="Active Users"
          value={stats.activeUsers.toLocaleString()}
          description="+8% from last month"
        />
        <StatsCard
          title="Revenue"
          value={`$${(stats.revenue / 1000).toFixed(1)}k`}
          description={`+${stats.growth}% from last month`}
        />
        <StatsCard
          title="Growth"
          value={`${stats.growth}%`}
          description="Month over month"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Suspense fallback={<div className="h-96 animate-pulse rounded-lg border bg-card" />}>
          <RecentActivity activities={activity} />
        </Suspense>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90">
              Create New User
            </button>
            <button className="w-full rounded-md border px-4 py-2 text-sm hover:bg-accent">
              Export Data
            </button>
            <button className="w-full rounded-md border px-4 py-2 text-sm hover:bg-accent">
              View Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
