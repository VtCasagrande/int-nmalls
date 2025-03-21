import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<User> {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      const { accessToken, refreshToken, user } = response.data;
      
      // Salvar tokens e dados do usuário
      await AsyncStorage.setItem('@AuthToken', accessToken);
      await AsyncStorage.setItem('@RefreshToken', refreshToken);
      await AsyncStorage.setItem('@UserData', JSON.stringify(user));
      
      return user;
    } catch (error) {
      throw this.handleError(error);
    }
  }
  
  async logout(): Promise<void> {
    try {
      // Remover tokens e dados do usuário
      await AsyncStorage.removeItem('@AuthToken');
      await AsyncStorage.removeItem('@RefreshToken');
      await AsyncStorage.removeItem('@UserData');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  }
  
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem('@AuthToken');
      return !!token;
    } catch (error) {
      return false;
    }
  }
  
  async getCurrentUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem('@UserData');
      if (userData) {
        return JSON.parse(userData);
      }
      return null;
    } catch (error) {
      return null;
    }
  }
  
  private handleError(error: any): Error {
    if (error.response) {
      // Erro da API com resposta
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          return new Error('Credenciais inválidas. Verifique seu e-mail e senha.');
        case 403:
          return new Error('Você não tem permissão para acessar este recurso.');
        default:
          return new Error(data.message || 'Ocorreu um erro. Tente novamente mais tarde.');
      }
    } else if (error.request) {
      // Erro de conexão
      return new Error('Não foi possível conectar ao servidor. Verifique sua conexão com a internet.');
    } else {
      // Erro geral
      return new Error(error.message || 'Ocorreu um erro inesperado.');
    }
  }
}

export default new AuthService(); 