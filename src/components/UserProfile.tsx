import React, { useState } from 'react';
import { User, UserMinus, UserPlus, Trash2, Eye, Shield, Calendar, Clock, Lock, Mail, Users } from 'react-feather';
import { useAuth } from '../context/AuthContext'; // ton hook personnalisé

type UserType = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
  lastLogin: string;
};

type Props = {
  users: UserType[];
  database: {
    isProtectedAdmin: (id: string) => boolean;
  };
  handlePromoteUser: (id: string) => void;
  handleDemoteUser: (id: string) => void;
  handleDeleteUser: (id: string) => void;
};

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
};

export const UserProfiles: React.FC<Props> = ({
  users,
  database,
  handlePromoteUser,
  handleDemoteUser,
  handleDeleteUser,
}) => {
  const { user: currentUser } = useAuth();
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const filteredUsers = users; // Ajoute ici un filtre si besoin

  return (
    <div className="p-4">
      <table className="w-full text-white bg-gray-900 rounded-lg overflow-hidden">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="p-3 text-left">Nom</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Rôle</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id} className="border-b border-gray-700">
              <td className="p-3">
                {user.firstName} {user.lastName}
              </td>
              <td className="p-3">{user.email}</td>
              <td className="p-3">
                {user.role === 'admin' ? (
                  <span className="text-red-400 font-semibold">Admin</span>
                ) : (
                  <span>Utilisateur</span>
                )}
                {database.isProtectedAdmin(user.id) && (
                  <span className="ml-2 px-2 py-1 text-yellow-400 text-xs font-semibold border border-yellow-400 rounded">
                    Protégé
                  </span>
                )}
              </td>
              <td className="p-3 flex space-x-2">
                <button
                  onClick={() => setSelectedUser(user)}
                  className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
                  title="Voir les détails"
                >
                  <Eye className="w-4 h-4" />
                </button>

                {currentUser?.role === 'admin' ? (
                  <button
                    onClick={() => handleDemoteUser(user.id)}
                    disabled={database.isProtectedAdmin(user.id)}
                    className={`p-2 rounded-lg text-white transition-colors ${
                      database.isProtectedAdmin(user.id)
                        ? 'bg-gray-500 cursor-not-allowed'
                        : 'bg-orange-600 hover:bg-orange-700'
                    }`}
                    title={
                      database.isProtectedAdmin(user.id)
                        ? 'Administrateur protégé'
                        : 'Rétrograder'
                    }
                  >
                    <UserMinus className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => handlePromoteUser(user.id)}
                    className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    title="Promouvoir admin"
                  >
                    <UserPlus className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={() => setShowDeleteConfirm(user.id)}
                  disabled={database.isProtectedAdmin(user.id)}
                  className={`p-2 rounded-lg text-white transition-colors ${
                    database.isProtectedAdmin(user.id)
                      ? 'bg-gray-500 cursor-not-allowed'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                  title={
                    database.isProtectedAdmin(user.id)
                      ? 'Administrateur protégé'
                      : 'Supprimer'
                  }
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Détails utilisateur */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedUser(null)}
          />
          <div className="relative bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-700 max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Détails utilisateur</h2>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="flex items-center space-x-4 mb-6">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  selectedUser.role === 'admin'
                    ? 'bg-gradient-to-r from-orange-500 to-red-600'
                    : 'bg-gradient-to-r from-blue-500 to-purple-600'
                }`}
              >
                <span className="text-white text-xl font-bold">
                  {selectedUser.firstName.charAt(0).toUpperCase()}
                  {selectedUser.lastName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <div className="flex items-center space-x-3">
                  <h3 className="text-xl font-bold text-white">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </h3>
                  {selectedUser.role === 'admin' && (
                    <div className="px-3 py-1 bg-red-500/20 border border-red-500/50 rounded-full">
                      <span className="text-red-400 text-sm font-medium">ADMIN</span>
                    </div>
                  )}
                  {database.isProtectedAdmin(selectedUser.id) && (
                    <div className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/50 rounded-full">
                      <span className="text-yellow-400 text-sm font-medium">PROTÉGÉ</span>
                    </div>
                  )}
                </div>
                <p className="text-gray-400">{selectedUser.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">Informations personnelles</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-400">Prénom</div>
                      <div className="text-white">{selectedUser.firstName}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-400">Nom</div>
                      <div className="text-white">{selectedUser.lastName}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-400">Email</div>
                      <div className="text-white">{selectedUser.email}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mb-4">Informations système</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-800/50 rounded-lg">
                    <div className="text-sm text-gray-400">ID utilisateur</div>
                    <div className="text-white font-mono text-sm">{selectedUser.id}</div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
                    <Shield
                      className={`w-5 h-5 ${
                        selectedUser.role === 'admin' ? 'text-red-400' : 'text-gray-400'
                      }`}
                    />
                    <div>
                      <div className="text-sm text-gray-400">Rôle</div>
                      <div
                        className={`font-medium ${
                          selectedUser.role === 'admin' ? 'text-red-400' : 'text-white'
                        }`}
                      >
                        {selectedUser.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-400">Créé le</div>
                      <div className="text-white">{formatDate(selectedUser.createdAt)}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-400">Dernière connexion</div>
                      <div className="text-white">{formatDate(selectedUser.lastLogin)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions rapides */}
            {!database.isProtectedAdmin(selectedUser.id) && (
              <div className="flex space-x-3 pt-4 border-t border-gray-700">
                {selectedUser.role === 'admin' ? (
                  <button
                    onClick={() => {
                      handleDemoteUser(selectedUser.id);
                      setSelectedUser(null);
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
                  >
                    <UserMinus className="w-4 h-4" />
                    <span>Rétrograder</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      handlePromoteUser(selectedUser.id);
                      setSelectedUser(null);
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Promouvoir Admin</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setShowDeleteConfirm(selectedUser.id);
                    setSelectedUser(null);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Supprimer</span>
                </button>
              </div>
            )}

            {database.isProtectedAdmin(selectedUser.id) && (
              <div className="p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-lg mt-6">
                <div className="flex items-center space-x-2">
                  <Lock className="w-5 h-5 text-yellow-400" />
                  <span className="text-yellow-400 font-medium">Administrateur protégé</span>
                </div>
                <p className="text-yellow-300 text-sm mt-1">
                  Cet utilisateur ne peut pas être supprimé ou rétrogradé.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal confirmation suppression */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowDeleteConfirm(null)}
          />
          <div className="relative bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md border border-red-500/50 p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                <Trash2 className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Supprimer l'utilisateur</h3>
                <p className="text-gray-400">Cette action est irréversible</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6">
              Êtes-vous sûr de vouloir supprimer cet utilisateur ? Toutes ses données seront perdues
              définitivement.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  if (showDeleteConfirm) handleDeleteUser(showDeleteConfirm);
                  setShowDeleteConfirm(null);
                }}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
              >
                Supprimer
              </button>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
