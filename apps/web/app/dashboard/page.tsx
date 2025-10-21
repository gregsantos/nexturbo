import {Suspense} from "react"
import {StatsCard} from "@/components/dashboard/stats-card"
import {RecentActivity} from "@/components/dashboard/recent-activity"
import {QuickActions} from "@/components/dashboard/quick-actions"
import {PageLayout, Section} from "@/components/shared"

// Simulated async data fetching - replace with real database queries
async function getStats() {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  return {
    totalUsers: 1234,
    activeUsers: 567,
    revenue: 89012,
    growth: 12.5,
  }
}

async function getRecentActivity() {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800))

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
    <PageLayout
      title='Dashboard'
      description="Welcome back! Here's an overview of your account."
    >
      <Section>
        {/* Stats Grid */}
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          <StatsCard
            title='Total Users'
            value={stats.totalUsers.toLocaleString()}
            description='+12% from last month'
          />
          <StatsCard
            title='Active Users'
            value={stats.activeUsers.toLocaleString()}
            description='+8% from last month'
          />
          <StatsCard
            title='Revenue'
            value={`$${(stats.revenue / 1000).toFixed(1)}k`}
            description={`+${stats.growth}% from last month`}
          />
          <StatsCard
            title='Growth'
            value={`${stats.growth}%`}
            description='Month over month'
          />
        </div>

        {/* Content Grid */}
        <div className='grid gap-4 sm:gap-6 md:grid-cols-2'>
          <Suspense
            fallback={
              <div className='h-96 animate-pulse rounded-lg border bg-card' />
            }
          >
            <RecentActivity activities={activity} />
          </Suspense>

          <QuickActions />
        </div>
      </Section>
    </PageLayout>
  )
}
