import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navigation() {
  const location = useLocation();
  
  const isActive = (path: string) => 
    location.pathname === path ? 'bg-primary/20' : '';

  return (
    <nav className="bg-gray-800 mb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold">
            ASEP Quiz
          </Link>
          
          <div className="flex space-x-4">
            <Link 
              to="/" 
              className={`px-3 py-2 rounded-md ${isActive('/')}`}
            >
              Home
            </Link>
            <Link 
              to="/subjects" 
              className={`px-3 py-2 rounded-md ${isActive('/subjects')}`}
            >
              Subjects
            </Link>
            <Link 
              to="/results" 
              className={`px-3 py-2 rounded-md ${isActive('/results')}`}
            >
              Results
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 