import { useState, useEffect } from 'react';
import { User, LoginCredentials, RegisterData } from '../types/user';
import { database } from '../services/database';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const currentUser = database.getCurrentUser();
      console.log("useAuth - utilisateur récupéré:", currentUser);
      setUser(currentUser);
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'utilisateur:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!credentials.email?.trim() || !credentials.password?.trim()) {
        return { success: false, error: 'Veuillez remplir tous les champs' };
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(credentials.email.trim())) {
        return { success: false, error: 'Veuillez entrer une adresse email valide' };
      }

      const authenticatedUser = database.authenticateUser(
        credentials.email.trim(),
        credentials.password
      );

      if (authenticatedUser) {
        setUser(authenticatedUser);
        return { success: true };
      } else {
        return { success: false, error: 'Email ou mot de passe incorrect' };
      }
    } catch (error) {
      console.error('Erreur de connexion:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur lors de la connexion'
      };
    }
  };

  const register = async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!data.email?.trim() || !data.firstName?.trim() || !data.lastName?.trim() ||
        !data.password?.trim() || !data.confirmPassword?.trim()) {
        return { success: false, error: 'Veuillez remplir tous les champs obligatoires' };
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email.trim())) {
        return { success: false, error: 'Veuillez entrer une adresse email valide' };
      }

      if (data.password.length < 6) {
        return { success: false, error: 'Le mot de passe doit contenir au moins 6 caractères' };
      }

      if (data.password !== data.confirmPassword) {
        return { success: false, error: 'Les mots de passe ne correspondent pas' };
      }

      const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/;
      if (!nameRegex.test(data.firstName.trim())) {
        return { success: false, error: 'Le prénom contient des caractères non valides' };
      }

      if (!nameRegex.test(data.lastName.trim())) {
        return { success: false, error: 'Le nom contient des caractères non valides' };
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
    }
  };

  const logout = () => {
    try {
      database.logout();
      setUser(null);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const updateProfile = async (updates: Partial<User>): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'Utilisateur non connecté' };

    try {
      console.log("updateProfile - Données à mettre à jour :", updates);

      if (updates.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(updates.email.trim())) {
          return { success: false, error: 'Veuillez entrer une adresse email valide' };
        }
        updates.email = updates.email.toLowerCase().trim();
      }

      const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/;

      if (updates.firstName) {
        if (!nameRegex.test(updates.firstName.trim())) {
          return { success: false, error: 'Le prénom contient des caractères non valides' };
        }
        updates.firstName = updates.firstName.trim();
      }

      if (updates.lastName) {
        if (!nameRegex.test(updates.lastName.trim())) {
          return { success: false, error: 'Le nom contient des caractères non valides' };
        }
        updates.lastName = updates.lastName.trim();
      }

      const updatedUser = database.updateUser(user.id, updates);
      console.log("updateProfile - Utilisateur mis à jour :", updatedUser);

      if (updatedUser) {
        setUser(updatedUser);
        return { success: true };
      }

      return { success: false, error: 'Erreur lors de la mise à jour' };
    } catch (error) {
      console.error('Erreur de mise à jour:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur lors de la mise à jour du profil'
      };
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
