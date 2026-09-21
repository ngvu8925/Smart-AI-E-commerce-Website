"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Product {
  id?: number;
  name: string;
  brand: string;
  price: string;
  sale_price?: string;
  image: string;
  category: string;
  stock: number;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  
  const [formData, setFormData] = useState<Product>({
    name: "",
    brand: "Polo Ralph Lauren",
    price: "",
    sale_price: "",
    image: "",
    category: "men",
    stock: 10
  });

  const BASE_URL = "http://localhost:8000/api/products/";

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(BASE_URL);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (p: Product) => {
    setEditingProduct(p);
    setFormData(p);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product? This will immediately remove it from the store.")) return;
    try {
      const res = await fetch(`${BASE_URL}${id}/delete/`, { method: "DELETE" });
      if (res.ok) fetchProducts();
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingProduct ? `${BASE_URL}${editingProduct.id}/update/` : `${BASE_URL}create/`;
    const method = editingProduct ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setShowModal(false);
        setEditingProduct(null);
        setFormData({ name: "", brand: "Polo Ralph Lauren", price: "", sale_price: "", image: "", category: "men", stock: 10 });
        fetchProducts();
      }
    } catch (err) {
      console.error("Save error", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] p-10 font-sans text-[#001b3a]">
      <div className="max-w-[1400px] mx-auto bg-white border border-gray-100 shadow-2xl p-12 rounded-sm">
        <div className="flex justify-between items-end mb-16 border-b border-gray-100 pb-10">
          <div>
            <h1 className="text-4xl font-serif tracking-tight mb-2">Inventory Management</h1>
            <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-400">Manage Your Digital Storefront</p>
          </div>
          <div className="flex gap-4">
             <Link href="/" className="text-[10px] font-bold tracking-[0.2em] uppercase border border-gray-200 px-8 py-3.5 hover:bg-gray-50 transition-all rounded-full">View Store</Link>
             <button 
                onClick={() => { setEditingProduct(null); setFormData({ name: "", brand: "Polo Ralph Lauren", price: "", sale_price: "", image: "", category: "men", stock: 10 }); setShowModal(true); }}
                className="bg-[#001b3a] text-white px-10 py-3.5 rounded-full text-[10px] font-bold tracking-[0.2em] hover:bg-opacity-90 transition-all shadow-xl active:scale-95"
              >
                CREATE NEW PRODUCT
              </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center p-32"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#001b3a]"></div></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-[9px] uppercase tracking-[0.2em] text-gray-400 border-b border-gray-100 font-bold">
                <tr>
                  <th className="pb-6 px-4">Preview</th>
                  <th className="pb-6">Identifiers</th>
                  <th className="pb-6">Category</th>
                  <th className="pb-6">Stock</th>
                  <th className="pb-6">Retail</th>
                  <th className="pb-6 text-right pr-4">Management</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="py-6 px-4"><img src={p.image} className="w-20 h-24 object-cover shadow-md grayscale-[20%] group-hover:grayscale-0 transition-all" alt="" /></td>
                    <td className="py-6">
                      <div className="text-[10px] font-bold tracking-widest text-[#001b3a] mb-1">{p.brand}</div>
                      <div className="text-[13px] font-serif italic text-gray-600">{p.name}</div>
                    </td>
                    <td className="py-6"><span className="text-[9px] font-bold tracking-widest text-[#001b3a] bg-gray-100 px-3 py-1.5 rounded-full uppercase">{p.category}</span></td>
                    <td className="py-6 flex flex-col pt-8">
                       <span className={`text-[11px] font-mono ${p.stock <= 3 ? 'text-red-600 font-bold' : 'text-gray-500'}`}>{p.stock} units</span>
                       <div className="w-20 h-1 bg-gray-100 mt-2 rounded-full overflow-hidden">
                          <div className={`h-full ${p.stock <= 3 ? 'bg-red-500' : 'bg-green-600'}`} style={{width: `${Math.min(p.stock * 10, 100)}%`}}></div>
                       </div>
                    </td>
                    <td className="py-6 font-mono text-sm tracking-tighter">${p.price}</td>
                    <td className="py-6 text-right pr-4">
                      <button onClick={() => handleEdit(p)} className="text-[#001b3a] hover:underline underline-offset-4 font-bold text-[10px] tracking-widest mr-6 transition-all">EDIT</button>
                      <button onClick={() => handleDelete(p.id!)} className="text-red-700 hover:text-red-500 font-bold text-[10px] tracking-widest transition-all">TERMINATE</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-3xl shadow-2xl p-12 relative animate-in zoom-in-95 duration-300">
            <button onClick={() => setShowModal(false)} className="absolute top-6 right-8 text-2xl hover:text-red-500 transition-colors">✕</button>
            <h2 className="text-3xl font-serif mb-10 pb-4 border-b border-gray-100 uppercase tracking-widest">{editingProduct ? "Revise Portfolio Item" : "New Portfolio Addition"}</h2>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-x-12 gap-y-8">
              <div className="col-span-1">
                <label className="text-[9px] font-bold tracking-[0.3em] uppercase text-gray-400 block mb-2">Designer Label</label>
                <input required className="w-full border-b border-gray-200 pb-3 focus:border-black outline-none transition-colors text-sm" value={formData.brand} onChange={(e) => setFormData({...formData, brand: e.target.value})} />
              </div>
              <div className="col-span-1">
                <label className="text-[9px] font-bold tracking-[0.3em] uppercase text-gray-400 block mb-2">Item Designation</label>
                <input required className="w-full border-b border-gray-200 pb-3 focus:border-black outline-none transition-colors text-sm" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="text-[9px] font-bold tracking-[0.3em] uppercase text-gray-400 block mb-2">Valuation (USD)</label>
                <input required type="number" step="0.01" className="w-full border-b border-gray-200 pb-3 focus:border-black outline-none transition-colors text-sm font-mono" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
              </div>
              <div>
                <label className="text-[9px] font-bold tracking-[0.3em] uppercase text-gray-400 block mb-2">Units in Inventory</label>
                <input required type="number" className="w-full border-b border-gray-200 pb-3 focus:border-black outline-none transition-colors text-sm font-mono" value={formData.stock} onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value)})} />
              </div>
              <div>
                <label className="text-[9px] font-bold tracking-[0.3em] uppercase text-gray-400 block mb-2">Classification</label>
                <select className="w-full border-b border-gray-200 pb-3 bg-transparent focus:border-black outline-none transition-colors text-sm font-bold uppercase tracking-widest" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                  <option value="kids">Kids & Baby</option>
                  <option value="home">Home</option>
                </select>
              </div>
              <div>
                <label className="text-[9px] font-bold tracking-[0.3em] uppercase text-gray-400 block mb-2">Visual Asset URL</label>
                <input required className="w-full border-b border-gray-200 pb-3 focus:border-black outline-none transition-colors text-sm" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} />
              </div>
              
              <button type="submit" className="col-span-2 mt-10 bg-[#001b3a] text-white py-5 text-[11px] font-bold tracking-[0.3em] uppercase shadow-2xl hover:bg-opacity-95 transition-all">
                {editingProduct ? "COMMIT UPDATES" : "INITIALIZE ITEM"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
