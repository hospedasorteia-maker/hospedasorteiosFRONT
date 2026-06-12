import DashboardAuthGuard from "@/components/dashboard/auth/DashboardAuthGuard";

export default function DashboardLayout({ children }) {
  return <DashboardAuthGuard>{children}</DashboardAuthGuard>;
}
