import Sidebar from "@/components/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-background p-4 md:p-6">
        {children}
      </main>
    </div>
  );
}
