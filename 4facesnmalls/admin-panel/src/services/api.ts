import axios from 'axios';

// Definir URL base conforme ambiente
const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Criar instância do axios
export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptador para adicionar token às requisições
api.interceptors.request.use(
  (config) => {
    // Verificar se está no cliente (browser)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptador para lidar com tokens expirados
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Verificar se o erro é de token expirado (401) e se não é uma tentativa de refresh
    if (error.response?.status === 401 && !originalRequest._retry && typeof window !== 'undefined') {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (!refreshToken) {
          // Se não tiver refresh token, redirecionar para login
          window.location.href = '/login';
          return Promise.reject(error);
        }
        
        // Tentar obter novo token
        const response = await axios.post(`${baseURL}/auth/refresh`, {
          refreshToken,
        });
        
        const { accessToken, refreshToken: newRefreshToken } = response.data;
        
        // Salvar novos tokens
        localStorage.setItem('token', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        
        // Configurar novo token e tentar novamente
        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        
        return api(originalRequest);
      } catch (refreshError) {
        // Falha ao renovar token, redirecionar para login
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
); 