import { useState, useEffect } from 'react';
import { User, LoginCredentials, RegisterData } from '../types/user';
import { database } from '../services/database';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier si un utilisateur est déjà connecté
    const currentUser = database.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      
      if (!credentials.email || !credentials.password) {
        return { success: false, error: 'Veuillez remplir tous les champs' };
      }

      const authenticatedUser = database.authenticateUser(credentials.email, credentials.password);
      
      if (authenticatedUser) {
        setUser(authenticatedUser);
        return { success: true };
      } else {
        return { success: false, error: 'Email ou mot de passe incorrect' };
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      return { success: false, error: 'Erreur lors de la connexion' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      
      // Validation des champs
      if (!data.email || !data.firstName || !data.lastName || !data.password || !data.confirmPassword) {
        return { success: false, error: 'Veuillez remplir tous les champs obligatoires' };
      }

      if (data.password !== data.confirmPassword) {
        return { success: false, error: 'Les mots de passe ne correspondent pas' };
      }

      if (data.password.length < 6) {
        return { success: false, error: 'Le mot de passe doit contenir au moins 6 caractères' };
      }

      // Validation de l'email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        return { success: false, error: 'Veuillez entrer une adresse email valide' };
      }

      const newUser = database.createUser({
        email: data.email.toLowerCase().trim(),
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        password: data.password,
      });

      setUser(newUser);
      return { success: true };
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur lors de l\'inscription' 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    database.logout();
    setUser(null);
  };

  const updateProfile = async (updates: Partial<User>): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'Utilisateur non connecté' };

    try {
      // Validation des données
      if (updates.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(updates.email)) {
          return { success: false, error: 'Veuillez entrer une adresse email valide' };
        }
        updates.email = updates.email.toLowerCase().trim();
      }

      if (updates.firstName) {
        updates.firstName = updates.firstName.trim();
      }

      if (updates.lastName) {
        updates.lastName = updates.lastName.trim();
      }

      const updatedUser = database.updateUser(user.id, updates);
      if (updatedUser) {
        setUser(updatedUser);
        return { success: true };
      }
      return { success: false, error: 'Erreur lors de la mise à jour' };
    } catch (error) {
      console.error('Erreur de mise à jour:', error);
      return { success: false, error: 'Erreur lors de la mise à jour du profil' };
    }
  };

  return {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };
};