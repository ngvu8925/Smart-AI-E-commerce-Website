"use client";

import { useState, useRef, useEffect } from "react";

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Good day. I am your Ralph Lauren personal shopper. How may I assist you with our collection today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/ai/ask/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: input,
          history: messages.slice(-5) // Send last few messages for context
        })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", content: "I apologize, my connection to the atelier is momentarily interrupted." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 z-[90] bg-[#001b3a] text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all border-2 border-white/20"
      >
        {isOpen ? (
          <span className="text-xl">✕</span>
        ) : (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-28 right-8 z-[90] w-[400px] h-[550px] bg-white shadow-2xl rounded-sm border border-gray-100 flex flex-col animate-in fade-in slide-in-from-bottom-10 duration-300">
          {/* Header */}
          <div className="bg-[#001b3a] p-6 text-white">
            <h3 className="font-serif text-xl tracking-widest uppercase">Fashion Assistant</h3>
            <p className="text-[9px] tracking-[0.2em] font-bold text-gray-400 mt-1">Ralph Lauren Digital Concierge</p>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] p-4 rounded-sm text-[13px] leading-relaxed shadow-sm ${
                  msg.role === "user" 
                    ? "bg-[#001b3a] text-white" 
                    : "bg-white text-gray-800 border border-gray-100 font-serif italic"
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-4 rounded-sm border border-gray-100 shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSend} className="p-4 border-t border-gray-100 bg-white">
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Ask about size, style, or specific items..."
                className="flex-1 text-[13px] border border-gray-200 p-3 rounded-none outline-none focus:border-[#001b3a] transition-all"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button 
                type="submit" 
                className="bg-[#001b3a] text-white px-6 py-3 text-[10px] font-bold tracking-widest uppercase hover:bg-opacity-90 active:scale-95 transition-all"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
