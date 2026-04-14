// frontend/app/admin/dashboard/layout.tsx
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-black border-r border-white/5 p-6 flex flex-col">
        <div className="mb-10">
          <h2 className="text-xl font-bold text-cyan-400">ADMIN PANEL</h2>
          <p className="text-[10px] text-gray-500">Obsinan Cake Shop</p>
        </div>

        <nav className="flex flex-col gap-4 text-sm font-medium">
          <Link href="/admin/dashboard" className="hover:text-cyan-400 p-2 rounded transition-all">📊 Statistics</Link>
          <Link href="/admin/dashboard/orders" className="hover:text-cyan-400 p-2 rounded transition-all">🛍️ New Orders</Link>
          <Link href="/admin/dashboard/completed" className="hover:text-cyan-400 p-2 rounded transition-all">✅ Completed</Link>
          <Link href="/admin/dashboard/prices" className="hover:text-cyan-400 p-2 rounded transition-all">💰 Prices & Types</Link>
          <Link href="/admin/dashboard/messages" className="hover:text-cyan-400 p-2 rounded transition-all">📩 Messages</Link>
          <Link href="/admin/dashboard/settings" className="hover:text-cyan-400 p-2 rounded transition-all">⚙️ Security</Link>
        </nav>

        <div className="mt-auto pt-10">
          <Link href="/" className="text-red-500 text-xs uppercase font-bold">Logout</Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}