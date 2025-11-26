import React from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Home } from './pages/Home';
import { Gallery } from './pages/Gallery';
import { ThemeToggle } from './components/ThemeToggle';
import { Camera } from 'lucide-react';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        {/* Navigation Bar */}
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-blue-600 text-white p-1.5 rounded-lg group-hover:bg-blue-700 transition-colors">
                <Camera size={24} />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
                StaticGallery
              </span>
            </Link>
            
            <div className="flex items-center gap-4">
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gallery/:folder/:page" element={<Gallery />} />
            {/* Fallback routing */}
            <Route path="*" element={<Home />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-auto">
          <div className="container mx-auto px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>&copy; {new Date().getFullYear()} StaticGallery. All rights reserved.</p>
            <p className="mt-2 text-xs">
              Powered by React & Tailwind CSS. Designed for static hosting.
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;