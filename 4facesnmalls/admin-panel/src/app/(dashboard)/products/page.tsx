'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Flex,
  Heading,
  useToast,
  HStack,
  Text,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import ProductTable from './components/ProductTable';
import ProductFilters from './components/ProductFilters';
import { ProductStatus } from '@/types/product';
import { ProductFilters as ProductFilterType } from '@/services/productService';

export default function ProductsPage() {
  const router = useRouter();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<ProductFilterType>({
    search: '',
    status: undefined,
    categoryId: undefined,
    minStock: undefined,
    maxStock: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    page: 1,
    limit: 10,
    sortBy: 'name',
    sortDirection: 'asc'
  });

  const handleFilterChange = (newFilters: Partial<ProductFilterType>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1 // Volta para a primeira página quando os filtros mudam
    }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
  };

  const handleSortChange = (sortBy: string, sortDirection: 'asc' | 'desc') => {
    setFilters(prev => ({
      ...prev,
      sortBy,
      sortDirection,
      page: 1
    }));
  };

  const handleCreateProduct = () => {
    router.push('/products/new');
  };

  return (
    <Box p={4}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">Produtos</Heading>
        <HStack spacing={3}>
          <Button 
            leftIcon={<AddIcon />} 
            colorScheme="blue"
            size="sm"
            onClick={handleCreateProduct}
          >
            Novo Produto
          </Button>
          {/* Menu de opções adicionais para produtos */}
        </HStack>
      </Flex>

      <ProductFilters 
        filters={filters} 
        onFilterChange={handleFilterChange} 
        isDisabled={isLoading}
      />

      <Box mt={6}>
        <ProductTable 
          filters={filters}
          onPageChange={handlePageChange}
          onSortChange={handleSortChange}
          setIsLoading={setIsLoading}
        />
      </Box>
    </Box>
  );
} 