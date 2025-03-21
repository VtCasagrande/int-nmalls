import axios from 'axios';
import { getSession } from 'next-auth/react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token de autenticação às requisições
apiClient.interceptors.request.use(async (config) => {
  try {
    const session = await getSession();
    
    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }
    
    return config;
  } catch (error) {
    return Promise.reject(error);
  }
});

// Interceptor para lidar com erros de resposta
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Se receber erro 401 e não for uma requisição de refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Tenta obter uma nova sessão (que deve atualizar o token)
        const session = await getSession();
        
        if (session?.accessToken) {
          // Atualiza o token na requisição original
          originalRequest.headers.Authorization = `Bearer ${session.accessToken}`;
          // Refaz a requisição original com o novo token
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
); 