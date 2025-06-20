import React, { useState } from 'react';
import {
  Eye,
  UserMinus,
  UserPlus,
  Trash2,
  User,
  Mail,
  Shield,
  Calendar,
  Clock,
  Lock,
  Users,
} from 'react-feather';

const UserManagement = ({ users, currentUserRole, database, handlePromoteUser, handleDemoteUser, handleDeleteUser, formatDate }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const filteredUsers = users; // Ajoute ton filtre si nécessaire

  const isProtected = (userId) => database.isProtectedAdmin(userId);

  return (
    <div className="p-6">
      <table className="min-w-full text-white">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Email</th>
            <th>Rôle</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id} className="border-b border-gray-700">
              <td>{user.firstName} {user.lastName}</td>
              <td>{user.email}</td>
              <td>
                <span className={`px-2 py-1 rounded-full font-semibold ${
                  user.role === 'admin' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'
                }`}>
                  {user.role === 'admin' ? 'Admin' : 'Utilisateur'}
                </span>
                {isProtected(user.id) && (
                  <span className="ml-2 px-2 py-1 rounded-full bg-yellow-500 text-yellow-900 font-semibold text-xs">
                    Protégé
                  </span>
                )}
              </td>
              <td className="flex space-x-2">
                <button
                  title="Voir les détails"
                  onClick={() => setSelectedUser(user)}
                  className="p-2 bg-gray-700 rounded hover:bg-gray-600"
                >
                  <Eye size={16} />
                </button>

                {currentUserRole === 'admin' ? (
                  <button
                    onClick={() => handleDemoteUser(user.id)}
                    disabled={isProtected(user.id)}
                    title={isProtected(user.id) ? "Administrateur protégé" : "Rétrograder"}
                    className={`p-2 rounded text-white transition-colors ${
                      isProtected(user.id) ? 'bg-gray-500 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700'
                    }`}
                  >
                    <UserMinus size={16} />
                  </button>
                ) : (
                  <button
                    onClick={() => handlePromoteUser(user.id)}
                    title="Promouvoir admin"
                    className="p-2 bg-green-600 hover:bg-green-700 text-white rounded"
                  >
                    <UserPlus size={16} />
                  </button>
                )}

                <button
                  onClick={() => setShowDeleteConfirm(user.id)}
                  disabled={isProtected(user.id)}
                  title={isProtected(user.id) ? "Administrateur protégé" : "Supprimer"}
                  className={`p-2 rounded text-white transition-colors ${
                    isProtected(user.id) ? 'bg-gray-500 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}

          {filteredUsers.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center py-10 text-gray-400">
                <Users size={48} className="mx-auto mb-2" />
                Aucun utilisateur trouvé
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80" onClick={() => setSelectedUser(null)} />

          <div className="relative bg-gray-900 rounded-xl shadow-lg max-w-xl w-full max-h-[90vh] overflow-auto p-6 border border-gray-700">
            <header className="flex justify-between items-center mb-6">
              <h2 className="text-white text-2xl font-bold">Détails utilisateur</h2>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </header>

            <div className="flex space-x-6 mb-6">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl ${
                selectedUser.role === 'admin' ? 'bg-gradient-to-r from-orange-500 to-red-600' : 'bg-gradient-to-r from-blue-500 to-purple-600'
              }`}>
                {selectedUser.firstName.charAt(0).toUpperCase()}{selectedUser.lastName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-white text-xl font-bold">{selectedUser.firstName} {selectedUser.lastName}</h3>
                <p className="text-gray-400">{selectedUser.email}</p>
                <div className="mt-2 flex space-x-2">
                  {selectedUser.role === 'admin' && (
                    <span className="px-3 py-1 bg-red-600 bg-opacity-30 rounded-full text-red-400 text-sm font-semibold">
                      ADMIN
                    </span>
                  )}
                  {isProtected(selectedUser.id) && (
                    <span className="px-3 py-1 bg-yellow-500 bg-opacity-30 rounded-full text-yellow-400 text-sm font-semibold">
                      PROTÉGÉ
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <section className="space-y-4">
                <h4 className="text-white font-semibold text-lg">Informations personnelles</h4>
                <div className="bg-gray-800 p-3 rounded flex items-center space-x-3">
                  <User className="text-gray-400 w-5 h-5" />
                  <div>
                    <div className="text-gray-400 text-sm">Prénom</div>
                    <div className="text-white">{selectedUser.firstName}</div>
                  </div>
                </div>
                <div className="bg-gray-800 p-3 rounded flex items-center space-x-3">
                  <User className="text-gray-400 w-5 h-5" />
                  <div>
                    <div className="text-gray-400 text-sm">Nom</div>
                    <div className="text-white">{selectedUser.lastName}</div>
                  </div>
                </div>
                <div className="bg-gray-800 p-3 rounded flex items-center space-x-3">
                  <Mail className="text-gray-400 w-5 h-5" />
                  <div>
                    <div className="text-gray-400 text-sm">Email</div>
                    <div className="text-white">{selectedUser.email}</div>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h4 className="text-white font-semibold text-lg">Informations système</h4>
                <div className="bg-gray-800 p-3 rounded">
                  <div className="text-gray-400 text-sm">ID utilisateur</div>
                  <div className="text-white font-mono text-sm">{selectedUser.id}</div>
                </div>
                <div className="bg-gray-800 p-3 rounded flex items-center space-x-3">
                  <Shield className={`w-5 h-5 ${selectedUser.role === 'admin' ? 'text-red-400' : 'text-gray-400'}`} />
                  <div>
                    <div className="text-gray-400 text-sm">Rôle</div>
                    <div className={`${selectedUser.role === 'admin' ? 'text-red-400 font-semibold' : 'text-white'}`}>
                      {selectedUser.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                    </div>
                  </div>
                </div>
                <div className="bg-gray-800 p-3 rounded flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-gray-400 text-sm">Créé le</div>
                    <div className="text-white">{formatDate(selectedUser.createdAt)}</div>
                  </div>
                </div>
                <div className="bg-gray-800 p-3 rounded flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-gray-400 text-sm">Dernière connexion</div>
                    <div className="text-white">{formatDate(selectedUser.lastLogin)}</div>
                  </div>
                </div>
              </section>
            </div>

            {/* Actions rapides */}
            {!isProtected(selectedUser.id) && (
              <div className="flex space-x-3 mt-6 border-t border-gray-700 pt-4">
                {selectedUser.role === 'admin' ? (
                  <button
                    onClick={() => {
                      handleDemoteUser(selectedUser.id);
                      setSelectedUser(null);
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded"
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
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
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
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
                >
                  <Trash2 size={16} />
                  <span>Supprimer</span>
                </button>
              </div>
            )}

            {isProtected(selectedUser.id) && (
              <div className="mt-6 p-4 bg-yellow-500/20 border border-yellow-500/50 rounded">
                <div className="flex items-center space-x-2 text-yellow-400 font-semibold">
                  <Lock className="w-5 h-5" />
                  <span>Administrateur protégé</span>
                </div>
                <p className="text-yellow-300 text-sm mt-1">
                  Cet utilisateur ne peut pas être supprimé ou rétrogradé.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80" onClick={() => setShowDeleteConfirm(null)} />

          <div className="relative bg-gray-900 rounded-xl shadow-lg max-w-md w-full border border-red-500/50 p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                <Trash2 size={24} className="text-red-400" />
              </div>
              <div>
                <h3 className="text-white text-lg font-bold">Supprimer l'utilisateur</h3>
                <p className="text-gray-400">Cette action est irréversible</p>
              </div>
            </div>

            <p className="text-gray-300 mb-6">
              Êtes-vous sûr de vouloir supprimer cet utilisateur ? Toutes ses données seront perdues définitivement.
            </p>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  handleDeleteUser(showDeleteConfirm);
                  setShowDeleteConfirm(null);
                }}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded"
              >
                Supprimer
              </button>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded"
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

export default UserManagement;
