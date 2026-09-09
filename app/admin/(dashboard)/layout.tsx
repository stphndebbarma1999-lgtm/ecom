import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-50 lg:flex-row">
      <AdminSidebar />
      <main className="flex-1 p-5 lg:p-8">{children}</main>
    </div>
  );
}
