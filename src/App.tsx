import React, { useState } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import UserProfile from './components/UserProfile';

function AuthModal({ isOpen, onClose, onLogin }: { isOpen: boolean; onClose: () => void; onLogin: (email: string, password: string) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-80">
        <h2 className="text-xl mb-4">Connexion</h2>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          className="w-full p-2 mb-4 border rounded"
        />
        <input 
          type="password" 
          placeholder="Mot de passe" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          className="w-full p-2 mb-4 border rounded"
        />
        <button
          onClick={() => {
            onLogin(email, password);
            onClose();
          }}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Se connecter
        </button>
        <button onClick={onClose} className="mt-2 w-full py-2 border rounded">Annuler</button>
      </div>
    </div>
  );
}

function AppContent() {
  const { isAuthenticated, login, logout, loading } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-black text-white">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      {!isAuthenticated ? (
        <>
          <button onClick={() => setIsAuthModalOpen(true)} className="mr-2 px-4 py-2 bg-blue-600 rounded">Connexion</button>
          <button className="px-4 py-2 bg-gray-700 rounded">Inscription</button>
        </>
      ) : (
        <>
          <button onClick={logout} className="mb-4 px-4 py-2 bg-red-600 rounded">Déconnexion</button>
          <UserProfile />
        </>
      )}

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={async (email, password) => {
          await login(email, password);
        }}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
