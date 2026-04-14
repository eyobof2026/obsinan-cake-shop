"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // Fixed: Added : any here
  const handleLogin = async (e: any) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("https://obsinan-api.vercel.app/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      if (res.ok) {
        // Save a small "token" in the browser so it remembers we logged in
        localStorage.setItem("isAdmin", "true");
        router.push("/admin/dashboard");
      } else {
        setError("AUTHENTICATION FAILED: ACCESS DENIED");
      }
    } catch (err) {
      setError("SERVER OFFLINE");
    }
  };

  return (
    <main className="h-screen flex items-center justify-center bg-black relative overflow-hidden font-sans">
      <div className="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] -top-20 -left-20"></div>
      
      <form onSubmit={handleLogin} className="z-10 w-full max-w-sm p-10 bg-gray-900/40 border border-white/5 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl text-white">
        <h1 className="text-3xl font-black text-white text-center mb-2 tracking-tighter italic">OBSINAN ADMIN</h1>
        <p className="text-cyan-500 text-[10px] text-center uppercase tracking-[0.4em] mb-10">Security Terminal</p>

        <div className="space-y-4">
          <input required type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-4 bg-black border border-gray-800 rounded-2xl text-white outline-none focus:border-cyan-500 transition-all" />
          <input required type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-4 bg-black border border-gray-800 rounded-2xl text-white outline-none focus:border-cyan-500 transition-all" />
          
          {error && <p className="text-red-500 text-[10px] font-bold text-center animate-pulse">{error}</p>}
          
          <button type="submit" className="w-full py-4 bg-cyan-600 hover:bg-cyan-400 text-white font-black rounded-2xl uppercase tracking-widest shadow-lg shadow-cyan-500/20 transition-all">
            Authorize Entry
          </button>
        </div>
      </form>
    </main>
  );
}