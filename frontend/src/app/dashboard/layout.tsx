import Sidebar from '@/components/sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      {/* This margin-left (ml-64) pushes the content so it's not hidden behind the sidebar */}
      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  );
}