import axios from 'axios';

// Defina o URL base da API conforme seu ambiente
const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://api.nmalls.com.br' // URL para produção
  : 'http://localhost:3000'; // URL para desenvolvimento local

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptador para adicionar token de autenticação
api.interceptors.request.use(
  async (config) => {
    // Obter token do storage do Chrome
    const token = await new Promise<string | null>((resolve) => {
      chrome.storage.local.get(['authToken'], (result) => {
        resolve(result.authToken || null);
      });
    });
    
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
        const refreshToken = await new Promise<string | null>((resolve) => {
          chrome.storage.local.get(['refreshToken'], (result) => {
            resolve(result.refreshToken || null);
          });
        });
        
        if (!refreshToken) {
          throw new Error('Refresh token not available');
        }
        
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        });
        
        // Salvar os novos tokens
        const { accessToken, refreshToken: newRefreshToken } = response.data;
        
        chrome.storage.local.set({
          authToken: accessToken,
          refreshToken: newRefreshToken,
        });
        
        // Refazer a requisição original com o novo token
        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Se falhar ao obter novo token, deslogar o usuário
        chrome.storage.local.remove(['authToken', 'refreshToken', 'userData']);
        
        // Aqui poderia ser adicionada uma ação para notificar o usuário
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api; 