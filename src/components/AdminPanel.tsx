import React, { useState } from 'react';
import { User, Mail, Shield, Calendar, Clock, Lock, Trash2, UserPlus, UserMinus, Eye, Users } from 'react-feather';

// Simule ta base de données / helpers
const database = {
  isProtectedAdmin: (id) => id === 'admin-123', // exemple d'admin protégé
};

// Fonction de formatage de date simple
const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return isNaN(d) ? '-' : d.toLocaleDateString('fr-FR') + ' ' + d.toLocaleTimeString('fr-FR');
};

// Composant Avatar utilisateur
const UserAvatar = ({ user }) => {
  const bgClass = user.role === 'admin' 
    ? 'bg-gradient-to-r from-orange-500 to-red-600' 
    : 'bg-gradient-to-r from-blue-500 to-purple-600';

  return (
    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${bgClass}`}>
      <span className="text-white text-sm font-semibold">
        {user.firstName.charAt(0).toUpperCase()}{user.lastName.charAt(0).toUpperCase()}
      </span>
    </div>
  );
};

// Ligne d'utilisateur
const UserRow = ({ user, onViewDetails, onPromote, onDemote, onDelete }) => {
  const isProtected = database.isProtectedAdmin(user.id);

  return (
    <tr className="border-b border-gray-700">
      <td className="py-4 px-4">
        <div className="flex items-center space-x-3">
          <UserAvatar user={user} />
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-white font-medium">{user.firstName} {user.lastName}</span>
              {isProtected && <Lock className="w-4 h-4 text-yellow-400" title="Administrateur protégé" />}
            </div>
            <div className="text-gray-400 text-sm font-mono">{user.id}</div>
          </div>
        </div>
      </td>
      <td className="py-4 px-4 text-gray-300">{user.email}</td>
      <td className="py-4 px-4">
        <div className="flex items-center space-x-2">
          {user.role === 'admin' ? (
            <div className="px-2 py-1 bg-red-500/20 border border-red-500/50 rounded-full">
              <span className="text-red-400 text-xs font-medium">ADMIN</span>
            </div>
          ) : (
            <div className="px-2 py-1 bg-gray-500/20 border border-gray-500/50 rounded-full">
              <span className="text-gray-400 text-xs font-medium">USER</span>
            </div>
          )}
        </div>
      </td>
      <td className="py-4 px-4 text-gray-300">{formatDate(user.createdAt)}</td>
      <td className="py-4 px-4 text-gray-300">{formatDate(user.lastLogin)}</td>
      <td className="py-4 px-4">
        <div className="flex space-x-2">
          <button
            onClick={() => onViewDetails(user)}
            className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            title="Voir les détails"
            aria-label={`Voir les détails de ${user.firstName} ${user.lastName}`}
          >
            <Eye className="w-4 h-4" />
          </button>

          {user.role === 'admin' ? (
            <button
              onClick={() => onDemote(user.id)}
              disabled={isProtected}
              className={`p-2 text-white rounded-lg transition-colors ${
                isProtected ? 'bg-gray-500 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700'
              }`}
              title={isProtected ? "Administrateur protégé" : "Rétrograder"}
              aria-label={isProtected ? "Administrateur protégé" : "Rétrograder l'utilisateur"}
            >
              <UserMinus className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => onPromote(user.id)}
              className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              title="Promouvoir admin"
              aria-label="Promouvoir en administrateur"
            >
              <UserPlus className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => onDelete(user.id)}
            disabled={isProtected}
            className={`p-2 text-white rounded-lg transition-colors ${
              isProtected ? 'bg-gray-500 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
            }`}
            title={isProtected ? "Administrateur protégé" : "Supprimer"}
            aria-label={isProtected ? "Administrateur protégé" : "Supprimer l'utilisateur"}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

// Modal détails utilisateur
const UserDetailModal = ({ user, onClose, onPromote, onDemote, onDelete }) => {
  if (!user) return null;
  const isProtected = database.isProtectedAdmin(user.id);

  const avatarBg = user.role === 'admin' 
    ? 'bg-gradient-to-r from-orange-500 to-red-600' 
    : 'bg-gradient-to-r from-blue-500 to-purple-600';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-700 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <h2 id="modal-title" className="text-2xl font-bold text-white">Détails utilisateur</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors" aria-label="Fermer la fenêtre">✕</button>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center space-x-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${avatarBg}`}>
              <span className="text-white text-xl font-bold">
                {user.firstName.charAt(0).toUpperCase()}{user.lastName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h3 className="text-xl font-bold text-white">{user.firstName} {user.lastName}</h3>
                {user.role === 'admin' && (
                  <div className="px-3 py-1 bg-red-500/20 border border-red-500/50 rounded-full">
                    <span className="text-red-400 text-sm font-medium">ADMIN</span>
                  </div>
                )}
                {isProtected && (
                  <div className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/50 rounded-full">
                    <span className="text-yellow-400 text-sm font-medium">PROTÉGÉ</span>
                  </div>
                )}
              </div>
              <p className="text-gray-400">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-white mb-3">Informations personnelles</h4>
              <div className="space-y-3">
                {[
                  { icon: <User className="w-5 h-5 text-gray-400" />, label: 'Prénom', value: user.firstName },
                  { icon: <User className="w-5 h-5 text-gray-400" />, label: 'Nom', value: user.lastName },
                  { icon: <Mail className="w-5 h-5 text-gray-400" />, label: 'Email', value: user.email },
                ].map(({ icon, label, value }) => (
                  <div key={label} className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
                    {icon}
                    <div>
                      <div className="text-sm text-gray-400">{label}</div>
                      <div className="text-white">{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-3">Informations système</h4>
              <div className="space-y-3">
                <div className="p-3 bg-gray-800/50 rounded-lg">
                  <div className="text-sm text-gray-400">ID utilisateur</div>
                  <div className="text-white font-mono text-sm">{user.id}</div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
                  <Shield className={`w-5 h-5 ${user.role === 'admin' ? 'text-red-400' : 'text-gray-400'}`} />
                  <div>
                    <div className="text-sm text-gray-400">Rôle</div>
                    <div className={`font-medium ${user.role === 'admin' ? 'text-red-400' : 'text-white'}`}>
                      {user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-400">Créé le</div>
                    <div className="text-white">{formatDate(user.createdAt)}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-400">Dernière connexion</div>
                    <div className="text-white">{formatDate(user.lastLogin)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions rapides */}
          {!isProtected ? (
            <div className="flex space-x-3 pt-4 border-t border-gray-700">
              {user.role === 'admin' ? (
                <button
                  onClick={() => { onDemote(user.id); onClose(); }}
                  className="flex items-center space-x-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
                >
                  <UserMinus className="w-4 h-4" />
                  <span>Rétrograder</span>
                </button>
              ) : (
                <button
                  onClick={() => { onPromote(user.id); onClose(); }}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Promouvoir Admin</span>
                </button>
              )}
              <button
                onClick={() => { onDelete(user.id); onClose(); }}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Supprimer</span>
              </button>
            </div>
          ) : (
            <div className="p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
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
    </div>
  );
};

// Modal confirmation suppression
const DeleteConfirmModal = ({ userId, onConfirm, onCancel }) => {
  if (!userId) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="alertdialog" aria-modal="true" aria-labelledby="delete-title" aria-describedby="delete-desc">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md border border-red-500/50">
        <div className="p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
              <Trash2 className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h3 id="delete-title" className="text-lg font-bold text-white">Supprimer l'utilisateur</h3>
              <p className="text-gray-400">Cette action est irréversible</p>
            </
