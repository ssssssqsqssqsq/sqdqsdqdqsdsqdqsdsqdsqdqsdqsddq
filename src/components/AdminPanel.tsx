import React, { useState } from 'react';
import { Eye, UserMinus, UserPlus, Trash2, Lock } from 'lucide-react';

// Exemple types, adapte selon ton modèle
type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
  lastLogin: string;
};

type AdminPanelProps = {
  users: User[];
  handlePromoteUser: (userId: string) => void;
  handleDemoteUser: (userId: string) => void;
  handleDeleteUser: (userId: string) => void;
  isProtectedAdmin: (userId: string) => boolean;
};

// Fonction utilitaire
const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

const AdminPanel: React.FC<AdminPanelProps> = ({
  users,
  handlePromoteUser,
  handleDemoteUser,
  handleDeleteUser,
  isProtectedAdmin,
}) => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  return (
    <div className="p-6 bg-gray-900 text-white rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Panel Administrateur</h2>

      <table className="w-full text-left text-sm">
        <thead>
          <tr className="text-gray-400 border-b border-white/10">
            <th className="py-2 px-4">Nom</th>
            <th className="py-2 px-4">Email</th>
            <th className="py-2 px-4">Rôle</th>
            <th className="py-2 px-4">Créé le</th>
            <th className="py-2 px-4">Dernière connexion</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => {
            const isAdmin = user.role === 'admin';
            const isProtected = isProtectedAdmin(user.id);

            const avatarBg = isAdmin
              ? 'bg-gradient-to-r from-orange-500 to-red-600'
              : 'bg-gradient-to-r from-blue-500 to-purple-600';

            return (
              <tr key={user.id} className="hover:bg-white/5">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center ${avatarBg}`}>
                      <span className="text-white font-semibold text-sm">
                        {user.firstName[0]}{user.lastName[0]}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">
                          {user.firstName} {user.lastName}
                        </span>
                        {isProtected && (
                          <Lock className="w-4 h-4 text-yellow-400" />
                        )}
                      </div>
                      <span className="text-xs text-gray-400 font-mono">{user.id}</span>
                    </div>
                  </div>
                </td>

                <td className="py-3 px-4">{user.email}</td>

                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                    isAdmin
                      ? 'bg-red-500/20 border-red-500/50 text-red-400'
                      : 'bg-gray-500/20 border-gray-500/50 text-gray-300'
                  }`}>
                    {isAdmin ? 'ADMIN' : 'USER'}
                  </span>
                </td>

                <td className="py-3 px-4">{formatDate(user.createdAt)}</td>
                <td className="py-3 px-4">{formatDate(user.lastLogin)}</td>

                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedUserId(user.id)}
                      className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
                      title="Voir détails"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {isAdmin ? (
                      <button
                        onClick={() => handleDemoteUser(user.id)}
                        disabled={isProtected}
                        className={`p-2 rounded-lg ${
                          isProtected
                            ? 'bg-gray-500 cursor-not-allowed'
                            : 'bg-orange-600 hover:bg-orange-700'
                        }`}
                        title="Rétrograder"
                      >
                        <UserMinus className="w-4 h-4 text-white" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handlePromoteUser(user.id)}
                        className="p-2 bg-green-600 hover:bg-green-700 rounded-lg"
                        title="Promouvoir"
                      >
                        <UserPlus className="w-4 h-4 text-white" />
                      </button>
                    )}

                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      disabled={isProtected}
                      className={`p-2 rounded-lg ${
                        isProtected
                          ? 'bg-gray-500 cursor-not-allowed'
                          : 'bg-red-600 hover:bg-red-700'
                      }`}
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;
