"use client";
import { useState } from 'react';

export default function CheckOrder() {
  const [refNum, setRefNum] = useState("");
  const [orderStatus, setOrderStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (!refNum) return alert("Please enter a reference number");
    
    setLoading(true);
    try {
      // We ask the backend: "What is the status of this order?"
      const response = await fetch(`https://obsinan-api.vercel.app/orders/${refNum}`);
      const data = await response.json();

      if (response.ok) {
        setOrderStatus(data.status);
      } else {
        setOrderStatus("Order not found. Please check the number.");
      }
    } catch (error) {
      setOrderStatus("Error connecting to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-8 flex flex-col items-center justify-center min-h-[70vh] bg-black">
      <div className="bg-gray-900 p-10 rounded-3xl border-2 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.3)] max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-cyan-400 mb-6 uppercase tracking-tighter">Track Order</h1>
        
        <div className="space-y-6">
          <input 
            type="text" 
            placeholder="e.g. OBS-123456" 
            className="w-full p-4 bg-black border border-gray-700 rounded-xl text-center text-xl tracking-widest text-cyan-300 outline-none focus:border-cyan-400"
            value={refNum}
            onChange={(e) => setRefNum(e.target.value.toUpperCase())}
          />
          
          <button 
            onClick={handleCheck}
            disabled={loading}
            className="w-full py-4 bg-cyan-600 hover:bg-cyan-400 text-white font-black rounded-xl transition-all shadow-lg"
          >
            {loading ? "SEARCHING..." : "CHECK STATUS"}
          </button>

          {orderStatus && (
            <div className="mt-8 p-6 bg-black/50 border border-dashed border-cyan-400 text-center rounded-2xl animate-pulse">
              <p className="text-gray-400 text-xs uppercase mb-1">Current Status</p>
              <p className={`text-2xl font-bold ${orderStatus === 'Completed' ? 'text-green-400' : 'text-yellow-400'}`}>
                {orderStatus}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}