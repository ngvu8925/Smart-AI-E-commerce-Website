"use client";

import Link from "next/link";
import { useState, useEffect, use } from "react";
import { useCart } from "../context/CartContext";

export default function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = use(params);
  const formattedCategory = category.toLowerCase();

  const [isHeaderHovered, setIsHeaderHovered] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { addToCart, cartItems, removeFromCart, total } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/products/?category=${formattedCategory}`);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Fetch products error", err);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, [formattedCategory]);

  const handleCheckout = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      alert("Please login to proceed to checkout!");
      window.location.href = "/login";
      return;
    }
    
    try {
      const res = await fetch("http://localhost:8000/api/order/checkout/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      if (res.ok) {
        alert("Order placed successfully!");
        window.location.reload();
      } else {
        alert("Error during checkout");
      }
    } catch (err) {
      console.error("Checkout error", err);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-[#001b3a]">
      {/* CART SIDEBAR OVERLAY */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col p-8 animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center mb-10 border-b pb-4">
              <h2 className="font-serif text-2xl uppercase tracking-widest">Shopping Bag</h2>
              <button onClick={() => setIsCartOpen(false)} className="text-2xl hover:text-red-500 transition-colors">✕</button>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-8 pr-4">
              {cartItems.length === 0 ? (
                <div className="text-center py-20 text-gray-400 font-serif italic text-lg">Your bag is currently empty.</div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <img src={item.product.image} className="w-24 h-32 object-cover rounded shadow-sm" alt="" />
                    <div className="flex-1 flex flex-col pt-1">
                      <p className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">{item.product.brand}</p>
                      <h3 className="text-sm font-medium mb-1">{item.product.name}</h3>
                      <p className="text-xs text-gray-400 mb-2">Quantity: {item.quantity}</p>
                      <div className="flex justify-between items-end mt-auto">
                        <span className="font-mono text-sm">${item.product.price}</span>
                        <button onClick={() => removeFromCart(item.id)} className="text-[10px] font-bold text-red-700 underline underline-offset-4 hover:text-red-500">Remove</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-auto pt-8 border-t space-y-6">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Estimated Total</span>
                <span className="text-2xl font-serif">${total.toFixed(2)}</span>
              </div>
              <button 
                onClick={handleCheckout}
                disabled={cartItems.length === 0}
                className="w-full bg-[#001b3a] text-white py-4 font-bold tracking-[0.2em] uppercase rounded-full hover:bg-opacity-90 transition-all shadow-lg active:scale-95 disabled:bg-gray-200 disabled:text-gray-400"
              >
                Checkout Now
              </button>
              <div className="text-center">
                <Link href="/login" className="text-[10px] font-bold text-[#001b3a] underline underline-offset-4 hover:text-gray-600 transition-all">Sign in for a faster experience</Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ANNOUNCEMENT BANNER */}
      <div className="w-full bg-[#001b3a] text-white py-2 px-4 text-[10px] tracking-[0.1em] uppercase text-center relative z-[60]">
        <div className="flex items-center justify-center space-x-1">
          <span>Free Shipping & Returns With an RL Account:</span>
          <Link href="/login" className="underline font-bold hover:text-gray-300">Sign In or Create Now</Link>
        </div>
        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:flex space-x-6">
           <span className="flex items-center cursor-pointer hover:underline text-[9px] tracking-widest font-bold uppercase"><span className="mr-1">💬</span> Chat Now</span>
        </div>
      </div>

      {/* HEADER */}
      <header 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out border-b ${
          isHeaderHovered || isScrolled ? 'bg-white border-gray-100 shadow-sm' : 'bg-transparent border-transparent'
        }`}
        style={{ marginTop: '32px' }}
        onMouseEnter={() => setIsHeaderHovered(true)}
        onMouseLeave={() => setIsHeaderHovered(false)}
      >
        <div className="max-w-[1800px] mx-auto px-8 py-6 flex flex-col items-center relative">
          <Link href="/" className="mb-6">
             <h1 className={`text-4xl font-serif tracking-[0.4em] transition-colors duration-500 ${
               isHeaderHovered || isScrolled ? 'text-[#001b3a]' : 'text-white'
             }`}>
               RALPH LAUREN
             </h1>
          </Link>

          <nav className="flex space-x-10 items-center">
            {["MEN", "WOMEN", "KIDS & BABY", "HOME", "GIFTS", "DISCOVER", "SALE"].map((item) => (
              <Link
                key={item}
                href={`/${item.split(' ')[0].toLowerCase()}`}
                className={`text-[11px] font-bold tracking-[0.2em] transition-colors duration-500 relative group ${
                  isHeaderHovered || isScrolled ? 'text-[#001b3a]' : 'text-white'
                } ${item === formattedCategory.toUpperCase() ? 'border-b-2 border-current pb-1' : ''}`}
              >
                {item}
                <span className="absolute bottom-[-8px] left-0 w-0 h-[2px] bg-[#001b3a] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          <div className={`absolute right-8 top-1/2 -translate-y-1/2 flex items-center space-x-6 transition-colors duration-500 ${
             isHeaderHovered || isScrolled ? 'text-[#001b3a]' : 'text-white'
          }`}>
             <svg className="w-5 h-5 cursor-pointer hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
             <Link href="/login"><svg className="w-5 h-5 cursor-pointer hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg></Link>
             <div onClick={() => setIsCartOpen(true)} className="relative cursor-pointer group">
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                {cartItems.length > 0 && <span className="absolute -top-2 -right-3 bg-red-600 text-white text-[9px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">{cartItems.reduce((acc, i) => acc + i.quantity, 0)}</span>}
             </div>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative h-[90vh] w-full mt-[32px]">
        <img 
          src="https://images.unsplash.com/photo-1549439602-43ebca2327af?q=80&w=2070&auto=format&fit=crop" 
          alt="Campaign Hero" 
          className="w-full h-full object-cover object-[center_top]"
        />
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-32 text-white text-center">
          <h2 className="text-[12px] md:text-sm tracking-[0.4em] font-bold uppercase mb-4 text-shadow">A New Modernity</h2>
          <h1 className="text-6xl md:text-8xl font-serif mb-10 text-shadow drop-shadow-2xl">The Spring Collection</h1>
          <div className="flex space-x-6">
             <button className="bg-white text-[#001b3a] px-14 py-4 text-[11px] font-bold tracking-[0.2em] uppercase rounded-full hover:bg-gray-100 transition-all shadow-2xl active:scale-95">
               SHOP NOW
             </button>
          </div>
        </div>
      </section>

      <main className="w-full max-w-[1700px] mx-auto pt-24 px-8 pb-32">
        {/* PRODUCT GRID */}
        <section className="mb-32">
          <div className="flex justify-between items-end mb-12 border-b border-gray-100 pb-6">
            <h2 className="font-serif text-4xl text-[#001b3a] tracking-tight">{formattedCategory.charAt(0).toUpperCase() + formattedCategory.slice(1)}'s Collection</h2>
            <div className="text-[10px] font-bold tracking-[0.2em] text-[#001b3a] cursor-pointer hover:underline uppercase transition-all">Showing {products.length} Results</div>
          </div>

          {loadingProducts ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="aspect-[3/4] bg-gray-50 animate-pulse rounded-sm"></div>)}
            </div>
          ) : products.length === 0 ? (
            <div className="py-20 text-center text-gray-400 font-serif text-2xl italic">No products found in this category.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 row-gap-24">
              {products.map((product) => (
                <div key={product.id} className="group flex flex-col cursor-pointer relative pb-10">
                  <div className="relative aspect-[3/4] bg-[#fdfdfd] overflow-hidden mb-5 flex items-center justify-center">
                    <img 
                      src={product.image} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                      alt={product.name} 
                    />
                    <div 
                       onClick={() => addToCart(product.id)}
                       className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-white/95 backdrop-blur-sm py-4.5 text-center shadow-2xl z-20"
                    >
                      <span className="text-[10px] font-bold tracking-[0.3em] text-[#001b3a] uppercase">Add to Bag</span>
                    </div>
                    {product.stock <= 3 && product.stock > 0 && (
                      <div className="absolute top-4 left-4 bg-red-600 text-white text-[9px] font-bold px-2 py-1 uppercase tracking-widest">Low Stock</div>
                    )}
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-white/60 flex items-center justify-center backdrop-blur-[1px]">
                         <span className="text-[10px] font-bold tracking-[0.2em] text-gray-600 uppercase border-2 border-gray-600 px-4 py-2">Sold Out</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col px-1">
                    <span className="text-[9.5px] font-bold tracking-[0.2em] text-gray-400 uppercase mb-1.5">{product.brand}</span>
                    <h3 className="text-[13.5px] text-[#001b3a] mb-2 font-medium leading-relaxed">{product.name}</h3>
                    <div className="flex items-center space-x-3 text-[13.5px] font-medium">
                      {product.sale_price ? (
                        <>
                          <span className="text-red-700">${product.sale_price}</span>
                          <span className="text-gray-400 line-through text-[11px]">${product.price}</span>
                        </>
                      ) : (
                        <span className="text-[#001b3a]">${product.price}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-white pt-24 pb-16 px-10 border-t border-gray-100">
         <div className="mt-28 text-center flex flex-col items-center">
            <h2 className="font-serif text-4xl tracking-[0.4em] mb-10 text-[#001b3a]">RALPH LAUREN</h2>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-[10.5px] text-gray-500 uppercase tracking-[0.15em] mb-10 font-bold">
               <span className="hover:text-black cursor-pointer transition-colors">Privacy Notice</span>
               <span className="hover:text-black cursor-pointer transition-colors">Terms of Use</span>
               <span className="hover:text-black cursor-pointer transition-colors">UK Tax Strategy</span>
               <span className="hover:text-black cursor-pointer transition-colors">Cookies</span>
            </div>
            <p className="text-[9.5px] text-gray-400 tracking-widest uppercase">© 2026 Ralph Lauren Media LLC. All rights reserved.</p>
         </div>
      </footer>
    </div>
  );
}
