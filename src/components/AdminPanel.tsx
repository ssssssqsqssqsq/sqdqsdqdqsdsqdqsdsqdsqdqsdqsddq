import React, { useState, useEffect } from 'react';

interface UserType {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: Date;
  lastLogin: Date;
}

const database = {
  users: [
    {
      id: '1',
      firstName: 'Alice',
      lastName: 'Durand',
      email: 'alice@example.com',
      role: 'admin',
      createdAt: new Date('2023-01-01T10:00:00'),
      lastLogin: new Date('2025-06-15T12:00:00'),
    },
    {
      id: '2',
      firstName: 'Bob',
      lastName: 'Martin',
      email: 'bob@example.com',
      role: 'user',
      createdAt: new Date('2024-02-20T09:00:00'),
      lastLogin: new Date('2025-06-19T14:00:00'),
    },
  ] as UserType[],

  getUsers() {
    return [...this.users];
  },

  promoteToAdmin(id: string) {
    this.users = this.users.map(u =>
      u.id === id ? { ...u, role: 'admin' } : u
    );
  },

  demoteToUser(id: string) {
    if (this.isProtectedAdmin(id)) return;
    this.users = this.users.map(u =>
      u.id === id ? { ...u, role: 'user' } : u
    );
  },

  deleteUser(id: string) {
    if (this.isProtectedAdmin(id)) return;
    this.users = this.users.filter(u => u.id !== id);
  },

  isProtectedAdmin(id: string) {
    return id === '1'; // exemple d’admin protégé
  },
};

function formatDate(date: Date) {
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    setUsers(database.getUsers());
  }, []);

  const refreshUsers = () => setUsers(database.getUsers());

  const filteredUsers = users.filter(u =>
    u.firstName.toLowerCase().includes(filter.toLowerCase()) ||
    u.lastName.toLowerCase().includes(filter.toLowerCase()) ||
    u.email.toLowerCase().includes(filter.toLowerCase())
  );

  const handlePromoteUser = (id: string) => {
    database.promoteToAdmin(id);
    refreshUsers();
  };

  const handleDemoteUser = (id: string) => {
    database.demoteToUser(id);
    refreshUsers();
  };

  const handleDeleteUser = (id: string) => {
    database.deleteUser(id);
    refreshUsers();
    setShowDeleteConfirm(null);
    if (selectedUser?.id === id) setSelectedUser(null);
  };

  return (
    <div style={{ padding: 24, backgroundColor: '#111', color: 'white', minHeight: '100vh' }}>
      <h1 style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 24 }}>Administration des utilisateurs</h1>

      <input
        type="text"
        placeholder="Rechercher un utilisateur..."
        value={filter}
        onChange={e => setFilter(e.target.value)}
        style={{
          marginBottom: 16,
          padding: 8,
          borderRadius: 6,
          border: 'none',
          width: '100%',
          maxWidth: 400,
          backgroundColor: '#222',
          color: 'white',
        }}
      />

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #444' }}>
            <th style={{ padding: 12, textAlign: 'left' }}>Utilisateur</th>
            <th style={{ padding: 12, textAlign: 'left' }}>Email</th>
            <th style={{ padding: 12, textAlign: 'left' }}>Rôle</th>
            <th style={{ padding: 12, textAlign: 'left' }}>Créé le</th>
            <th style={{ padding: 12, textAlign: 'left' }}>Dernière connexion</th>
            <th style={{ padding: 12, textAlign: 'left' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length === 0 && (
            <tr>
              <td colSpan={6} style={{ padding: 24, textAlign: 'center', color: '#777' }}>
                Aucun utilisateur trouvé
              </td>
            </tr>
          )}
          {filteredUsers.map(user => (
            <tr key={user.id} style={{ borderBottom: '1px solid #444' }}>
              <td style={{ padding: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: user.role === 'admin' ? 'linear-gradient(90deg, #f97316, #dc2626)' : 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontWeight: 'bold',
                  color: 'white',
                }}>
                  {user.firstName.charAt(0).toUpperCase()}{user.lastName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div>{user.firstName} {user.lastName}</div>
                  <div style={{ fontSize: 12, fontFamily: 'monospace', color: '#666' }}>{user.id}</div>
                </div>
              </td>
              <td style={{ padding: 12 }}>{user.email}</td>
              <td style={{ padding: 12 }}>
                <span style={{
                  backgroundColor: user.role === 'admin' ? 'rgba(220, 38, 38, 0.3)' : 'rgba(107, 114, 128, 0.3)',
                  color: user.role === 'admin' ? '#dc2626' : '#6b7280',
                  padding: '4px 8px',
                  borderRadius: 9999,
                  fontWeight: '600',
                  fontSize: 12,
                }}>
                  {user.role.toUpperCase()}
                </span>
              </td>
              <td style={{ padding: 12 }}>{formatDate(user.createdAt)}</td>
              <td style={{ padding: 12 }}>{formatDate(user.lastLogin)}</td>
              <td style={{ padding: 12, display: 'flex', gap: 8 }}>
                <button onClick={() => setSelectedUser(user)} title="Voir détails" style={buttonStyle}>Voir</button>

                {user.role === 'admin' ? (
                  <button
                    onClick={() => handleDemoteUser(user.id)}
                    disabled={database.isProtectedAdmin(user.id)}
                    title={database.isProtectedAdmin(user.id) ? "Administrateur protégé" : "Rétrograder"}
                    style={{
                      ...buttonStyle,
                      backgroundColor: database.isProtectedAdmin(user.id) ? '#555' : '#ea580c',
                      cursor: database.isProtectedAdmin(user.id) ? 'not-allowed' : 'pointer',
                    }}
                  >
                    Rétrograder
                  </button>
                ) : (
                  <button onClick={() => handlePromoteUser(user.id)} title="Promouvoir admin" style={{ ...buttonStyle, backgroundColor: '#22c55e' }}>
                    Promouvoir
                  </button>
                )}

                <button
                  onClick={() => setShowDeleteConfirm(user.id)}
                  disabled={database.isProtectedAdmin(user.id)}
                  title={database.isProtectedAdmin(user.id) ? "Administrateur protégé" : "Supprimer"}
                  style={{
                    ...buttonStyle,
                    backgroundColor: database.isProtectedAdmin(user.id) ? '#555' : '#dc2626',
                    cursor: database.isProtectedAdmin(user.id) ? 'not-allowed' : 'pointer',
                  }}
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal détails utilisateur */}
      {selectedUser && (
        <div style={modalOverlayStyle} onClick={() => setSelectedUser(null)}>
          <div style={modalContentStyle} onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedUser(null)} style={closeButtonStyle}>×</button>
            <h2 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Détails utilisateur</h2>

            <div style={{ display: 'flex', gap: 16, marginBottom: 24, alignItems: 'center' }}>
              <div style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: selectedUser.role === 'admin' ? 'linear-gradient(90deg, #f97316, #dc2626)' : 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontWeight: 'bold',
                color: 'white',
                fontSize: 24,
              }}>
                {selectedUser.firstName.charAt(0).toUpperCase()}{selectedUser.lastName.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: 20, fontWeight: '600' }}>{selectedUser.firstName} {selectedUser.lastName}</div>
                <div style={{ color: '#777' }}>{selectedUser.email}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
              <div style={{ minWidth: 200 }}>
                <h3 style={{ fontWeight: '600', marginBottom: 8 }}>Informations personnelles</h3>
                <p><strong>Prénom:</strong> {selectedUser.firstName}</p>
                <p><strong>Nom:</strong> {selectedUser.lastName}</p>
                <p><strong>Email:</strong> {selectedUser.email}</p>
              </div>
              <div style={{ minWidth: 200 }}>
                <h3 style={{ fontWeight: '600', marginBottom: 8 }}>Informations système</h3>
                <p><strong>ID utilisateur:</strong> <code>{selectedUser.id}</code></p>
                <p><strong>Rôle:</strong> {selectedUser.role === 'admin' ? 'Administrateur' : 'Utilisateur'}</p>
                <p><strong>Créé le:</strong> {formatDate(selectedUser.createdAt)}</p>
                <p><strong>Dernière connexion:</strong> {formatDate(selectedUser.lastLogin)}</p>
              </div>
            </div>

            {!database.isProtectedAdmin(selectedUser.id) ? (
              <div style={{ marginTop: 24, display: 'flex', gap: 16 }}>
                {selectedUser.role === 'admin' ? (
                  <button
                    onClick={() => { handleDemoteUser(selectedUser.id); setSelectedUser(null); }}
                    style={{ ...buttonStyle, backgroundColor: '#ea580c' }}
                  >
                    Rétrograder
                  </button>
                ) : (
                  <button
                    onClick={() => { handlePromoteUser(selectedUser.id); setSelectedUser(null); }}
                    style={{ ...buttonStyle, backgroundColor: '#22c55e' }}
                  >
                    Promouvoir Admin
                  </button>
                )}
                <button
                  onClick={() => { setShowDeleteConfirm(selectedUser.id); setSelectedUser(null); }}
                  style={{ ...buttonStyle, backgroundColor: '#dc2626' }}
                >
                  Supprimer
                </button>
              </div>
            ) : (
              <div style={{ marginTop: 24, padding: 12, borderRadius: 6, backgroundColor: 'rgba(202, 138, 4, 0.3)', color: '#ca8a04' }}>
                Administrateur protégé — suppression et rétrogradation interdites.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Confirmation suppression */}
      {showDeleteConfirm && (
        <div style={modalOverlayStyle} onClick={() => setShowDeleteConfirm(null)}>
          <div style={{ ...modalContentStyle, maxWidth: 400, borderColor: '#dc2626' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 20, fontWeight: 'bold', color: '#dc2626', marginBottom: 16 }}>Supprimer l'utilisateur</h3>
            <p style={{ marginBottom: 24 }}>Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.</p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => { if (showDeleteConfirm) { handleDeleteUser(showDeleteConfirm); } }}
                style={{ ...buttonStyle, backgroundColor: '#dc2626' }}
              >
                Supprimer
              </button>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                style={{ ...buttonStyle, backgroundColor: '#555' }}
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

const buttonStyle: React.CSSProperties = {
  padding: '6px 12px',
  borderRadius: 6,
  border: 'none',
  color: 'white',
  cursor: 'pointer',
  fontWeight: '600',
};

const modalOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0,0,0,0.8)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 24,
  zIndex: 9999,
};

const modalContentStyle: React.CSSProperties = {
  position: 'relative',
  backgroundColor: '#222',
  padding: 24,
  borderRadius: 12,
  maxWidth: '90vw',
  maxHeight: '90vh',
  overflowY: 'auto',
  border: '2px solid #444',
};

const closeButtonStyle: React.CSSProperties = {
  position: 'absolute',
  top: 12,
  right: 12,
  background: 'transparent',
  border: 'none
