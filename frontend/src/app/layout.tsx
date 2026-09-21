import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import AIChatbot from "../components/AIChatbot";

export const metadata: Metadata = {
  title: "Ralph Lauren Clone",
  description: "Experience the world of luxury with Ralph Lauren.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <CartProvider>
          {children}
          <AIChatbot />
        </CartProvider>
      </body>
    </html>
  );
}
