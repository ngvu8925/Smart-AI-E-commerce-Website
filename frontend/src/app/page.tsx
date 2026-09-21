"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHeaderHovered, setIsHeaderHovered] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const slides = [
    {
      url: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1887&auto=format&fit=crop",
      title: "SPRING / SUMMER 2026",
      subtitle: "A NEW ERA OF ELEGANCE"
    },
    {
      url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop",
      title: "THE WORLD OF POLO",
      subtitle: "TIMELESS HERITAGE"
    },
    {
      url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop",
      title: "LUXURY REDEFINED",
      subtitle: "PURPLE LABEL COLLECTION"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    
    return () => {
      clearInterval(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [slides.length]);

  return (
    <div className="min-h-screen bg-white font-sans text-[#001b3a]">
      {/* 1. TOP ANNOUNCEMENT BANNER */}
      <div className="w-full bg-[#001b3a] text-white py-2 px-4 text-[10px] tracking-[0.1em] uppercase text-center relative z-[60]">
        <div className="flex items-center justify-center space-x-1">
          <span>Free Shipping & Returns With an RL Account:</span>
          <Link href="/login" className="underline font-bold hover:text-gray-300">Sign In or Create Now</Link>
          <span className="ml-2 cursor-pointer underline">Details</span>
        </div>
        {/* Utility Links in banner (Visual only) */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:flex space-x-6">
           <span className="flex items-center cursor-pointer hover:underline"><span className="mr-1">🌐</span> US English</span>
           <span className="flex items-center cursor-pointer hover:underline"><span className="mr-1">📍</span> Find a store</span>
        </div>
      </div>

      {/* 2. MAIN HEADER (REPLICATED FROM REAL SITE) */}
      <header 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out border-b ${
          isHeaderHovered || isScrolled ? 'bg-white border-gray-100' : 'bg-transparent border-transparent'
        }`}
        style={{ marginTop: '32px' }} // Account for the top banner
        onMouseEnter={() => setIsHeaderHovered(true)}
        onMouseLeave={() => setIsHeaderHovered(false)}
      >
        <div className="max-w-[1800px] mx-auto px-8 py-6 flex flex-col items-center relative">
          
          {/* LOGO - CENTERED */}
          <Link href="/" className="mb-6">
             <h1 className={`text-4xl font-serif tracking-[0.4em] transition-colors duration-500 ${
               isHeaderHovered || isScrolled ? 'text-[#001b3a]' : 'text-white'
             }`}>
               RALPH LAUREN
             </h1>
          </Link>

          {/* NAVIGATION LINKS */}
          <nav className="flex space-x-10 items-center">
            {["MEN", "WOMEN", "KIDS & BABY", "HOME", "GIFTS", "DISCOVER", "SALE"].map((item) => (
              <Link
                key={item}
                href={`/${item.split(' ')[0].toLowerCase()}`}
                className={`text-[11px] font-bold tracking-[0.2em] transition-colors duration-500 relative group ${
                  isHeaderHovered || isScrolled ? 'text-[#001b3a]' : 'text-white'
                }`}
              >
                {item}
                <span className="absolute bottom-[-8px] left-0 w-0 h-[2px] bg-[#001b3a] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* UTILITY ICONS (Right side) */}
          <div className={`absolute right-8 top-1/2 -translate-y-1/2 flex items-center space-x-6 transition-colors duration-500 ${
             isHeaderHovered || isScrolled ? 'text-[#001b3a]' : 'text-white'
          }`}>
             <svg className="w-5 h-5 cursor-pointer hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
             <Link href="/login"><svg className="w-5 h-5 cursor-pointer hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg></Link>
             <svg className="w-5 h-5 cursor-pointer hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
             <svg className="w-5 h-5 cursor-pointer hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
          </div>
        </div>
      </header>

      {/* 3. HERO SLIDESHOW SECTION */}
      <section className="relative h-screen w-full overflow-hidden bg-black">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100 scale-105" : "opacity-0 scale-100"
            }`}
          >
            <div className="absolute inset-0 bg-black/30 z-10"></div>
            <img
              src={slide.url}
              alt={slide.title}
              className="h-full w-full object-cover transition-transform duration-[10000ms] linear scale-110"
            />
            {/* HERO CONTENT */}
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white text-center px-4">
              <h2 className="text-[10px] md:text-sm tracking-[0.4em] font-bold uppercase mb-6 animate-fade-in-up">
                {slide.subtitle}
              </h2>
              <h1 className="text-6xl md:text-[8rem] font-serif tracking-widest leading-none mb-12 animate-fade-in">
                RALPH LAUREN
              </h1>
              <button className="border border-white bg-white/10 backdrop-blur-sm px-12 py-3 text-[11px] font-bold tracking-[0.2em] uppercase rounded-full hover:bg-white hover:text-[#001b3a] transition-all duration-300 active:scale-95 shadow-lg">
                EXPLORE NOW
              </button>
            </div>
          </div>
        ))}

        {/* Slide Indicators */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex space-x-3">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-[1px] w-12 transition-all duration-500 ${i === currentSlide ? 'bg-white' : 'bg-white/30'}`}
            ></div>
          ))}
        </div>
      </section>

      {/* 4. FLUSH GRID SECTIONS (REPLICATING SPLIT LAYOUTS) */}
      <section className="flex flex-col md:flex-row w-full h-[800px]">
         {/* Left half */}
         <div className="w-full md:w-1/2 relative group overflow-hidden cursor-pointer border-r border-white/10">
            <img src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1760&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-end pb-20 text-white">
               <h3 className="font-serif text-4xl mb-6">The World of Polo</h3>
               <button className="border-b border-white pb-1 text-[10px] font-bold tracking-widest hover:text-gray-300 transition-colors">SHOP NOW</button>
            </div>
         </div>
         {/* Right half */}
         <div className="w-full md:w-1/2 relative group overflow-hidden cursor-pointer">
            <img src="https://images.unsplash.com/photo-1594938298596-eb5fd3822758?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-end pb-20 text-white">
               <h3 className="font-serif text-4xl mb-6">Spring 2026 Collection</h3>
               <button className="border-b border-white pb-1 text-[10px] font-bold tracking-widest hover:text-gray-300 transition-colors">SHOP THE COLLECTION</button>
            </div>
         </div>
      </section>

      {/* 5. FULL WIDTH FEATURE */}
      <section className="relative w-full h-[600px] group overflow-hidden cursor-pointer">
         <img src="https://images.unsplash.com/photo-1588056269986-90f707f1ae99?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover brightness-75 transition-transform duration-1000 group-hover:scale-105" />
         <div className="absolute inset-x-0 bottom-24 flex flex-col items-center text-white">
            <p className="text-[10px] tracking-[0.3em] font-bold uppercase mb-4">HERITAGE ICONS</p>
            <h2 className="font-serif text-6xl mb-8">The Oxford Shirt</h2>
            <button className="bg-white text-[#001b3a] px-10 py-3 text-[10px] font-bold tracking-widest rounded-full hover:bg-gray-100 transition-all active:scale-95">EXPLORE THE STORY</button>
         </div>
      </section>

      {/* 6. FOOTER (MINIMALIST RL STYLE) */}
      <footer className="bg-white pt-32 pb-16 px-8 border-t border-gray-100">
         <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-[#001b3a]">
            {/* Column 1 */}
            <div className="flex flex-col space-y-4">
               <h4 className="text-[11px] font-bold tracking-widest uppercase">Company</h4>
               <ul className="space-y-3 text-xs opacity-70">
                  <li className="hover:underline cursor-pointer">About Ralph Lauren</li>
                  <li className="hover:underline cursor-pointer">Sustainability</li>
                  <li className="hover:underline cursor-pointer">Investor Relations</li>
                  <li className="hover:underline cursor-pointer">Careers</li>
               </ul>
            </div>
            {/* Column 2 */}
            <div className="flex flex-col space-y-4">
               <h4 className="text-[11px] font-bold tracking-widest uppercase">Customer Service</h4>
               <ul className="space-y-3 text-xs opacity-70">
                  <li className="hover:underline cursor-pointer">Shipping & Returns</li>
                  <li className="hover:underline cursor-pointer">Size Guides</li>
                  <li className="hover:underline cursor-pointer">Contact Us</li>
                  <li className="hover:underline cursor-pointer">Sitemap</li>
               </ul>
            </div>
            {/* Column 3 */}
            <div className="flex flex-col space-y-4">
               <h4 className="text-[11px] font-bold tracking-widest uppercase">Connect</h4>
               <ul className="space-y-3 text-xs opacity-70">
                  <li className="hover:underline cursor-pointer">Instagram</li>
                  <li className="hover:underline cursor-pointer">X (Twitter)</li>
                  <li className="hover:underline cursor-pointer">Facebook</li>
                  <li className="hover:underline cursor-pointer">Pinterest</li>
               </ul>
            </div>
            {/* Column 4 - Newsletter */}
            <div className="flex flex-col space-y-6">
               <h4 className="text-[11px] font-bold tracking-widest uppercase">Sign up for emails</h4>
               <div className="border-b border-[#001b3a] pb-2 flex justify-between items-center">
                  <input type="email" placeholder="Email Address" className="bg-transparent text-sm focus:outline-none w-full" />
                  <button className="text-[10px] font-bold tracking-widest uppercase">Submit</button>
               </div>
            </div>
         </div>
         
         <div className="mt-24 text-center">
            <h2 className="font-serif text-3xl tracking-[0.2em] mb-8">RALPH LAUREN</h2>
            <p className="text-[10px] text-gray-400">© 2026 RALPH LAUREN MEDIA LLC. ALL RIGHTS RESERVED.</p>
         </div>
      </footer>
    </div>
  );
}
