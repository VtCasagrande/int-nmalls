"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/services/api";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextProps {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Verificar se o usuário está autenticado ao carregar a página
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setIsLoading(false);
          return;
        }
        
        // Configurar o token no cabeçalho da API
        api.defaults.headers.common.Authorization = `Bearer ${token}`;
        
        // Buscar dados do usuário
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        
        if (userData && userData.id) {
          setUser(userData);
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const response = await api.post('/auth/login', { email, password });
      const { accessToken, refreshToken, user } = response.data;
      
      // Salvar tokens e dados do usuário
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Configurar o token no cabeçalho da API
      api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
      
      setUser(user);
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Erro ao fazer login:', error);
      
      const errorMessage = error.response?.data?.message || 
        'Ocorreu um erro ao fazer login. Verifique suas credenciais.';
        
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    delete api.defaults.headers.common.Authorization;
    router.push('/login');
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  
  return context;
} 