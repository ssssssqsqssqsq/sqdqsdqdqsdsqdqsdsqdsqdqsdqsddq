import { User } from '../types/user';

interface CreateUserData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

class DatabaseService {
  private readonly STORAGE_KEY = 'modfusion_users';
  private readonly CURRENT_USER_KEY = 'modfusion_current_user';
  private readonly PROTECTED_ADMINS = ['admin@modfusion.com'];

  constructor() {
    this.initializeDatabase();
  }

  private initializeDatabase(): void {
    // Créer un admin par défaut s'il n'existe pas
    const users = this.getUsers();
    const adminExists = users.some(user => user.email === 'admin@modfusion.com');
    
    if (!adminExists) {
      const adminUser: User = {
        id: 'admin-' + Date.now(),
        email: 'admin@modfusion.com',
        firstName: 'Admin',
        lastName: 'ModFusion',
        password: 'admin123', // En production, ceci devrait être hashé
        role: 'admin',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };
      
      const existingUsers = this.getUsers();
      existingUsers.push(adminUser);
      this.saveUsers(existingUsers);
    }
  }

  private saveUsers(users: User[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des utilisateurs:', error);
    }
  }

  getUsers(): User[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      return [];
    }
  }

  createUser(userData: CreateUserData): User {
    const users = this.getUsers();
    
    // Vérifier si l'email existe déjà
    const existingUser = users.find(user => user.email.toLowerCase() === userData.email.toLowerCase());
    if (existingUser) {
      throw new Error('Un compte avec cette adresse email existe déjà');
    }

    // Créer le nouvel utilisateur
    const newUser: User = {
      id: 'user-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
      email: userData.email.toLowerCase().trim(),
      firstName: userData.firstName.trim(),
      lastName: userData.lastName.trim(),
      password: userData.password, // En production, ceci devrait être hashé
      role: 'user',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };

    users.push(newUser);
    this.saveUsers(users);
    
    // Connecter automatiquement l'utilisateur
    this.setCurrentUser(newUser);
    
    return newUser;
  }

  authenticateUser(email: string, password: string): User | null {
    const users = this.getUsers();
    const user = users.find(u => 
      u.email.toLowerCase() === email.toLowerCase() && 
      u.password === password
    );

    if (user) {
      // Mettre à jour la dernière connexion
      user.lastLogin = new Date().toISOString();
      this.updateUser(user.id, { lastLogin: user.lastLogin });
      this.setCurrentUser(user);
      return user;
    }

    return null;
  }

  getCurrentUser(): User | null {
    try {
      const data = localStorage.getItem(this.CURRENT_USER_KEY);
      if (!data) return null;
      
      const userData = JSON.parse(data);
      
      // Vérifier que l'utilisateur existe toujours dans la base
      const users = this.getUsers();
      const currentUser = users.find(u => u.id === userData.id);
      
      if (currentUser) {
        // Retourner les données les plus récentes
        return currentUser;
      } else {
        // L'utilisateur n'existe plus, nettoyer le localStorage
        this.logout();
        return null;
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur actuel:', error);
      this.logout();
      return null;
    }
  }

  private setCurrentUser(user: User): void {
    try {
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'utilisateur actuel:', error);
    }
  }

  updateUser(userId: string, updates: Partial<User>): User | null {
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) return null;

    // Vérifier l'email unique si on le modifie
    if (updates.email) {
      const emailExists = users.some(u => 
        u.id !== userId && 
        u.email.toLowerCase() === updates.email!.toLowerCase()
      );
      if (emailExists) {
        throw new Error('Cette adresse email est déjà utilisée');
      }
    }

    // Appliquer les mises à jour
    users[userIndex] = { ...users[userIndex], ...updates };
    this.saveUsers(users);

    // Mettre à jour l'utilisateur actuel si c'est lui
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      this.setCurrentUser(users[userIndex]);
    }

    return users[userIndex];
  }

  deleteUser(userId: string): boolean {
    if (this.isProtectedAdmin(userId)) {
      return false;
    }

    const users = this.getUsers();
    const filteredUsers = users.filter(u => u.id !== userId);
    
    if (filteredUsers.length !== users.length) {
      this.saveUsers(filteredUsers);
      
      // Si l'utilisateur supprimé était connecté, le déconnecter
      const currentUser = this.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        this.logout();
      }
      
      return true;
    }
    
    return false;
  }

  promoteToAdminById(userId: string): boolean {
    return !!this.updateUser(userId, { role: 'admin' });
  }

  demoteFromAdmin(userId: string): boolean {
    if (this.isProtectedAdmin(userId)) {
      return false;
    }
    return !!this.updateUser(userId, { role: 'user' });
  }

  isProtectedAdmin(userId: string): boolean {
    const users = this.getUsers();
    const user = users.find(u => u.id === userId);
    return user ? this.PROTECTED_ADMINS.includes(user.email) : false;
  }

  logout(): void {
    try {
      localStorage.removeItem(this.CURRENT_USER_KEY);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  }

  reset(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      localStorage.removeItem(this.CURRENT_USER_KEY);
      this.initializeDatabase();
    } catch (error) {
      console.error('Erreur lors de la réinitialisation:', error);
    }
  }

  // Méthodes utilitaires pour les statistiques
  getStats() {
    const users = this.getUsers();
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    return {
      totalUsers: users.length,
      admins: users.filter(u => u.role === 'admin').length,
      activeToday: users.filter(u => 
        u.lastLogin && new Date(u.lastLogin) > oneDayAgo
      ).length,
      newThisWeek: users.filter(u => 
        new Date(u.createdAt) > oneWeekAgo
      ).length
    };
  }
}

export const database = new DatabaseService();