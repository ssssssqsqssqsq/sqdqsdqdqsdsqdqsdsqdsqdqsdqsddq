import React, { useState, useEffect } from "react";
import { ArrowLeft, Database, Globe, Menu } from "lucide-react";

// Composants simulés
function AuthModal({ isOpen, mode, onClose, onLoginSuccess }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simule une connexion réussie
    onLoginSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-6 rounded-lg max-w-sm w-full space-y-4"
      >
        <h2 className="text-white text-2xl font-bold">
          {mode === "login" ? "Connexion" : "Inscription"}
        </h2>
        <input
          type="email"
          required
          placeholder="Email"
          className="w-full p-2 rounded bg-gray-800 text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          required
          placeholder="Mot de passe"
          className="w-full p-2 rounded bg-gray-800 text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          {mode === "login" ? "Se connecter" : "S'inscrire"}
        </button>
        <button
          type="button"
          className="w-full mt-2 bg-gray-700 text-white py-2 rounded"
          onClick={onClose}
        >
          Annuler
        </button>
      </form>
    </div>
  );
}

function UserMenu({ onProfileClick, onLogout }: any) {
  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={onProfileClick}
        className="text-gray-300 hover:text-white transition"
      >
        Profil
      </button>
      <button
        onClick={onLogout}
        className="bg-red-600 px-3 py-1 rounded text-white hover:bg-red-700"
      >
        Déconnexion
      </button>
    </div>
  );
}

function UserProfile() {
  return (
    <div className="p-8 max-w-xl mx-auto text-white">
      <h2 className="text-3xl font-bold mb-4">Profil Utilisateur</h2>
      <p>Bienvenue dans votre profil !</p>
    </div>
  );
}

function AdminPanel() {
  return (
    <div className="p-8 max-w-xl mx-auto text-white">
      <h2 className="text-3xl font-bold mb-4">Panneau Admin</h2>
      <p>Contenu réservé aux administrateurs.</p>
    </div>
  );
}

function App() {
  // Simule un hook d'authentification
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "register">("login");

  const [currentView, setCurrentView] = useState<"home" | "profile" | "admin">("home");

  // Simule un chargement initial (ex : check token en localstorage)
  useEffect(() => {
    setTimeout(() => {
      // Ici on pourrait vérifier un token dans localStorage
      setLoading(false);
    }, 500);
  }, []);

  const openAuthModal = (mode: "login" | "register") => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setIsAdmin(false); // modifie si tu veux admin par défaut ou pas
    setCurrentView("home"); // reste sur home, ne pas ouvrir le profil
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
    setCurrentView("home");
  };

  const handleProfileClick = () => {
    setCurrentView("profile");
  };

  const handleAdminClick = () => {
    setCurrentView("admin");
  };

  const handleBackToHome = () => {
    setCurrentView("home");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Header */}
      <header className="border-b border-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              {(currentView === "profile" || currentView === "admin") && (
                <button
                  onClick={handleBackToHome}
                  className="text-gray-300 hover:text-white transition"
                  aria-label="Retour à l'accueil"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
              )}
              <div className="text-2xl font-bold">ModFusion</div>
              {currentView === "admin" && (
                <div className="px-3 py-1 bg-red-500/20 border border-red-500/50 rounded-full">
                  <span className="text-red-400 text-sm font-medium">ADMIN</span>
                </div>
              )}
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-300">
                <Globe className="w-4 h-4" />
                <span>Français</span>
              </div>
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
                <UserMenu onProfileClick={handleProfileClick} onLogout={handleLogout} />
              ) : (
                <>
                  <button
                    onClick={() => openAuthModal("login")}
                    className="text-gray-300 hover:text-white transition"
                  >
                    Connexion
                  </button>
                  <button
                    onClick={() => openAuthModal("register")}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
                  >
                    S'inscrire
                  </button>
                </>
              )}
            </div>

            <div className="md:hidden">
              <Menu className="w-6 h-6 text-gray-300" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      {currentView === "home" && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 text-white">
          <h1 className="text-4xl font-bold mb-6">
            BOOSTEZ VOTRE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
              GAMEPLAY
            </span>{" "}
            <br />
            AVEC DES MODS
          </h1>
          {!isAuthenticated && (
            <p className="mb-6">
              Créez un compte pour accéder à tous nos mods et fonctionnalités exclusives !
            </p>
          )}
        </main>
      )}

      {currentView === "profile" && <UserProfile />}
      {currentView === "admin" && <AdminPanel />}

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        mode={authModalMode}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}

export default App;
