import { useState, useEffect } from 'react';
import { User, LoginCredentials, RegisterData } from '../types/user';
import { database } from '../services/database';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier si un utilisateur est déjà connecté
    try {
      const currentUser = database.getCurrentUser();
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
      setLoading(true);
      
      // Validation des entrées
      if (!credentials.email?.trim() || !credentials.password?.trim()) {
        return { success: false, error: 'Veuillez remplir tous les champs' };
      }

      // Validation de l'email
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
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      
      // Validation des champs obligatoires
      if (!data.email?.trim() || !data.firstName?.trim() || !data.lastName?.trim() || 
          !data.password?.trim() || !data.confirmPassword?.trim()) {
        return { success: false, error: 'Veuillez remplir tous les champs obligatoires' };
      }

      // Validation de l'email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email.trim())) {
        return { success: false, error: 'Veuillez entrer une adresse email valide' };
      }

      // Validation du mot de passe
      if (data.password.length < 6) {
        return { success: false, error: 'Le mot de passe doit contenir au moins 6 caractères' };
      }

      if (data.password !== data.confirmPassword) {
        return { success: false, error: 'Les mots de passe ne correspondent pas' };
      }

      // Validation des noms (pas de caractères spéciaux)
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
    } finally {
      setLoading(false);
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
      // Validation des données
      if (updates.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(updates.email.trim())) {
          return { success: false, error: 'Veuillez entrer une adresse email valide' };
        }
        updates.email = updates.email.toLowerCase().trim();
      }

      if (updates.firstName) {
        const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/;
        if (!nameRegex.test(updates.firstName.trim())) {
          return { success: false, error: 'Le prénom contient des caractères non valides' };
        }
        updates.firstName = updates.firstName.trim();
      }

      if (updates.lastName) {
        const nameRegex = /^[a-zA-ZÀ-ÿ\s'-]+$/;
        if (!nameRegex.test(updates.lastName.trim())) {
          return { success: false, error: 'Le nom contient des caractères non valides' };
        }
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