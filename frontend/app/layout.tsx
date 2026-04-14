import "./globals.css";
import Link from "next/link";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white flex flex-col min-h-screen font-sans">
        
        {/* TOP NAVIGATION (Visible on Tablets & Laptops) */}
        <nav className="p-4 md:p-6 border-b border-cyan-900/30 flex justify-between items-center bg-black/50 backdrop-blur-md sticky top-0 z-50">
          <div className="flex items-center gap-2">
             <span className="text-xl md:text-2xl font-black text-cyan-400 tracking-tighter">OBSINAN</span>
          </div>
          
          {/* Menu - Hidden on tiny phones, shown as small text on tablets */}
          <div className="hidden sm:flex space-x-6 md:space-x-10 text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold">
            <Link href="/" className="hover:text-cyan-400">Home</Link>
            <Link href="/contact" className="hover:text-cyan-400">Contact</Link>
            <Link href="/check-order" className="hover:text-cyan-400">Status</Link>
          </div>

          <Link href="/admin/login" className="p-2 border border-cyan-500/30 rounded-full text-xs">🔒</Link>
        </nav>

        {/* MAIN CONTENT */}
        <div className="flex-grow">
          {children}
        </div>

        {/* MOBILE BOTTOM NAVIGATION (Only shows on Phones) */}
        <div className="sm:hidden fixed bottom-4 left-4 right-4 bg-gray-900/80 backdrop-blur-2xl border border-white/10 rounded-2xl flex justify-around items-center py-4 z-50 shadow-2xl">
          <Link href="/" className="flex flex-col items-center gap-1">
            <span className="text-lg">🏠</span>
            <span className="text-[8px] uppercase font-bold text-cyan-400">Home</span>
          </Link>
          <Link href="/contact" className="flex flex-col items-center gap-1">
            <span className="text-lg">📞</span>
            <span className="text-[8px] uppercase font-bold text-cyan-400">Contact</span>
          </Link>
          <Link href="/check-order" className="flex flex-col items-center gap-1">
            <span className="text-lg">🔎</span>
            <span className="text-[8px] uppercase font-bold text-cyan-400">Status</span>
          </Link>
        </div>

        <footer className="p-10 border-t border-cyan-900/20 bg-gray-900/10 text-center pb-32 md:pb-10">
          <a href="https://maps.app.goo.gl/bDweVyN4SbLyLXkU8" target="_blank" className="text-cyan-400 text-xs">📍 Bekoji Kuma Building, Ground Floor</a>
        </footer>
      </body>
    </html>
  );
}