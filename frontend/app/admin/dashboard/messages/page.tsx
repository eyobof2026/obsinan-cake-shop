"use client";
import { useEffect, useState } from "react";

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch("http://localhost:8000/admin/messages");
        const data = await res.json();
        setMessages(data);
      } catch (e) { console.error("Error fetching messages"); }
    };
    fetchMessages();
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-black mb-10 text-cyan-400 tracking-tighter">INCOMING TRANSMISSIONS</h1>
      
      <div className="space-y-6">
        {messages.length === 0 ? (
          <p className="text-gray-600 italic border border-dashed border-gray-800 p-20 text-center rounded-3xl">No messages in inbox.</p>
        ) : (
          messages.map((m) => (
            <div key={m._id} className="bg-gray-900/80 p-8 rounded-[2rem] border border-white/5 relative overflow-hidden group">
              {/* Futuristic Accent */}
              <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500 shadow-[0_0_10px_cyan]"></div>
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-xl font-bold text-white uppercase">{m.name}</h4>
                  <p className="text-cyan-500 font-mono text-sm">{m.phone}</p>
                </div>
                <span className="text-gray-600 text-[10px] uppercase font-bold bg-black px-2 py-1 rounded border border-white/5">
                  {m.timestamp}
                </span>
              </div>
              
              <div className="bg-black/40 p-4 rounded-2xl border border-white/5 text-gray-300 italic leading-relaxed">
                "{m.message}"
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}