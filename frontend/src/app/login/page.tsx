"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiUrl } from "@/lib/api";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const url = isRegistering ? apiUrl("/api/register/") : apiUrl("/api/login/");
    
    try {
      if (isRegistering) {
        await axios.post(url, { username, password });
        alert("Registration successful! Please login.");
        setIsRegistering(false);
      } else {
        const response = await axios.post(url, { username, password });
        localStorage.setItem("access_token", response.data.access);
        router.push("/men"); // Better redirect than just dashboard
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Authentication failed. Please check your credentials.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50/50 px-4 font-sans text-[#001b3a]">
       <Link href="/" className="absolute top-12 left-12 text-[10px] font-bold tracking-[0.2em] uppercase border-b border-black pb-1 hover:text-gray-500 transition-all">← Back to World of RL</Link>
      
      <div className="w-full max-w-[450px] bg-white p-12 shadow-2xl border border-gray-100 relative pt-20">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-[#001b3a]"></div>
        <h2 className="mb-10 text-center text-4xl tracking-tighter text-[#001b3a] font-serif uppercase">
          {isRegistering ? "Create Account" : "Sign In"}
        </h2>
        
        {error && (
          <div className="mb-8 p-4 text-[11px] font-bold tracking-widest text-red-600 border border-red-100 bg-red-50/60 uppercase text-center animate-in fade-in duration-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="mb-2 block text-[9.5px] font-bold tracking-[0.25em] text-gray-500 uppercase">
              Member ID / Username
            </label>
            <input
              type="text"
              className="w-full border-b border-gray-200 py-3 outline-none focus:border-[#001c40] text-sm tracking-widest transition-all"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-[9.5px] font-bold tracking-[0.25em] text-gray-500 uppercase">
              Access Code / Password
            </label>
            <input
              type="password"
              className="w-full border-b border-gray-200 py-3 outline-none focus:border-[#001c40] text-sm tracking-widest transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-[#001c40] py-4.5 text-[11px] font-bold tracking-[0.3em] text-white uppercase transition-all hover:bg-opacity-90 shadow-xl active:scale-[0.98] mt-10"
          >
            {isRegistering ? "Establish Identity" : "Authorize Access"}
          </button>
        </form>

        <div className="mt-12 text-center border-t border-gray-50 pt-10">
           <p className="text-[10px] tracking-widest font-bold text-gray-400 uppercase mb-4">{isRegistering ? "Already a Member?" : "New to Ralph Lauren?"}</p>
           <button 
             onClick={() => setIsRegistering(!isRegistering)}
             className="text-[11px] font-bold tracking-widest text-[#001b3a] underline underline-offset-4 hover:text-gray-500 transition-all uppercase"
           >
             {isRegistering ? "Sign In Now" : "Create An Account"}
           </button>
        </div>
      </div>
    </div>
  );
}
