'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Flex,
  Text,
  Skeleton,
  useToast,
  HStack,
  Image,
  Tooltip,
  Button,
} from '@chakra-ui/react';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  ChevronDownIcon,
  ChevronUpIcon,
  EditIcon,
  DeleteIcon,
  ViewIcon,
  SettingsIcon 
} from '@chakra-ui/icons';
import { useRouter } from 'next/navigation';
import { productService, ProductFilters } from '@/services/productService';
import { Product, ProductStatus } from '@/types/product';

const statusColors = {
  [ProductStatus.ACTIVE]: 'green',
  [ProductStatus.INACTIVE]: 'gray',
  [ProductStatus.OUT_OF_STOCK]: 'red',
};

const statusLabels = {
  [ProductStatus.ACTIVE]: 'Ativo',
  [ProductStatus.INACTIVE]: 'Inativo',
  [ProductStatus.OUT_OF_STOCK]: 'Sem estoque',
};

interface ProductTableProps {
  filters: ProductFilters;
  onPageChange: (page: number) => void;
  onSortChange: (sortBy: string, sortDirection: 'asc' | 'desc') => void;
  setIsLoading: (loading: boolean) => void;
}

export default function ProductTable({ 
  filters, 
  onPageChange, 
  onSortChange,
  setIsLoading 
}: ProductTableProps) {
  const router = useRouter();
  const toast = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [sortField, setSortField] = useState(filters.sortBy || 'name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(
    filters.sortDirection || 'asc'
  );

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setIsLoading(true);
        
        const response = await productService.getProducts({
          ...filters,
          sortBy: sortField,
          sortDirection: sortDirection,
        });
        
        setProducts(response.data);
        setPagination({
          total: response.total,
          page: response.page,
          limit: response.limit,
          totalPages: Math.ceil(response.total / response.limit),
        });
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        toast({
          title: 'Erro ao buscar produtos',
          description: 'Ocorreu um erro ao buscar os produtos. Tente novamente mais tarde.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [filters, sortField, sortDirection, toast, setIsLoading]);

  const handleSort = (field: string) => {
    if (field === sortField) {
      // Inverter a direção se clicar no mesmo campo
      const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
      setSortDirection(newDirection);
      onSortChange(field, newDirection);
    } else {
      // Novo campo, iniciar com ascendente
      setSortField(field);
      setSortDirection('asc');
      onSortChange(field, 'asc');
    }
  };

  const getSortIcon = (field: string) => {
    if (field !== sortField) return null;
    
    return sortDirection === 'asc' ? (
      <ChevronUpIcon ml={1} boxSize={4} />
    ) : (
      <ChevronDownIcon ml={1} boxSize={4} />
    );
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    onPageChange(newPage);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleViewProduct = (id: string) => {
    router.push(`/products/${id}`);
  };

  const handleEditProduct = (id: string) => {
    router.push(`/products/${id}/edit`);
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja excluir o produto "${name}"?`)) {
      try {
        await productService.deleteProduct(id);
        
        // Atualizar a lista removendo o produto excluído
        setProducts(prevProducts => 
          prevProducts.filter(product => product._id !== id)
        );
        
        toast({
          title: 'Produto excluído',
          description: `O produto "${name}" foi excluído com sucesso.`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        console.error('Erro ao excluir produto:', error);
        toast({
          title: 'Erro ao excluir produto',
          description: 'Ocorreu um erro ao excluir o produto. Tente novamente.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const handleUpdateStatus = async (id: string, status: ProductStatus) => {
    try {
      const updatedProduct = await productService.updateProductStatus(id, status);
      
      // Atualiza o status na lista local
      setProducts(prevProducts => 
        prevProducts.map(product => 
          product._id === id 
            ? { ...product, status } 
            : product
        )
      );
      
      toast({
        title: 'Status atualizado',
        description: 'O status do produto foi atualizado com sucesso.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast({
        title: 'Erro ao atualizar status',
        description: 'Ocorreu um erro ao atualizar o status do produto.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return (
      <Box>
        <Skeleton height="40px" mb={4} />
        <Skeleton height="300px" />
      </Box>
    );
  }

  if (products.length === 0) {
    return (
      <Box textAlign="center" py={10} bg="white" borderRadius="md" shadow="sm">
        <Text fontSize="lg" mb={4}>Nenhum produto encontrado</Text>
        <Text mb={4}>Tente ajustar os filtros ou crie um novo produto.</Text>
        <Button 
          colorScheme="blue" 
          onClick={() => router.push('/products/new')}
        >
          Criar Produto
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box overflowX="auto" bg="white" borderRadius="md" shadow="sm">
        <Table variant="simple" size="sm">
          <Thead>
            <Tr>
              <Th width="60px"></Th>
              <Th 
                cursor="pointer" 
                onClick={() => handleSort('name')}
                userSelect="none"
              >
                <Flex align="center">
                  Nome {getSortIcon('name')}
                </Flex>
              </Th>
              <Th 
                cursor="pointer" 
                onClick={() => handleSort('sku')}
                userSelect="none"
              >
                <Flex align="center">
                  SKU {getSortIcon('sku')}
                </Flex>
              </Th>
              <Th 
                cursor="pointer" 
                onClick={() => handleSort('price')}
                isNumeric
                userSelect="none"
              >
                <Flex align="center" justify="flex-end">
                  Preço {getSortIcon('price')}
                </Flex>
              </Th>
              <Th 
                cursor="pointer" 
                onClick={() => handleSort('stock')}
                isNumeric
                userSelect="none"
              >
                <Flex align="center" justify="flex-end">
                  Estoque {getSortIcon('stock')}
                </Flex>
              </Th>
              <Th>Categoria</Th>
              <Th>Status</Th>
              <Th width="60px">Ações</Th>
            </Tr>
          </Thead>
          <Tbody>
            {products.map((product) => (
              <Tr 
                key={product._id} 
                _hover={{ bg: 'gray.50' }}
              >
                <Td>
                  {product.images && product.images.length > 0 ? (
                    <Image 
                      src={product.images.find(img => img.isMain)?.url || product.images[0].url}
                      alt={product.name}
                      boxSize="40px"
                      objectFit="cover"
                      borderRadius="md"
                      fallbackSrc="https://via.placeholder.com/40"
                    />
                  ) : (
                    <Box 
                      width="40px" 
                      height="40px" 
                      bg="gray.200" 
                      borderRadius="md" 
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Text fontSize="xs" color="gray.500">N/A</Text>
                    </Box>
                  )}
                </Td>
                <Td fontWeight="medium">
                  <Text 
                    cursor="pointer" 
                    onClick={() => handleViewProduct(product._id)}
                    _hover={{ color: 'blue.500', textDecoration: 'underline' }}
                  >
                    {product.name}
                  </Text>
                  {product.hasVariants && (
                    <Text fontSize="xs" color="gray.500">
                      {product.variants?.length || 0} variantes
                    </Text>
                  )}
                </Td>
                <Td>{product.sku}</Td>
                <Td isNumeric>{formatCurrency(product.price)}</Td>
                <Td isNumeric>
                  <Badge 
                    colorScheme={product.stock > 10 ? 'green' : product.stock > 0 ? 'yellow' : 'red'}
                  >
                    {product.stock}
                  </Badge>
                </Td>
                <Td>{product.categoryName || '-'}</Td>
                <Td>
                  <Badge colorScheme={statusColors[product.status]}>
                    {statusLabels[product.status]}
                  </Badge>
                </Td>
                <Td>
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      icon={<SettingsIcon />}
                      variant="ghost"
                      size="sm"
                      aria-label="Opções"
                    />
                    <MenuList>
                      <MenuItem 
                        icon={<ViewIcon />}
                        onClick={() => handleViewProduct(product._id)}
                      >
                        Visualizar
                      </MenuItem>
                      <MenuItem 
                        icon={<EditIcon />}
                        onClick={() => handleEditProduct(product._id)}
                      >
                        Editar
                      </MenuItem>
                      {product.status !== ProductStatus.ACTIVE && (
                        <MenuItem 
                          onClick={() => handleUpdateStatus(product._id, ProductStatus.ACTIVE)}
                        >
                          Marcar como ativo
                        </MenuItem>
                      )}
                      {product.status !== ProductStatus.INACTIVE && (
                        <MenuItem 
                          onClick={() => handleUpdateStatus(product._id, ProductStatus.INACTIVE)}
                        >
                          Marcar como inativo
                        </MenuItem>
                      )}
                      {product.status !== ProductStatus.OUT_OF_STOCK && product.stock === 0 && (
                        <MenuItem 
                          onClick={() => handleUpdateStatus(product._id, ProductStatus.OUT_OF_STOCK)}
                        >
                          Marcar sem estoque
                        </MenuItem>
                      )}
                      <MenuItem 
                        icon={<DeleteIcon />}
                        color="red.500"
                        onClick={() => handleDeleteProduct(product._id, product.name)}
                      >
                        Excluir
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* Paginação */}
      <Flex justify="space-between" align="center" mt={4}>
        <Text fontSize="sm">
          Mostrando {(pagination.page - 1) * pagination.limit + 1} a{' '}
          {Math.min(pagination.page * pagination.limit, pagination.total)} de {pagination.total} produtos
        </Text>

        <HStack>
          <IconButton
            icon={<ChevronLeftIcon />}
            aria-label="Página anterior"
            size="sm"
            isDisabled={pagination.page === 1}
            onClick={() => handlePageChange(pagination.page - 1)}
          />
          <Text fontSize="sm">
            Página {pagination.page} de {pagination.totalPages || 1}
          </Text>
          <IconButton
            icon={<ChevronRightIcon />}
            aria-label="Próxima página"
            size="sm"
            isDisabled={pagination.page === pagination.totalPages}
            onClick={() => handlePageChange(pagination.page + 1)}
          />
        </HStack>
      </Flex>
    </Box>
  );
} 