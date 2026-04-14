"use client";
import { useEffect, useState } from "react";

export default function DashboardStats() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    delivered: 0,
    income: 0
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("https://obsinan-api.vercel.app/admin/orders");
        const orders = await response.json();
        
        // Calculate the math based on real data
        const total = orders.length;
        // Fixed: Added (o: any)
        const made = orders.filter((o: any) => o.status === "Completed").length;
        // Fixed: Added (sum: number, o: any)
        const totalIncome = orders.reduce((sum: number, o: any) => sum + o.price, 0);

        setStats({ totalOrders: total, delivered: made, income: totalIncome });
      } catch (error) {
        console.error("Failed to fetch stats");
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold mb-8 uppercase tracking-widest">System Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-gray-900 p-8 rounded-3xl border border-white/5">
          <p className="text-gray-500 text-xs uppercase font-bold mb-2">Orders Received</p>
          <h2 className="text-5xl font-black text-cyan-400">{stats.totalOrders}</h2>
        </div>
        
        <div className="bg-gray-900 p-8 rounded-3xl border border-white/5">
          <p className="text-gray-500 text-xs uppercase font-bold mb-2">Successfully Made</p>
          <h2 className="text-5xl font-black text-green-400">{stats.delivered}</h2>
        </div>

        <div className="bg-gray-900 p-8 rounded-3xl border border-white/5">
          <p className="text-gray-500 text-xs uppercase font-bold mb-2">Total Income</p>
          <h2 className="text-5xl font-black text-yellow-400">{stats.income} <span className="text-sm">ETB</span></h2>
        </div>
      </div>

      <div className="bg-cyan-900/5 border border-cyan-500/20 p-10 rounded-3xl">
        <p className="text-cyan-400 font-mono italic">"Ready to bake more cakes, Captain?"</p>
      </div>
    </div>
  );
}