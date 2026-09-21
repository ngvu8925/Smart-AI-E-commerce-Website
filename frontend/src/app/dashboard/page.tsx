"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { apiUrl } from "@/lib/api";

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
}

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Gọi API thật khi vào trang
    const fetchProducts = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        // Chưa đăng nhập, rớt về trang chủ
        router.push("/");
        return;
      }

      try {
        const response = await axios.get(apiUrl("/api/products/"), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProducts(response.data);
      } catch (err) {
        console.error("Lỗi khi tải danh sách sản phẩm", err);
        // Có thể token hết hạn, yêu cầu đăng nhập lại
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    router.push("/");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-xl">
        Đang tải dữ liệu...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">
            Trang Quản Trị (Dashboard)
          </h1>
          <button
            onClick={handleLogout}
            className="rounded bg-red-500 px-4 py-2 font-semibold text-white transition hover:bg-red-600"
          >
            Đăng Xuất
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="overflow-hidden rounded-lg bg-white shadow-md transition hover:shadow-lg"
            >
              <img
                src={product.image}
                alt={product.name}
                className="h-48 w-full object-cover"
              />
              <div className="p-4">
                <span className="mb-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
                  {product.category}
                </span>
                <h3 className="mb-1 text-xl font-bold text-gray-900">
                  {product.name}
                </h3>
                <p className="mb-2 text-gray-600">{product.description}</p>
                <div className="text-lg font-bold text-green-600">
                  ${product.price}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
