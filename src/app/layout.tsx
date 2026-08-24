import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { AuthModalProvider } from "@/context/AuthModalContext";
import FlashSaleBanner from "@/components/FlashSaleBanner";
import CartDrawer from "@/components/CartDrawer";
import QuickAuthModal from "@/components/QuickAuthModal";

export const metadata: Metadata = {
  title: "Sandline — Resort & Beach Dresses, Made in India",
  description: "Sandline designs short and long western silhouettes for honeymoons, beach weddings and sundown parties.",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,450;9..144,600;9..144,700&family=Work+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <FlashSaleBanner />
        <CartProvider>
          <WishlistProvider>
            <AuthModalProvider>
              {children}
              <CartDrawer />
              <QuickAuthModal />
            </AuthModalProvider>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
