"use client";
import { useState } from "react";

export default function AdminSettings() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [status, setStatus] = useState("");

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (pass !== confirmPass) return setStatus("Passwords do not match!");

    try {
      const res = await fetch("https://obsinan-api.vercel.app/admin/update-security", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user, password: pass })
      });

      if (res.ok) {
        setStatus("SECURITY UPDATED SUCCESSFULLY");
        setUser(""); setPass(""); setConfirmPass("");
      }
    } catch (err) { setStatus("Error updating security"); }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-black mb-8 text-white italic">SECURITY SETTINGS</h1>
      
      <div className="bg-gray-900 p-8 rounded-[2.5rem] border border-red-900/20 shadow-2xl">
        <h2 className="text-red-500 text-xs font-bold uppercase mb-6 tracking-widest flex items-center gap-2">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
          Modify Access Credentials
        </h2>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="text-gray-500 text-[10px] uppercase font-bold ml-2">New Username</label>
            <input required value={user} onChange={(e) => setUser(e.target.value)} className="w-full p-4 bg-black border border-gray-800 rounded-2xl text-white outline-none focus:border-red-500" />
          </div>

          <div>
            <label className="text-gray-500 text-[10px] uppercase font-bold ml-2">New Password</label>
            <input required type="password" value={pass} onChange={(e) => setPass(e.target.value)} className="w-full p-4 bg-black border border-gray-800 rounded-2xl text-white outline-none focus:border-red-500" />
          </div>

          <div>
            <label className="text-gray-500 text-[10px] uppercase font-bold ml-2">Confirm New Password</label>
            <input required type="password" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} className="w-full p-4 bg-black border border-gray-800 rounded-2xl text-white outline-none focus:border-red-500" />
          </div>

          {status && <p className="text-center text-xs text-yellow-500 font-bold italic">{status}</p>}

          <button type="submit" className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-black rounded-2xl uppercase tracking-widest shadow-lg shadow-red-500/10 transition-all mt-4">
            Update System Keys
          </button>
        </form>
      </div>
      
      <p className="mt-8 text-gray-600 text-[10px] text-center leading-relaxed">
        WARNING: Changing security keys will take effect immediately. <br/>
        All future sessions must use the new credentials.
      </p>
    </div>
  );
}