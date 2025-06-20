import React, { useState } from 'react';
import { 
  Download, 
  Play, 
  Star, 
  Package, 
  Monitor,
  Globe,
  Menu,
  ArrowLeft,
  Database
} from 'lucide-react';

import { useAuth } from './hooks/useAuth';
import { UserMenu } from './components/UserMenu';
import UserProfile from './components/UserProfile';
import { AdminPanel } from './components/AdminPanel';

// Modal simple intégré ici pour l'exemple
function AuthModal({ mode, onClose }: { mode: 'login' | 'register'; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white text-black p-8 rounded max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-700 font-bold text-xl"
          aria-label="Fermer modal"
        >
          &times;
        </button>
        <h2 className="text-2xl mb-4">{mode === 'login' ? 'Connexion' : 'Inscription'}</h2>
        <form>
          <input
            type="email"
            placeholder="Email"
            className="w-full mb-4 p-2 border border-gray-300 rounded"
          />
          <input
            type="password"
            placeholder="Mot de passe"
            className="w-full mb-4 p-2 border border-gray-300 rounded"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
          >
            {mode === 'login' ? 'Se connecter' : "S'inscrire"}
          </button>
        </form>
      </div>
    </div>
  );
}

function App() {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [currentView, setCurrentView] = useState<'home' | 'profile' | 'admin'>('home');

  const openAuthModal = (mode: 'login' | 'register') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleProfileClick = () => setCurrentView('profile');
  const handleAdminClick = () => setCurrentView('admin');
  const handleBackToHome = () => setCurrentView('home');

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {currentView === 'home' && (
        <div className="absolute inset-0 z-0">
          <img 
            src="/image.png" 
            alt="Minecraft background" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60"></div>
        </div>
      )}

      <div className="relative z-10">
        <header className="border-b border-gray-800/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                {(currentView === 'profile' || currentView === 'admin') && (
                  <button
                    onClick={handleBackToHome}
                    className="text-gray-300 hover:text-white transition-colors"
                    aria-label="Retour à l'accueil"
                  >
                    <ArrowLeft className="w-6 h-6" />
                  </button>
                )}
                <div className="text-2xl font-bold text-white">ModFusion</div>
                {currentView === 'admin' && (
                  <div className="px-3 py-1 bg-red-500/20 border border-red-500/50 rounded-full">
                    <span className="text-red-400 text-sm font-medium">ADMIN</span>
                  </div>
                )}
              </div>

              {currentView !== 'admin' && (
                <nav className="hidden md:flex items-center space-x-8">
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">À propos</a>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">Bibliothèque</a>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">Blog</a>
                  <a href="#" className="bg-yellow-400 text-black px-3 py-1 rounded-md font-medium hover:bg-yellow-300 transition-colors">
                    ModFusionPrime
                  </a>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">Support</a>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">Servers</a>
                </nav>
              )}

              <div className="hidden md:flex items-center space-x-4">
                {currentView !== 'admin' && (
                  <div className="flex items-center space-x-2 text-gray-300">
                    <Globe className="w-4 h-4" />
                    <span>Français</span>
                  </div>
                )}

                {isAdmin && (
                  <button
                    onClick={handleAdminClick}
                    className="flex items-center space-x-2 px-3 py-2 bg-red-600/20 border border-red-500/50 text-red-400 hover:bg-red-600/30 hover:text-red-300 rounded-lg transition-colors"
                    title="Panneau d'administration"
                  >
                    <Database className="w-4 h-4" />
                    <span className="hidden lg:block">Admin</span>
                  </button>
                )}

                {isAuthenticated ? (
                  <UserMenu onProfileClick={handleProfileClick} />
                ) : (
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => openAuthModal('login')}
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      Connexion
                    </button>
                    <button
                      onClick={() => openAuthModal('register')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      S'inscrire
                    </button>
                  </div>
                )}
              </div>

              {currentView !== 'admin' && (
                <div className="md:hidden">
                  <Menu className="w-6 h-6 text-gray-300" />
                </div>
              )}
            </div>
          </div>
        </header>

        {currentView === 'home' && (
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="max-w-xl">
              <h1 className="text-3xl lg:text-5xl font-bold leading-tight">
                BOOSTEZ VOTRE<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                  GAMEPLAY
                </span><br />
                AVEC DES MODS
              </h1>
              <p className="text-base lg:text-lg text-gray-200 leading-relaxed mt-4">
                Votre jeu ne sera plus jamais le même grâce aux modifications, skins, optimisations...
              </p>

              <div className="flex flex-col space-y-4 mt-6">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-white font-medium">4.4/5</span>
                </div>

                <div className="flex items-center space-x-2">
                  <img 
                    src="https://preview.redd.it/1wo65al6iox71.png?auto=webp&s=416c56a7134cd4395d730524a2bfef29639ab5d8"
                    alt="Minecraft logo" 
                    className="w-6 h-6 object-contain"
                  />
                  <span className="text-white font-medium">Compatible Minecraft</span>
                </div>

                <div className="flex items-center space-x-2">
                  <Package className="w-5 h-5 text-blue-500" />
                  <span className="text-white font-medium">21 000+</span>
                  <span className="text-gray-300">téléchargements</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <button className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-transform duration-200 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/25">
                  <Monitor className="w-5 h-5 mr-2" />
                  Téléchargement gratuit
