"use client";
import { useEffect, useState } from "react";

export default function PriceManager() {
  const [cakes, setCakes] = useState<any[]>([]);
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newImage, setNewImage] = useState(""); 
  const [editingId, setEditingId] = useState(null);
  
  // New state to hold the actual file for Cloudinary
  const [imageFile, setImageFile] = useState(null);

  const loadCakes = async () => {
    try {
      const res = await fetch("https://obsinan-api.vercel.app/cake-types");
      const data = await res.json();
      setCakes(data);
    } catch (e) { console.error("Could not load cakes"); }
  };

  useEffect(() => { loadCakes(); }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file); // Save file for Cloudinary
      const reader = new FileReader();
      reader.onloadend = () => setNewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!newName || !newPrice || (!newImage && !editingId)) {
      return alert("Please fill in Name, Price, and choose a Photo!");
    }

    try {
      let finalImageUrl = newImage;

      // PHASE 1: Upload to Cloudinary if a new file was selected
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("upload_preset", "obsinan_preset");

        // REPLACE 'YOUR_CLOUD_NAME' with your real cloud name
        const cloudRes = await fetch("https://api.cloudinary.com/v1_1/dvfyk53f9/auto/upload", {
          method: "POST",
          body: formData
        });
        const cloudData = await cloudRes.json();
        finalImageUrl = cloudData.secure_url;
      }

      // PHASE 2: Send data to Backend
      const cakeData = { 
        name: newName, 
        price: parseInt(newPrice), 
        image_data: finalImageUrl 
      };

      const url = editingId 
        ? `https://obsinan-api.vercel.app/cake-types/${editingId}` 
        : "https://obsinan-api.vercel.app/cake-types";
      
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cakeData)
      });

      if (res.ok) {
        setNewName(""); setNewPrice(""); setNewImage(""); setImageFile(null); setEditingId(null);
        loadCakes();
        alert(editingId ? "Cake Updated!" : "Cake Added!");
      }
    } catch (err) {
      alert("Failed to save. Check if backend is running.");
    }
  };

  const deleteCake = async (id) => {
    if(confirm("Are you sure you want to delete this cake?")) {
      await fetch(`https://obsinan-api.vercel.app/cake-types/${id}`, { method: "DELETE" });
      loadCakes();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-black text-cyan-400 mb-8 italic tracking-widest">MENU CONFIGURATION</h1>

      {/* Input Section */}
      <div className="bg-gray-900 p-8 rounded-[2rem] border border-white/5 mb-10 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Cake Name" className="bg-black p-4 rounded-2xl border border-gray-800 text-white outline-none focus:border-cyan-500" />
          <input value={newPrice} onChange={(e) => setNewPrice(e.target.value)} placeholder="Price (ETB)" type="number" className="bg-black p-4 rounded-2xl border border-gray-800 text-white outline-none focus:border-cyan-500" />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-500 mb-2 text-xs uppercase font-bold ml-2">Upload Cake Master Image:</label>
          <input type="file" onChange={handleFileChange} className="block w-full text-sm text-gray-400 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:bg-gray-800 file:text-cyan-400 hover:file:bg-gray-700 cursor-pointer" />
        </div>

        <button onClick={handleSave} className="w-full bg-cyan-500 py-4 text-black font-black rounded-2xl uppercase tracking-[0.3em] hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20">
           {editingId ? "Update System Entry" : "Add to Database"}
        </button>
        {editingId && <button onClick={() => {setEditingId(null); setNewName(""); setNewPrice(""); setNewImage(""); setImageFile(null);}} className="w-full mt-2 text-gray-500 text-xs uppercase">Cancel Edit</button>}
      </div>

      {/* List Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cakes.map((cake : any) => (
          <div key={cake._id} className="bg-gray-900 p-4 rounded-[1.5rem] flex items-center gap-4 border border-white/5 hover:border-cyan-500/30 transition-all">
            <img src={cake.image_data} className="w-20 h-20 object-cover rounded-xl border-2 border-cyan-500/20" alt="cake" />
            <div className="flex-1">
              <h3 className="font-bold text-lg leading-none mb-1">{cake.name}</h3>
              <p className="text-cyan-400 font-mono text-sm">{cake.price} ETB</p>
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={() => { setEditingId(cake._id); setNewName(cake.name); setNewPrice(cake.price); setNewImage(cake.image_data); window.scrollTo(0,0); }} className="text-[10px] bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full border border-yellow-500/20 font-bold uppercase">Edit</button>
              <button onClick={() => deleteCake(cake._id)} className="text-[10px] bg-red-500/10 text-red-500 px-3 py-1 rounded-full border border-red-500/20 font-bold uppercase">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}