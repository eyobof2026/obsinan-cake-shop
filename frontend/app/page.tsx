"use client";

import { useState, useEffect } from 'react';

export default function HomePage() {
  // --- 1. STATE (Memory of the Form) ---
  const [lang, setLang] = useState('en');
  const [price, setPrice] = useState("");
  const [payMethod, setPayMethod] = useState("");
  const [refNumber, setRefNumber] = useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [cakeText, setCakeText] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [minDate, setMinDate] = useState("");

  // New state to hold cake types from the database
  const [dbCakes, setDbCakes] = useState<any[]>([]);
  // Track the specific ID of the cake selected to show its unique image
  const [selectedCakeId, setSelectedCakeId] = useState("");
  
  // New states to hold the receipt file for Cloudinary
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptData, setReceiptData] = useState("");

  // --- 2. SETTINGS & DATA ---
  const cakeDetails: Record<string, { img: string }> = {
    "700": { img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500" },
    "900": { img: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=500" },
    "1100": { img: "https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=500" },
    "1500": { img: "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=500" },
    "2000": { img: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=500" },
    "5000": { img: "https://images.unsplash.com/photo-1535254973040-607b474cb80d?w=500" },
  };

  const bankAccounts: Record<string, string> = {
    telebirr: "Telebirr: 0911223344 (Obsinan Cake)",
    cbe: "CBE: 100044556677 (Obsinan Cake Shop)",
    dashen: "Dashen: 5544332211 (Obsinan Cake)",
    awash: "Awash: 013204455667 (Obsinan Cake)",
  };

  // --- LANGUAGE DICTIONARY ---
  const translations: any = {
    en: { title: "OBSINAN CAKE SHOP", subtitle: "Futuristic Baking Experience", fullName: "Full Name", phone: "Phone Number", cakeText: "Text to be written on cake", deliveryDate: "Delivery Date", deliveryTime: "Delivery Time (After 11:00 AM)", selectPrice: "Select Cake Size/Price", paymentMethod: "Payment Method", uploadReceipt: "Upload Receipt (Photo or PDF)", completeBtn: "Complete My Order", downPayment: "Expected Down Payment", orderPlaced: "ORDER PLACED!", thankYou: "Thank you for choosing Obsinan Cake Shop.", refText: "Your Reference Number is:", anotherOrder: "Make another order", selectBank: "Select Bank...", birr: "Birr" },
    am: { title: "ኦብሰናን ኬክ ቤት", subtitle: "የወደፊት የኬክ ጥበብ", fullName: "ሙሉ ስም", phone: "ስልክ ቁጥር", cakeText: "ኬክ ላይ የሚጻፍ ጽሁፍ", deliveryDate: "የሚረከቡበት ቀን", deliveryTime: "የሚረከቡበት ሰዓት (ከ 5:00 በኋላ)", selectPrice: "የኬክ ዋጋ ይምረጡ", paymentMethod: "የክፍያ መንገድ", uploadReceipt: "ደረሰኝ ያስገቡ (ፎቶ ወይም ፒዲኤፍ)", completeBtn: "ትዕዛዙን ጨርስ", downPayment: "ቅድመ ክፍያ", orderPlaced: "ትዕዛዝዎ ተመዝግቧል!", thankYou: "ኦብሰናን ኬክ ቤትን ስለመረጡ እናመሰግናለን።", refText: "የመለያ ቁጥርዎ፦", anotherOrder: "ሌላ ትዕዛዝ ያስገቡ", selectBank: "ባንክ ይምረጡ...", birr: "ብር" },
    or: { title: "HOPII KEERII OBSINAN", subtitle: "Bifa Haarawaan", fullName: "Maqaa Guutuu", phone: "Lakkoofsa Bilbilaa", cakeText: "Barreeffama Keekii", deliveryDate: "Guyyaa Itti Fuudhan", deliveryTime: "Sa'aatii Itti Fuudhan (Sa'a 5:00 booda)", selectPrice: "Gatii Keekii Filadhu", paymentMethod: "Mala Kafaltii", uploadReceipt: "Waraqaa Kafaltii (Suuraa ykn PDF)", completeBtn: "AJAAJA XUMURI", downPayment: "Kafaltii Duraa", orderPlaced: "AJAAJNI KEESSAN GALMAA'ERA!", thankYou: "Keekii Obsinan waan filattaniif galatoomaa.", refText: "Lakkoofsi Eenyummaa keessan:", anotherOrder: "Ajaaja biraa galchi", selectBank: "Baankii filadhu...", birr: "Birrii" }
  };

  const t = translations[lang as keyof typeof translations];

  useEffect(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1); 
    setMinDate(today.toISOString().split('T')[0]);

    async function fetchCakes() {
      try {
        const response = await fetch("http://localhost:8000/cake-types");
        if (response.ok) {
          const data = await response.json();
          setDbCakes(data);
        }
      } catch (err) {
        console.error("Failed to load cakes from database");
      }
    }
    fetchCakes();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFile(file); // Save actual file for Cloudinary
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptData(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // --- 3. HANDLERS (Sending data to Backend) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiptFile) return alert("Please upload a receipt");

    try {
      // 1. UPLOAD TO CLOUDINARY FIRST
      const formData = new FormData();
      formData.append("file", receiptFile);
      formData.append("upload_preset", "obsinan_preset"); 

      // Replace 'YOUR_CLOUD_NAME' with your actual Cloudinary name
      const cloudRes = await fetch("https://api.cloudinary.com/v1_1/dvfyk53f9/auto/upload", {
        method: "POST",
        body: formData
      });
      const cloudData = await cloudRes.json();
      const uploadedUrl = cloudData.secure_url;

      // 2. SEND ORDER TO BACKEND
      const generatedRef = "OBS-" + Math.floor(100000 + Math.random() * 900000);

      const orderData = {
        full_name: fullName,
        phone: phone,
        cake_text: cakeText,
        delivery_date: deliveryDate,
        delivery_time: deliveryTime,
        cake_type: price, 
        price: parseInt(price),
        pay_method: payMethod,
        ref_number: generatedRef,
        receipt_data: uploadedUrl, // Send the URL instead of the huge base64 string
        status: "Pending"
      };

      const response = await fetch("http://localhost:8000/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        setRefNumber(generatedRef); 
      } else {
        alert("Server error. Please check if backend is running.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Could not connect to the server.");
    }
  };

  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-10 font-sans">
      
      <div className="flex justify-end gap-2 mb-6">
        <button onClick={() => setLang('en')} className={`px-3 py-1 rounded ${lang === 'en' ? 'bg-cyan-500 text-black' : 'bg-gray-800'}`}>EN</button>
        <button onClick={() => setLang('am')} className={`px-3 py-1 rounded ${lang === 'am' ? 'bg-cyan-500 text-black' : 'bg-gray-800'}`}>አማ</button>
        <button onClick={() => setLang('or')} className={`px-3 py-1 rounded ${lang === 'or' ? 'bg-cyan-500 text-black' : 'bg-gray-800'}`}>ORM</button>
      </div>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-black text-center mb-4 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
          {t.title}
        </h1>
        <p className="text-center text-gray-400 mb-10 uppercase tracking-widest">{t.subtitle}</p>

        {!refNumber ? (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-900/50 p-6 md:p-10 rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl">
            
            <div className="flex flex-col">
              <label className="text-cyan-400 text-sm mb-2 ml-1">{t.fullName}</label>
              <input 
                required type="text" placeholder="..." 
                value={fullName} onChange={(e) => setFullName(e.target.value)}
                className="p-3 bg-black/50 border border-gray-700 rounded-xl focus:border-cyan-500 outline-none transition-all" 
              />
            </div>

            <div className="flex flex-col">
              <label className="text-cyan-400 text-sm mb-2 ml-1">{t.phone}</label>
              <input 
                required type="tel" placeholder="09..." 
                value={phone} onChange={(e) => setPhone(e.target.value)}
                className="p-3 bg-black/50 border border-gray-700 rounded-xl focus:border-cyan-500 outline-none transition-all" 
              />
            </div>

            <div className="md:col-span-2 flex flex-col">
              <label className="text-cyan-400 text-sm mb-2 ml-1">{t.cakeText}</label>
              <input 
                required type="text" placeholder="..." 
                value={cakeText} onChange={(e) => setCakeText(e.target.value)}
                className="p-3 bg-black/50 border border-gray-700 rounded-xl focus:border-cyan-500 outline-none transition-all" 
              />
            </div>

            <div className="flex flex-col">
              <label className="text-cyan-400 text-sm mb-2 ml-1">{t.deliveryDate}</label>
              <input 
                required type="date" min={minDate} 
                value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)}
                className="p-3 bg-black/50 border border-gray-700 rounded-xl focus:border-cyan-500 outline-none transition-all text-white" 
              />
            </div>

            <div className="flex flex-col">
              <label className="text-cyan-400 text-sm mb-2 ml-1">{t.deliveryTime}</label>
              <input 
                required type="time" min="11:00" 
                value={deliveryTime} onChange={(e) => setDeliveryTime(e.target.value)}
                className="p-3 bg-black/50 border border-gray-700 rounded-xl focus:border-cyan-500 outline-none transition-all text-white" 
              />
            </div>

            <div className="md:col-span-2 flex flex-col">
              <label className="text-cyan-400 text-sm mb-2 ml-1">{t.selectPrice}</label>
              <select 
                required 
                value={selectedCakeId}
                onChange={(e) => {
                  const cake = dbCakes.find(c => c._id === e.target.value);
                  setSelectedCakeId(e.target.value);
                  setPrice(cake ? cake.price.toString() : "");
                }}
                className="p-3 bg-black border border-gray-700 rounded-xl focus:border-cyan-500 outline-none"
              >
                <option value="">{t.selectPrice}</option>
                {dbCakes.map((cake) => (
                  <option key={cake._id} value={cake._id}>
                    {cake.name} - {cake.price} {t.birr}
                  </option>
                ))}
              </select>
            </div>

            {price && (
              <div className="md:col-span-2 bg-cyan-900/20 border border-cyan-500/50 p-4 rounded-2xl flex flex-col items-center">
                <img 
                  src={dbCakes.find(c => c._id === selectedCakeId)?.image_data || cakeDetails[price]?.img || "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500"} 
                  alt="Preview" 
                  className="w-48 h-48 object-cover rounded-full border-4 border-cyan-500 mb-4 shadow-[0_0_20px_rgba(6,182,212,0.5)]" 
                />
                <p className="text-xl font-bold text-cyan-300 italic">{t.downPayment}: {Number(price) / 2} {t.birr} (50%)</p>
              </div>
            )}

            <div className="md:col-span-2 flex flex-col">
              <label className="text-cyan-400 text-sm mb-2 ml-1">{t.paymentMethod}</label>
              <select 
                required 
                value={payMethod}
                onChange={(e) => setPayMethod(e.target.value)}
                className="p-3 bg-black border border-gray-700 rounded-xl outline-none"
              >
                <option value="">{t.selectBank}</option>
                <option value="telebirr">Telebirr</option>
                <option value="cbe">CBE</option>
                <option value="dashen">Dashen</option>
                <option value="awash">Awash</option>
              </select>
              {payMethod && (
                <p className="mt-2 text-yellow-400 font-mono text-sm bg-yellow-400/10 p-2 rounded border border-yellow-400/30">
                  {bankAccounts[payMethod]}
                </p>
              )}
            </div>

            <div className="md:col-span-2 flex flex-col">
              <label className="text-cyan-400 text-sm mb-2 ml-1">{t.uploadReceipt}</label>
              <input 
                required 
                type="file" 
                accept="image/*,.pdf" 
                onChange={handleFileChange}
                className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-cyan-600 file:text-white hover:file:bg-cyan-500 cursor-pointer" 
              />
            </div>

            <button type="submit" className="md:col-span-2 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-400 hover:to-blue-400 text-white font-black rounded-xl shadow-lg shadow-cyan-500/20 transform transition-active active:scale-95 uppercase tracking-widest">
              {t.completeBtn}
            </button>

          </form>
        ) : (
          <div className="bg-gray-900 border-2 border-cyan-500 p-10 rounded-3xl text-center">
            <h2 className="text-3xl font-bold text-cyan-400 mb-4">{t.orderPlaced}</h2>
            <p className="text-gray-400 mb-2">{t.thankYou}</p>
            <p className="text-sm text-gray-500 mb-6">{t.refText}</p>
            <div className="text-5xl font-mono font-black tracking-widest text-white bg-black p-6 rounded-xl border border-cyan-500 mb-8">
              {refNumber}
            </div>
            <button 
              onClick={() => {
                setRefNumber(null);
                setFullName("");
                setPhone("");
                setCakeText("");
                setSelectedCakeId("");
                setPrice("");
                setReceiptData("");
                setReceiptFile(null);
              }}
              className="text-cyan-400 underline decoration-cyan-500 underline-offset-4"
            >
              {t.anotherOrder}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}