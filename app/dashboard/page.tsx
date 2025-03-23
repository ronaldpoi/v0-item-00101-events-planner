import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { UpcomingEvents } from "@/components/dashboard/upcoming-events"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { AuthGuard } from "@/components/auth/auth-guard"

export default function DashboardPage() {
  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-6">
        <DashboardHeader />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mt-6">
          <DashboardStats />
        </div>
        <div className="grid gap-6 md:grid-cols-2 mt-6">
          <UpcomingEvents />
          <RecentActivity />
        </div>
      </div>
    </AuthGuard>
  )
}

