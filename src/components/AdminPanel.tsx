import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Users, 
  Eye, 
  Trash2, 
  Search, 
  Filter,
  Calendar,
  Mail,
  User,
  Clock,
  Shield,
  Download,
  RefreshCw
} from 'lucide-react';
import { database } from '../services/database';
import { User as UserType } from '../types/user';

export const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'createdAt' | 'lastLogin' | 'email' | 'firstName'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const loadUsers = () => {
    const allUsers = database.getUsers();
    setUsers(allUsers);
    setFilteredUsers(allUsers);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    let filtered = users.filter(user => 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Tri
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy];
      let bValue: any = b[sortBy];

      if (sortBy === 'createdAt' || sortBy === 'lastLogin') {
        aValue = new Date(aValue || 0).getTime();
        bValue = new Date(bValue || 0).getTime();
      } else {
        aValue = aValue?.toLowerCase() || '';
        bValue = bValue?.toLowerCase() || '';
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredUsers(filtered);
  }, [users, searchTerm, sortBy, sortOrder]);

  const handleDeleteUser = (userId: string) => {
    const success = database.deleteUser(userId);
    if (success) {
      loadUsers();
      setShowDeleteConfirm(null);
      setSelectedUser(null);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Jamais';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportData = () => {
    const dataStr = JSON.stringify(users, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `modfusion-users-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const resetDatabase = () => {
    if (window.confirm('⚠️ ATTENTION ! Cette action supprimera TOUTES les données utilisateur. Cette action est irréversible. Êtes-vous sûr ?')) {
      database.reset();
      loadUsers();
      setSelectedUser(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-gray-900/90 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                <Database className="w-8 h-8 text-red-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Panneau d'Administration</h1>
                <p className="text-gray-400">Gestion de la base de données utilisateurs</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={loadUsers}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Actualiser</span>
              </button>
              
              <button
                onClick={exportData}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Exporter</span>
              </button>
              
              <button
                onClick={resetDatabase}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Reset DB</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="p-6 border-b border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <Users className="w-8 h-8 text-blue-400" />
                <div>
                  <div className="text-2xl font-bold text-white">{users.length}</div>
                  <div className="text-sm text-gray-300">Utilisateurs totaux</div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <Clock className="w-8 h-8 text-green-400" />
                <div>
                  <div className="text-2xl font-bold text-white">
                    {users.filter(u => u.lastLogin && new Date(u.lastLogin) > new Date(Date.now() - 24*60*60*1000)).length}
                  </div>
                  <div className="text-sm text-gray-300">Actifs (24h)</div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <Calendar className="w-8 h-8 text-purple-400" />
                <div>
                  <div className="text-2xl font-bold text-white">
                    {users.filter(u => new Date(u.createdAt) > new Date(Date.now() - 7*24*60*60*1000)).length}
                  </div>
                  <div className="text-sm text-gray-300">Nouveaux (7j)</div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-orange-500/20 to-orange-600/20 border border-orange-500/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <Shield className="w-8 h-8 text-orange-400" />
                <div>
                  <div className="text-2xl font-bold text-white">
                    {Math.round((users.length / 1000) * 100) / 100}KB
                  </div>
                  <div className="text-sm text-gray-300">Taille DB</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, email ou ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="createdAt">Date création</option>
                <option value="lastLogin">Dernière connexion</option>
                <option value="email">Email</option>
                <option value="firstName">Prénom</option>
              </select>
              
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white hover:bg-gray-700 transition-colors"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Utilisateur</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Email</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Créé le</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Dernière connexion</th>
                  <th className="text-left py-3 px-4 text-gray-300 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-semibold">
                            {user.firstName.charAt(0).toUpperCase()}{user.lastName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="text-white font-medium">{user.firstName} {user.lastName}</div>
                          <div className="text-gray-400 text-sm font-mono">{user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-300">{user.email}</td>
                    <td className="py-4 px-4 text-gray-300">{formatDate(user.createdAt)}</td>
                    <td className="py-4 px-4 text-gray-300">{formatDate(user.lastLogin)}</td>
                    <td className="py-4 px-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(user.id)}
                          className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">Aucun utilisateur trouvé</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedUser(null)} />
          
          <div className="relative bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-700 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Détails utilisateur</h2>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl font-bold">
                    {selectedUser.firstName.charAt(0).toUpperCase()}{selectedUser.lastName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedUser.firstName} {selectedUser.lastName}</h3>
                  <p className="text-gray-400">{selectedUser.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white">Informations personnelles</h4>
                  
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
                
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white">Informations système</h4>
                  
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-800/50 rounded-lg">
                      <div className="text-sm text-gray-400">ID utilisateur</div>
                      <div className="text-white font-mono text-sm">{selectedUser.id}</div>
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
              
              {/* Raw Data */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white">Données brutes (JSON)</h4>
                <pre className="p-4 bg-gray-800 rounded-lg text-sm text-gray-300 overflow-x-auto">
                  {JSON.stringify(selectedUser, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(null)} />
          
          <div className="relative bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md border border-red-500/50">
            <div className="p-6">
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
                Êtes-vous sûr de vouloir supprimer cet utilisateur ? Toutes ses données seront perdues définitivement.
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => handleDeleteUser(showDeleteConfirm)}
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
        </div>
      )}
    </div>
  );
};