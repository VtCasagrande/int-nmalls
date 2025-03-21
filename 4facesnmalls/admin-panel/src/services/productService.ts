import { apiClient } from '@/lib/apiClient';
import { Product, ProductCategory, ProductStatus } from '@/types/product';

export interface ProductFilters {
  search?: string;
  categoryId?: string;
  status?: ProductStatus;
  minStock?: number;
  maxStock?: number;
  minPrice?: number;
  maxPrice?: number;
  hasVariants?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface ProductListResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
}

export interface CategoryListResponse {
  data: ProductCategory[];
  total: number;
}

export const productService = {
  // Produtos
  async getProducts(filters: ProductFilters = {}): Promise<ProductListResponse> {
    const response = await apiClient.get('/products', { params: filters });
    return response.data;
  },

  async getProductById(id: string): Promise<Product> {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },

  async createProduct(product: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const response = await apiClient.post('/products', product);
    return response.data;
  },

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    const response = await apiClient.patch(`/products/${id}`, product);
    return response.data;
  },

  async deleteProduct(id: string): Promise<void> {
    await apiClient.delete(`/products/${id}`);
  },

  async updateProductStatus(id: string, status: ProductStatus): Promise<Product> {
    const response = await apiClient.patch(`/products/${id}/status`, { status });
    return response.data;
  },

  async updateProductStock(id: string, stock: number): Promise<Product> {
    const response = await apiClient.patch(`/products/${id}/stock`, { stock });
    return response.data;
  },

  // Categorias
  async getCategories(): Promise<CategoryListResponse> {
    const response = await apiClient.get('/products/categories');
    return response.data;
  },

  async getCategoryById(id: string): Promise<ProductCategory> {
    const response = await apiClient.get(`/products/categories/${id}`);
    return response.data;
  },

  async createCategory(category: Omit<ProductCategory, '_id'>): Promise<ProductCategory> {
    const response = await apiClient.post('/products/categories', category);
    return response.data;
  },

  async updateCategory(id: string, category: Partial<ProductCategory>): Promise<ProductCategory> {
    const response = await apiClient.patch(`/products/categories/${id}`, category);
    return response.data;
  },

  async deleteCategory(id: string): Promise<void> {
    await apiClient.delete(`/products/categories/${id}`);
  },

  // Upload de imagem
  async uploadProductImage(productId: string, imageFile: File): Promise<ProductListResponse> {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await apiClient.post(`/products/${productId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },

  async deleteProductImage(productId: string, imageUrl: string): Promise<void> {
    await apiClient.delete(`/products/${productId}/images`, {
      data: { url: imageUrl },
    });
  },

  async setMainProductImage(productId: string, imageUrl: string): Promise<Product> {
    const response = await apiClient.patch(`/products/${productId}/images/main`, {
      url: imageUrl,
    });
    
    return response.data;
  },
}; 