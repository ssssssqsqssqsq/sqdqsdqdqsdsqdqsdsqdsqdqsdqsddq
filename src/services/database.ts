import { User } from '../types/user';

class LocalDatabase {
  private readonly USERS_KEY = 'modfusion_users';
  private readonly CURRENT_USER_KEY = 'modfusion_current_user';
  private readonly PROTECTED_ADMIN_ID = 'mc557wr25jsbl84c3ol';

  // Récupérer tous les utilisateurs
  getUsers(): User[] {
    const users = localStorage.getItem(this.USERS_KEY);
    return users ? JSON.parse(users) : [];
  }

  // Sauvegarder tous les utilisateurs
  private saveUsers(users: User[]): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  // Créer un nouvel utilisateur
  createUser(userData: Omit<User, 'id' | 'createdAt' | 'role'>): User {
    const users = this.getUsers();
    
    // Vérifier si l'email existe déjà
    if (users.some(user => user.email === userData.email)) {
      throw new Error('Un compte avec cette adresse email existe déjà');
    }

    const newUser: User = {
      ...userData,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      role: 'user', // Tous les nouveaux utilisateurs sont des utilisateurs normaux
    };

    users.push(newUser);
    this.saveUsers(users);
    
    // Connecter automatiquement l'utilisateur après inscription
    this.setCurrentUser(newUser);
    
    return newUser;
  }

  // Authentifier un utilisateur
  authenticateUser(email: string, password: string): User | null {
    const users = this.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      // Mettre à jour la dernière connexion
      user.lastLogin = new Date().toISOString();
      this.saveUsers(users);
      this.setCurrentUser(user);
      return user;
    }
    
    return null;
  }

  // Définir l'utilisateur actuel
  setCurrentUser(user: User): void {
    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
  }

  // Récupérer l'utilisateur actuel
  getCurrentUser(): User | null {
    const user = localStorage.getItem(this.CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  // Déconnecter l'utilisateur
  logout(): void {
    localStorage.removeItem(this.CURRENT_USER_KEY);
  }

  // Mettre à jour un utilisateur
  updateUser(userId: string, updates: Partial<User>): User | null {
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) return null;
    
    users[userIndex] = { ...users[userIndex], ...updates };
    this.saveUsers(users);
    
    // Mettre à jour l'utilisateur actuel si c'est lui qui est modifié
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      this.setCurrentUser(users[userIndex]);
    }
    
    return users[userIndex];
  }

  // Supprimer un utilisateur (avec protection pour l'admin principal)
  deleteUser(userId: string): boolean {
    // Protéger l'admin principal
    if (userId === this.PROTECTED_ADMIN_ID) {
      return false;
    }

    const users = this.getUsers();
    const filteredUsers = users.filter(u => u.id !== userId);
    
    if (filteredUsers.length === users.length) return false;
    
    this.saveUsers(filteredUsers);
    
    // Déconnecter si c'est l'utilisateur actuel
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      this.logout();
    }
    
    return true;
  }

  // Promouvoir un utilisateur en admin par ID (pour les admins)
  promoteToAdminById(userId: string): boolean {
    const users = this.getUsers();
    const user = users.find(u => u.id === userId);
    
    if (!user) return false;
    
    const updatedUser = this.updateUser(userId, { role: 'admin' });
    return !!updatedUser;
  }

  // Rétrograder un admin en utilisateur normal (avec protection pour l'admin principal)
  demoteFromAdmin(userId: string): boolean {
    // Protéger l'admin principal
    if (userId === this.PROTECTED_ADMIN_ID) {
      return false;
    }

    const updatedUser = this.updateUser(userId, { role: 'user' });
    return !!updatedUser;
  }

  // Vérifier si un utilisateur est l'admin protégé
  isProtectedAdmin(userId: string): boolean {
    return userId === this.PROTECTED_ADMIN_ID;
  }

  // Créer l'admin principal s'il n'existe pas
  ensureProtectedAdminExists(): void {
    const users = this.getUsers();
    const protectedAdmin = users.find(u => u.id === this.PROTECTED_ADMIN_ID);
    
    if (!protectedAdmin) {
      const adminUser: User = {
        id: this.PROTECTED_ADMIN_ID,
        email: 'admin@modfusion.com',
        firstName: 'Super',
        lastName: 'Admin',
        password: 'admin123',
        createdAt: new Date().toISOString(),
        role: 'admin'
      };
      
      users.push(adminUser);
      this.saveUsers(users);
    }
  }

  // Générer un ID unique
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Réinitialiser la base de données (pour le développement)
  reset(): void {
    localStorage.removeItem(this.USERS_KEY);
    localStorage.removeItem(this.CURRENT_USER_KEY);
    // Recréer l'admin protégé après reset
    this.ensureProtectedAdminExists();
  }
}

export const database = new LocalDatabase();

// S'assurer que l'admin protégé existe au démarrage
database.ensureProtectedAdminExists();