import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Defina o URL base da API conforme seu ambiente
const API_URL = __DEV__
  ? 'http://localhost:3000' // URL para desenvolvimento local
  : 'https://api.nmalls.com.br'; // URL para produção

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptador para adicionar token de autenticação
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('@AuthToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptador para lidar com erros de autenticação (token expirado, etc)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Se o erro for 401 (Unauthorized) e não for uma tentativa de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Tentar obter novo token usando o refresh token
        const refreshToken = await AsyncStorage.getItem('@RefreshToken');
        if (!refreshToken) {
          throw new Error('Refresh token not available');
        }
        
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        });
        
        // Salvar os novos tokens
        const { accessToken, refreshToken: newRefreshToken } = response.data;
        await AsyncStorage.setItem('@AuthToken', accessToken);
        await AsyncStorage.setItem('@RefreshToken', newRefreshToken);
        
        // Refazer a requisição original com o novo token
        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Se falhar ao obter novo token, deslogar o usuário
        await AsyncStorage.removeItem('@AuthToken');
        await AsyncStorage.removeItem('@RefreshToken');
        await AsyncStorage.removeItem('@UserData');
        
        // Aqui poderia ser adicionada uma chamada para redirecionar para a tela de login
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api; 