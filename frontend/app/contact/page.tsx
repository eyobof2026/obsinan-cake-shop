"use client";
import { useState } from "react";

export default function ContactPage() {
  const [lang, setLang] = useState('en');
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const t: any = {
    en: { title: "Contact Us", name: "Name", phone: "Phone", msg: "Message", btn: "Send Message", success: "Message Sent!", call: "Call Us", social: "Telegram" },
    am: { title: "አግኙን", name: "ስም", phone: "ስልክ", msg: "መልዕክት", btn: "ላክ", success: "መልዕክቱ ተልኳል!", call: "ይደውሉልን", social: "ቴሌግራም" },
    or: { title: "Nu Quunnamaa", name: "Maqaa", phone: "Bilbila", msg: "Ergaa", btn: "Ergi", success: "Ergaan Ergameera!", call: "Nu Bilbilaa", social: "Telegraamii" }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8000/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, message })
      });
      if (res.ok) {
        setSent(true);
        setName(""); setPhone(""); setMessage("");
      }
    } catch (err) { alert("Error sending message"); }
  };

  return (
    <main className="p-8 max-w-6xl mx-auto bg-black min-h-screen text-white">
      {/* Language Switcher */}
      <div className="flex justify-end gap-2 mb-10">
        {['en', 'am', 'or'].map(l => (
          <button key={l} onClick={() => setLang(l)} className={`px-3 py-1 rounded uppercase text-xs ${lang === l ? 'bg-cyan-500 text-black' : 'bg-gray-800'}`}>{l}</button>
        ))}
      </div>

      <h1 className="text-5xl font-black text-cyan-400 mb-12 text-center tracking-tighter italic uppercase underline decoration-cyan-900 underline-offset-8">
        {t[lang].title}
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="bg-gray-900/40 p-10 rounded-[2.5rem] border border-white/5 backdrop-blur-xl shadow-2xl">
          {sent ? (
            <div className="text-center py-20 text-green-400 font-bold animate-bounce">✓ {t[lang].success}</div>
          ) : (
            <form onSubmit={handleSendMessage} className="space-y-6">
              <input required placeholder={t[lang].name} value={name} onChange={(e) => setName(e.target.value)} className="w-full p-4 bg-black border border-gray-800 rounded-2xl outline-none focus:border-cyan-500" />
              <input required placeholder={t[lang].phone} value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-4 bg-black border border-gray-800 rounded-2xl outline-none focus:border-cyan-500" />
              <textarea required placeholder={t[lang].msg} rows={5} value={message} onChange={(e) => setMessage(e.target.value)} className="w-full p-4 bg-black border border-gray-800 rounded-2xl outline-none focus:border-cyan-500" />
              <button className="w-full py-4 bg-cyan-600 hover:bg-cyan-400 text-white font-black rounded-2xl transition-all shadow-lg shadow-cyan-500/20 uppercase tracking-widest">{t[lang].btn}</button>
            </form>
          )}
        </div>

        {/* Info Side */}
        <div className="space-y-8">
          <div className="bg-cyan-900/10 p-8 rounded-[2rem] border border-cyan-500/20">
            <h2 className="text-xl font-bold mb-4 text-cyan-400">{t[lang].call}</h2>
            <ul className="space-y-4 text-lg font-mono">
              <li className="flex items-center gap-3"><span>📞</span> +251 911 22 33 44</li>
              <li className="flex items-center gap-3"><span>📞</span> +251 922 33 44 55</li>
              <li className="flex items-center gap-3"><span>📞</span> +251 900 11 22 33</li>
            </ul>
          </div>

          <div className="bg-blue-900/10 p-8 rounded-[2rem] border border-blue-500/20">
            <h2 className="text-xl font-bold mb-4 text-blue-400">{t[lang].social}</h2>
            <a href="https://t.me/your_telegram" className="inline-block px-6 py-3 bg-blue-600 rounded-full font-bold hover:bg-blue-400 transition-all">@ObsinanCakes</a>
          </div>
        </div>
      </div>
    </main>
  );
}