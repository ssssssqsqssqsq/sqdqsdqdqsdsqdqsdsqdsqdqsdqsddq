export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  createdAt: string;
  lastLogin?: string;
  avatar?: string;
  role: 'user' | 'admin';
  adminCode?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
  adminCode?: string;
}