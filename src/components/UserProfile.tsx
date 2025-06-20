import React from 'react';
import { useAuth } from '../hooks/useAuth';

const UserProfile: React.FC = () => {
  const { user, updateProfile } = useAuth();

  const handleUpdate = async () => {
    if (!user) return;

    const updates = {
      firstName: 'NouveauPrénom',
      lastName: 'NouveauNom',
    };

    const result = await updateProfile(updates);
    if (result.success) {
      alert('Profil mis à jour avec succès');
    } else {
      alert('Erreur: ' + result.error);
    }
  };

  if (!user) return <p>Chargement ou utilisateur non connecté...</p>;

  return (
    <div className="p-4 border rounded shadow-sm max-w-md mx-auto mt-10 bg-white text-black">
      <h2 className="text-xl font-bold mb-4">Profil utilisateur</h2>
      <p><strong>Nom:</strong> {user.firstName} {user.lastName}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Rôle:</strong> {user.role}</p>
      <p><strong>Dernière connexion:</strong> {new Date(user.lastLogin).toLocaleString()}</p>
      <button 
        onClick={handleUpdate} 
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Modifier le profil
      </button>
    </div>
  );
};

export default UserProfile;
