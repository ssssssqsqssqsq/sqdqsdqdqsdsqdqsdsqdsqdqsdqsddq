import React, { useState } from "react";
import { AuthProvider, useAuth } from "./AuthContext";

function LoginForm() {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-4">
      <label>Email</label>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 w-full"
      />

      <label className="mt-4">Mot de passe</label>
      <input
        type="password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 w-full"
      />

      {error && <p className="text-red-500 mt-2">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Connexion..." : "Se connecter"}
      </button>
    </form>
  );
}

function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold">Bienvenue {user?.firstName}</h1>
      <p>Rôle: {user?.role}</p>
      <button
        onClick={logout}
        className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Déconnexion
      </button>
    </div>
  );
}

function App() {
  const { user } = useAuth();

  return <>{user ? <Dashboard /> : <LoginForm />}</>;
}

export default function RootApp() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
