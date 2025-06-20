<tbody>
  {filteredUsers.map((user) => {
    const isProtected = database.isProtectedAdmin(user.id);
    const isAdmin = user.role === 'admin';

    const roleBadge = (
      <div
        className={`px-2 py-1 rounded-full border text-xs font-medium ${
          isAdmin
            ? 'bg-red-500/20 border-red-500/50 text-red-400'
            : 'bg-gray-500/20 border-gray-500/50 text-gray-400'
        }`}
      >
        {isAdmin ? 'ADMIN' : 'USER'}
      </div>
    );

    const avatarBg = isAdmin
      ? 'bg-gradient-to-r from-orange-500 to-red-600'
      : 'bg-gradient-to-r from-blue-500 to-purple-600';

    return (
      <tr key={user.id} className="hover:bg-white/5">
        <td className="py-4 px-4">
          <div className="flex items-center space-x-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${avatarBg}`}
            >
              <span className="text-white text-sm font-semibold">
                {user.firstName[0]?.toUpperCase()}
                {user.lastName[0]?.toUpperCase()}
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-white font-medium">
                  {user.firstName} {user.lastName}
                </span>
                {isProtected && (
                  <Lock className="w-4 h-4 text-yellow-400" title="Administrateur protégé" />
                )}
              </div>
              <div className="text-gray-400 text-sm font-mono">{user.id}</div>
            </div>
          </div>
        </td>

        <td className="py-4 px-4 text-gray-300">{user.email}</td>
        <td className="py-4 px-4">{roleBadge}</td>
        <td className="py-4 px-4 text-gray-300">{formatDate(user.createdAt)}</td>
        <td className="py-4 px-4 text-gray-300">{formatDate(user.lastLogin)}</td>

        <td className="py-4 px-4">
          <div className="flex space-x-2">
            {/* Voir les détails */}
            <button
              onClick={() => setSelectedUser(user)}
              className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              title="Voir les détails"
            >
              <Eye className="w-4 h-4" />
            </button>

            {/* Promouvoir / rétrograder */}
            {isAdmin ? (
              <button
                onClick={() => handleDemoteUser(user.id)}
                disabled={isProtected}
                className={`p-2 text-white rounded-lg transition-colors ${
                  isProtected
                    ? 'bg-gray-500 cursor-not-allowed'
                    : 'bg-orange-600 hover:bg-orange-700'
                }`}
                title={isProtected ? 'Administrateur protégé' : 'Rétrograder'}
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

            {/* Supprimer */}
            <button
              onClick={() => setShowDeleteConfirm(user.id)}
              disabled={isProtected}
              className={`p-2 text-white rounded-lg transition-colors ${
                isProtected
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
              title={isProtected ? 'Administrateur protégé' : 'Supprimer'}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>
    );
  })}
</tbody>
