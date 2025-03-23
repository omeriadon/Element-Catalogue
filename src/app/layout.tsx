import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
// Add Bootstrap Icons CSS
import "bootstrap-icons/font/bootstrap-icons.css";

// Using Inter as a modern, clean replacement for Geist
const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  variable: "--font-inter",
});

// Using JetBrains Mono as a replacement for Geist Mono
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: 'swap',
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: 'Element Catalogue',
  description: 'Interactive periodic table and element catalogue',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`min-h-screen bg-gradient-to-br from-gray-900 to-blue-950 ${inter.variable} ${jetbrainsMono.variable} font-sans text-gray-100`}>
        <header className="p-4 bg-gray-800/70 backdrop-blur-md border-b border-gray-700">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-400">Element Catalogue</h1>
            <nav className="space-x-4">
              <Link 
                href="/"
                className="px-4 py-2 rounded-lg transition-colors text-blue-300 hover:bg-gray-700"
              >
                <i className="bi bi-grid-3x3-gap me-2"></i>List View
              </Link>
              <Link 
                href="/periodic-table"
                className="px-4 py-2 rounded-lg transition-colors text-blue-300 hover:bg-gray-700"
              >
                <i className="bi bi-table me-2"></i>Periodic Table
              </Link>
            </nav>
          </div>
        </header>
        
        <main className="container mx-auto p-4 text-gray-200">
          {children}
        </main>
        
        <footer className="p-4 mt-8 bg-gray-800/50 text-gray-400 text-center border-t border-gray-700">
          <p>Element Catalogue &copy; {new Date().getFullYear()}</p>
        </footer>
      </body>
    </html>
  );
}
