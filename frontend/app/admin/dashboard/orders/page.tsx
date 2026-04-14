"use client";
import { useEffect, useState } from "react";

export default function PendingOrders() {
  const [orders, setOrders] = useState([]);
  const [cakeTypes, setCakeTypes] = useState([]);
  const [filter, setFilter] = useState("All");
  const [viewingReceipt, setViewingReceipt] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Load Orders and Cake Types from Database
  const loadData = async () => {
    setLoading(true);
    try {
      const [orderRes, cakeRes] = await Promise.all([
        fetch("http://localhost:8000/admin/orders"),
        fetch("http://localhost:8000/cake-types")
      ]);
      
      const orderData = await orderRes.json();
      const cakeData = await cakeRes.json();
      
      // We only want Pending orders for this page
      setOrders(orderData.filter(o => o.status === "Pending"));
      setCakeTypes(cakeData);
    } catch (err) {
      console.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  // 2. Update Order Status (Complete or Cancel)
  const handleStatusChange = async (ref, newStatus) => {
    if (confirm(`Are you sure you want to mark this as ${newStatus}?`)) {
      await fetch(`http://localhost:8000/admin/orders/${ref}?status=${newStatus}`, {
        method: "PUT"
      });
      loadData(); // Refresh list
    }
  };

  // 3. Filter Logic
  const filteredOrders = filter === "All" 
    ? orders 
    : orders.filter(o => o.cake_type === filter);

  if (loading) return <div className="p-10 text-cyan-500 animate-pulse font-mono uppercase">Scanning for new transmissions...</div>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Header & Filter */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-black text-white italic tracking-tighter">PENDING ORDERS</h1>
          <p className="text-cyan-500 text-xs font-bold uppercase tracking-[0.3em]">Operational Queue</p>
        </div>
        
        <div className="flex items-center gap-3 bg-gray-900 p-2 rounded-2xl border border-white/5">
          <span className="text-gray-500 text-[10px] font-bold uppercase ml-2">Filter By:</span>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="bg-black text-cyan-400 text-xs p-2 rounded-xl outline-none border border-cyan-900/50"
          >
            <option value="All">All Types</option>
            {cakeTypes.map(c => <option key={c._id} value={c.price}>{c.name}</option>)}
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="grid grid-cols-1 gap-8">
        {filteredOrders.length === 0 ? (
          <div className="p-20 border border-dashed border-white/5 rounded-[3rem] text-center">
            <p className="text-gray-600 uppercase tracking-widest">System Clear. No Pending Orders.</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.ref_number} className="bg-gray-900/50 border border-white/10 p-8 rounded-[2.5rem] shadow-2xl backdrop-blur-md relative overflow-hidden group">
              {/* Subtle accent light */}
              <div className="absolute top-0 left-0 w-2 h-full bg-cyan-600 shadow-[0_0_20px_cyan]"></div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                
                {/* Info Block 1: Customer */}
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Customer</p>
                    <h3 className="text-2xl font-bold text-white uppercase">{order.full_name}</h3>
                    <p className="text-cyan-400 font-mono">{order.phone}</p>
                  </div>
                  <div className="bg-black/50 p-3 rounded-xl border border-white/5">
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Ref ID</p>
                    <p className="text-white font-mono tracking-widest">{order.ref_number}</p>
                  </div>
                </div>

                {/* Info Block 2: Cake Details */}
                <div className="bg-cyan-950/20 p-6 rounded-3xl border border-cyan-500/10">
                  <p className="text-[10px] text-cyan-500 uppercase font-black tracking-widest mb-3">Cake Specification</p>
                  <div className="p-4 bg-black/40 rounded-2xl border border-white/5 italic text-white mb-4">
                    &quot;{order.cake_text}&quot;
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="text-gray-500">Delivery Date</p>
                      <p className="text-white font-bold">{order.delivery_date}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Delivery Time</p>
                      <p className="text-white font-bold">{order.delivery_time}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Price</p>
                      <p className="text-green-400 font-bold">{order.price} ETB</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Bank</p>
                      <p className="text-yellow-500 font-bold uppercase">{order.pay_method}</p>
                    </div>
                  </div>
                </div>

                {/* Info Block 3: Verification */}
                <div className="flex flex-col justify-center gap-3">
                  <button 
                    onClick={() => setViewingReceipt(order.receipt_data)}
                    className="w-full py-4 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase rounded-2xl border border-white/10 transition-all tracking-[0.2em]"
                  >
                    View Transaction Receipt
                  </button>
                  <button 
                    onClick={() => handleStatusChange(order.ref_number, "Completed")}
                    className="w-full py-4 bg-cyan-500 hover:bg-green-400 text-black font-black uppercase rounded-2xl transition-all tracking-[0.1em]"
                  >
                    Order is Made
                  </button>
                  <button 
                    onClick={() => handleStatusChange(order.ref_number, "Canceled")}
                    className="w-full py-4 bg-transparent hover:bg-red-600/20 text-red-500 font-bold text-[10px] uppercase rounded-2xl border border-red-500/20 transition-all"
                  >
                    Cancel Order
                  </button>
                </div>

              </div>
            </div>
          ))
        )}
      </div>

      {/* RECEIPT VIEWER MODAL */}
      {viewingReceipt && (
        <div className="fixed inset-0 z-[999] bg-black/95 flex items-center justify-center p-6 backdrop-blur-xl animate-in fade-in zoom-in duration-300">
          <div className="max-w-4xl w-full flex flex-col items-center">
            <button 
              onClick={() => setViewingReceipt(null)}
              className="mb-4 bg-red-600 px-8 py-3 rounded-full text-white font-black text-xs uppercase tracking-widest hover:bg-red-500 transition-all"
            >
              Close X
            </button>
            <div className="w-full h-[75vh] bg-gray-800 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-3xl">
              {/* If user uploaded an image, this displays it. If it's a PDF, iFrame handles it. */}
              <iframe 
                src={viewingReceipt} 
                className="w-full h-full border-0"
                title="Receipt Preview"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}