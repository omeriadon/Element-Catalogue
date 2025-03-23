import React, { ReactNode } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title = 'Element Catalogue' }) => {
  const router = useRouter();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-950">
      <Head>
        <title>{title}</title>
        <meta name="description" content="Interactive periodic table and element catalogue" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <header className="p-4 bg-blue-800/50 backdrop-blur-md border-b border-blue-700/50">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Element Catalogue</h1>
          <nav className="space-x-4">
            <Link 
              href="/" 
              className={`px-4 py-2 rounded-lg transition-colors ${
                router.pathname === '/' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-blue-200 hover:bg-blue-700/50'
              }`}
            >
              List View
            </Link>
            <Link 
              href="/periodic-table" 
              className={`px-4 py-2 rounded-lg transition-colors ${
                router.pathname === '/periodic-table' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-blue-200 hover:bg-blue-700/50'
              }`}
            >
              Periodic Table
            </Link>
          </nav>
        </div>
      </header>
      
      <main className="container mx-auto p-4 text-white">
        {children}
      </main>
      
      <footer className="p-4 mt-8 bg-blue-800/30 text-blue-300 text-center border-t border-blue-700/50">
        <p>Element Catalogue &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default Layout;
