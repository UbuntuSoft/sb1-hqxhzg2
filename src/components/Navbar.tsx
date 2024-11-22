import React from 'react';
import { Menu, X, Store } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { session } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-sm fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Store className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">GigMan</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-700 hover:text-blue-600">Features</a>
            <a href="#benefits" className="text-gray-700 hover:text-blue-600">Benefits</a>
            <a href="#testimonials" className="text-gray-700 hover:text-blue-600">Testimonials</a>
            {session ? (
              <Link 
                to="/dashboard"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Dashboard
              </Link>
            ) : (
              <button 
                onClick={() => navigate('/login')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Get Started
              </button>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="#features" className="block px-3 py-2 text-gray-700 hover:text-blue-600">Features</a>
            <a href="#benefits" className="block px-3 py-2 text-gray-700 hover:text-blue-600">Benefits</a>
            <a href="#testimonials" className="block px-3 py-2 text-gray-700 hover:text-blue-600">Testimonials</a>
            {session ? (
              <Link 
                to="/dashboard"
                className="block w-full text-center mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Dashboard
              </Link>
            ) : (
              <button 
                onClick={() => navigate('/login')}
                className="w-full mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Get Started
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}