import React, { useState, useEffect } from 'react';
import { UserPlus, UserMinus, Trash2, Eye, Lock, Users, User, Mail, Shield, Calendar, Clock } from 'react-feather'; // icônes feather
import { formatDate } from '../utils/formatDate'; // ta fonction de formatage de date
import { database } from '../services/database'; // ta db simulée
import type { User as UserType } from '../types/user';

interface AdminPanelProps {}

const AdminPanel: React.FC<AdminPanelProps> = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('');

  useEffect(() => {
    // Charger la liste des utilisateurs (simulateur)
    setUsers(database.getUsers());
  }, []);

  // Filtrer la liste selon recherche
  const filteredUsers = users.filter(
    (u) =>
      u.firstName.toLowerCase().includes(filter.toLowerCase()) ||
      u.lastName.toLowerCase().includes(filter.toLowerCase()) ||
      u.email.toLowerCase().includes(filter.toLowerCase())
  );

  // Actions
  const handlePromoteUser = (id: string) => {
    database.promoteToAdmin(id);
    setUsers(database.getUsers());
  };

  const handleDemoteUser = (id: string) => {
    if (database.isProtectedAdmin(id)) return;
    database.demoteToUser(id);
    setUsers(database.getUsers());
  };

  const handleDeleteUser = (id: string) => {
    if (database.isProtectedAdmin(id)) return;
    database.deleteUser(id);
    setUsers(database.getUsers());
    setShowDeleteConfirm(null);
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">Administration des utilisateurs</h1>

      <input
        type="text"
        placeholder="Rechercher un utilisateur..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="mb-4 p-2 rounded bg-gray-800 text-white w-full max-w-md"
      />

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="py-2 px-4">Utilisateur</th>
            <th className="py-2 px-4">Email</th>
            <th className="py-2 px-4">Rôle</th>
            <th className="py-2 px-4">Créé le</th>
            <th className="py-2 px-4">Dernière connexion</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center py-8 text-gray-400">
                Aucun utilisateur trouvé
              </td>
            </tr>
          )}
          {filteredUsers.map((user) => (
            <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-800">
              <td className="py-3 px-4 flex items-center space-x-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    user.role === 'admin' ? 'bg-gradient-to-r from-orange-500 to-red-600' : 'bg-gradient-to-r from-blue-500 to-purple-600'
                  }`}
                >
                  <span className="text-white font-semibold text-sm">
                    {user.firstName.charAt(0).toUpperCase()}
                    {user.lastName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="font-medium">{user.firstName} {user.lastName}</div>
                  <div className="text-xs text-gray-400 font-mono">{user.id}</div>
                </div>
              </td>
              <td className="py-3 px-4">{user.email}</td>
              <td className="py-3 px-4">
                {user.role === 'admin' ? (
                  <span className="text-red-400 font-semibold text-xs bg-red-600/20 px-2 py-1 rounded-full">ADMIN</span>
                ) : (
                  <span className="text-gray-400 font-semibold text-xs bg-gray-600/20 px-2 py-1 rounded-full">USER</span>
                )}
              </td>
              <td className="py-3 px-4">{formatDate(user.createdAt)}</td>
              <td className="py-3 px-4">{formatDate(user.lastLogin)}</td>
              <td className="py-3 px-4 flex space-x-2">
                <button
                  onClick={() => setSelectedUser(user)}
                  title="Voir détails"
                  className="p-2 bg-blue-600 hover:bg-blue-700 rounded transition"
                >
                  <Eye size={16} />
                </button>

                {user.role === 'admin' ? (
                  <button
                    onClick={() => handleDemoteUser(user.id)}
                    disabled={database.isProtectedAdmin(user.id)}
                    title={database.isProtectedAdmin(user.id) ? "Administrateur protégé" : "Rétrograder"}
                    className={`p-2 rounded text-white transition ${
                      database.isProtectedAdmin(user.id) ? 'bg-gray-500 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700'
                    }`}
                  >
                    <UserMinus size={16} />
                  </button>
                ) : (
                  <button
                    onClick={() => handlePromoteUser(user.id)}
                    title="Promouvoir admin"
                    className="p-2 bg-green-600 hover:bg-green-700 rounded transition text-white"
                  >
                    <UserPlus size={16} />
                  </button>
                )}

                <button
                  onClick={() => setShowDeleteConfirm(user.id)}
                  disabled={database.isProtectedAdmin(user.id)}
                  title={database.isProtectedAdmin(user.id) ? "Administrateur protégé" : "Supprimer"}
                  className={`p-2 rounded text-white transition ${
                    database.isProtectedAdmin(user.id) ? 'bg-gray-500 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Détails utilisateur modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center p-4 z-50">
          <div
            className="absolute inset-0"
            onClick={() => setSelectedUser(null)}
          />
          <div className="relative bg-gray-900 rounded-lg shadow-lg p-6 max-w-2xl w-full overflow-auto max-h-[90vh] border border-gray-700">
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl font-bold"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-4">Détails utilisateur</h2>

            <div className="flex items-center space-x-4 mb-6">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  selectedUser.role === 'admin' ? 'bg-gradient-to-r from-orange-500 to-red-600' : 'bg-gradient-to-r from-blue-500 to-purple-600'
                }`}
              >
                <span className="text-white text-xl font-bold">
                  {selectedUser.firstName.charAt(0).toUpperCase()}
                  {selectedUser.lastName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <div className="text-xl font-semibold">{selectedUser.firstName} {selectedUser.lastName}</div>
                <div className="text-gray-400">{selectedUser.email}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Informations personnelles</h3>
                <p><strong>Prénom:</strong> {selectedUser.firstName}</p>
                <p><strong>Nom:</strong> {selectedUser.lastName}</p>
                <p><strong>Email:</strong> {selectedUser.email}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Informations système</h3>
                <p><strong>ID utilisateur:</strong> <code>{selectedUser.id}</code></p>
                <p><strong>Rôle:</strong> {selectedUser.role === 'admin' ? 'Administrateur' : 'Utilisateur'}</p>
                <p><strong>Créé le:</strong> {formatDate(selectedUser.createdAt)}</p>
                <p><strong>Dernière connexion:</strong> {formatDate(selectedUser.lastLogin)}</p>
              </div>
            </div>

            {!database.isProtectedAdmin(selectedUser.id) && (
              <div className="mt-6 flex space-x-4">
                {selectedUser.role === 'admin' ? (
                  <button
                    onClick={() => {
                      handleDemoteUser(selectedUser.id);
                      setSelectedUser(null);
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded text-white"
                  >
                    <UserMinus size={16} />
                    <span>Rétrograder</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      handlePromoteUser(selectedUser.id);
                      setSelectedUser(null);
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white"
                  >
                    <UserPlus size={16} />
                    <span>Promouvoir Admin</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setShowDeleteConfirm(selectedUser.id);
                    setSelectedUser(null);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white"
                >
                  <Trash2 size={16} />
                  <span>Supprimer</span>
                </button>
              </div>
            )}

            {database.isProtectedAdmin(selectedUser.id) && (
              <div className="mt-6 p-4 bg-yellow-500/20 border border-yellow-500 rounded text-yellow-400">
                <Lock size={16} className="inline mr-2" />
                Administrateur protégé — suppression et rétrogradation interdites.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Confirmation suppression */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center p-4 z-50">
          <div
            className="absolute inset-0"
            onClick={() => setShowDeleteConfirm(null)}
          />
          <div className="relative bg-gray-900 rounded-lg shadow-lg p-6 max-w-md w-full border border-red-500">
            <h3 className="text-xl font-bold text-red-500 mb-4">Supprimer l'utilisateur</h3>
            <p className="mb-6">Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.</p>
            <div className="flex space-x-4">
             
