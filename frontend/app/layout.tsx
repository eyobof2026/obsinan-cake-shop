// frontend/app/layout.tsx
import "./globals.css";
import Link from "next/link";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white flex flex-col min-h-screen">
        {/* Navigation Bar */}
        <nav className="p-5 border-b border-cyan-900/30 flex justify-between items-center bg-black/50 backdrop-blur-md sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <div className="text-2xl font-black text-cyan-400 tracking-tighter">OBSINAN</div>
          </div>
          
          <div className="hidden md:flex space-x-8 text-sm uppercase tracking-widest font-medium">
            <Link href="/" className="hover:text-cyan-400 transition-colors">Home</Link>
            <Link href="/contact" className="hover:text-cyan-400 transition-colors">Contact</Link>
            <Link href="/check-order" className="hover:text-cyan-400 transition-colors">Check Order</Link>
          </div>

          <div className="flex items-center gap-4">
             {/* Admin Login Button - Subtle futuristic look */}
             <Link 
              href="/admin/login" 
              className="p-2 border border-cyan-500/30 rounded-full hover:bg-cyan-500/10 transition-all group"
              title="Admin Login"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-cyan-500 group-hover:rotate-12 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
            </Link>
          </div>
        </nav>

        {/* The Main Content */}
        <div className="flex-grow">{children}</div>

        {/* The Futuristic Footer */}
        <footer className="p-10 border-t border-cyan-900/30 bg-gray-900/20 text-center relative overflow-hidden">
          {/* Subtle background glow for footer */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-24 bg-cyan-500/10 blur-[80px] rounded-full"></div>

          <p className="text-gray-500 text-xs uppercase tracking-[0.2em] mb-4 font-bold">Find us at</p>
          <a 
            href="https://maps.app.goo.gl/bDweVyN4SbLyLXkU8" 
            target="_blank" 
            className="text-cyan-400 hover:text-white transition-all text-lg font-light"
          >
            📍 Bekoji Kuma Building, Ground Floor
          </a>
          
          <div className="mt-8 flex justify-center gap-6 text-[10px] uppercase tracking-widest text-gray-600">
            <span>© 2023 Obsinan Cake Shop</span>
            <Link href="/admin/login" className="hover:text-cyan-500 transition-colors">Staff Portal</Link>
          </div>
        </footer>
      </body>
    </html>
  );
}