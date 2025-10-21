export default function DashboardLoading() {
  return (
    <div className="container mx-auto p-8">
      <div className="space-y-4">
        <div className="h-8 w-64 animate-pulse rounded-lg bg-muted" />
        <div className="h-4 w-96 animate-pulse rounded bg-muted" />

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-lg border bg-card"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
