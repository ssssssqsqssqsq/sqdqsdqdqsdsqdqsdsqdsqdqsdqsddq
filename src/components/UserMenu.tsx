import React, { useState } from 'react';
import { User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const UserMenu: React.FC = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
      >
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-semibold">
            {user.firstName.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="hidden md:block">{user.firstName}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl z-20">
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg font-semibold">
                    {user.firstName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-white font-medium">{user.firstName} {user.lastName}</p>
                  <p className="text-gray-400 text-sm">{user.email}</p>
                </div>
              </div>
            </div>
            
            <div className="py-2">
              <button className="w-full px-4 py-2 text-left text-gray-300 hover:text-white hover:bg-gray-800 transition-colors flex items-center space-x-2">
                <Settings className="w-4 h-4" />
                <span>Paramètres</span>
              </button>
              
              <button 
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left text-red-400 hover:text-red-300 hover:bg-gray-800 transition-colors flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};