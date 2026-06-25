import { AppShell } from "@/components/layout/app-shell";
import { AnalyticsDashboard } from "@/components/admin/analytics-dashboard";

export default function AdminAnalyticsPage() {
  return (
    <AppShell role="admin" title="Analytics" description="Orders per month, revenue estimate, top category, conversion, dan workload.">
      <AnalyticsDashboard />
    </AppShell>
  );
}
