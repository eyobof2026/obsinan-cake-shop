"use client";
import { useEffect, useState } from "react";

export default function CompletedOrders() {
  const [orders, setOrders] = useState([]);

  const loadOrders = async () => {
    try {
      const response = await fetch("https://obsinan-api.vercel.app/admin/orders");
      const data = await response.json();
      // Added : any here to satisfy the TypeScript compiler
      const finished = data.filter((o: any) => o.status === "Completed");
      setOrders(finished);
    } catch (err) {
      console.error("Failed to load completed orders");
    }
  };

  useEffect(() => { loadOrders(); }, []);

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-green-400 uppercase tracking-widest italic">Completed History</h1>
      <div className="space-y-4">
        {orders.length === 0 ? (
          <p className="text-gray-500 italic border border-gray-800 p-10 rounded-2xl text-center">No completed orders found.</p>
        ) : (
          orders.map((order: any) => (
            <div key={order.ref_number} className="bg-gray-900/50 border border-green-900/30 p-6 rounded-3xl flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-white uppercase">{order.full_name}</h3>
                <p className="text-gray-500 text-sm font-mono tracking-tighter">ID: {order.ref_number} | {order.price} ETB</p>
              </div>
              <span className="px-4 py-2 bg-green-500 text-black text-[10px] font-black rounded-lg">DELIVERED</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}