
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from '@/context/CartContext';

export const metadata: Metadata = {
  title: 'Pala Jewelry',
  description: 'Exquisite jewelry for every occasion.',
  icons: {
    icon: '/favicon-diamond.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=PT+Sans:wght@400;700&family=Snippet&family=Seoul+Hangang:wght@400;700&family=Kantumruy+Pro:wght@400;700&family=Nunito+Sans:wght@400;700&family=Kanit:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <CartProvider>
            {children}
            <Toaster />
        </CartProvider>
      </body>
    </html>
  );
}
