'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
  HStack,
  Grid,
  GridItem,
  useToast,
  InputGroup,
  InputLeftElement,
  Collapse,
  useDisclosure,
} from '@chakra-ui/react';
import { SearchIcon, ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { ProductStatus } from '@/types/product';
import { ProductFilters as ProductFilterType } from '@/services/productService';
import { productService } from '@/services/productService';

interface ProductFiltersProps {
  filters: ProductFilterType;
  onFilterChange: (filters: Partial<ProductFilterType>) => void;
  isDisabled?: boolean;
}

export default function ProductFilters({
  filters,
  onFilterChange,
  isDisabled = false,
}: ProductFiltersProps) {
  const toast = useToast();
  const { isOpen, onToggle } = useDisclosure();
  const formRef = useRef<HTMLFormElement>(null);
  const [categories, setCategories] = useState<Array<{ _id: string; name: string }>>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const response = await productService.getCategories();
        setCategories(response.data);
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
        toast({
          title: 'Erro ao carregar categorias',
          description: 'Não foi possível carregar as categorias. Tente novamente mais tarde.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [toast]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    const search = formData.get('search') as string;
    const status = formData.get('status') as string;
    const categoryId = formData.get('categoryId') as string;
    const minStock = formData.get('minStock') as string;
    const maxStock = formData.get('maxStock') as string;
    const minPrice = formData.get('minPrice') as string;
    const maxPrice = formData.get('maxPrice') as string;
    const hasVariants = formData.get('hasVariants') as string;

    onFilterChange({
      search: search || undefined,
      status: status !== 'all' ? status as ProductStatus : undefined,
      categoryId: categoryId !== 'all' ? categoryId : undefined,
      minStock: minStock ? Number(minStock) : undefined,
      maxStock: maxStock ? Number(maxStock) : undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      hasVariants: hasVariants === 'true' ? true : hasVariants === 'false' ? false : undefined,
    });
  };

  const handleReset = () => {
    if (formRef.current) {
      formRef.current.reset();
    }

    onFilterChange({
      search: '',
      status: undefined,
      categoryId: undefined,
      minStock: undefined,
      maxStock: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      hasVariants: undefined,
    });
  };

  return (
    <Box as="form" ref={formRef} onSubmit={handleSearch} bg="white" p={4} borderRadius="md" shadow="sm">
      <Stack spacing={4}>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input 
            name="search" 
            placeholder="Buscar por nome, SKU ou descrição" 
            defaultValue={filters.search || ''}
            isDisabled={isDisabled}
          />
        </InputGroup>

        <Flex justifyContent="space-between" alignItems="center">
          <HStack spacing={4}>
            <FormControl maxW="200px">
              <Select
                name="status"
                defaultValue={filters.status || 'all'}
                size="sm"
                isDisabled={isDisabled}
              >
                <option value="all">Todos os Status</option>
                <option value={ProductStatus.ACTIVE}>Ativos</option>
                <option value={ProductStatus.INACTIVE}>Inativos</option>
                <option value={ProductStatus.OUT_OF_STOCK}>Sem estoque</option>
              </Select>
            </FormControl>

            <FormControl maxW="240px">
              <Select
                name="categoryId"
                defaultValue={filters.categoryId || 'all'}
                size="sm"
                isDisabled={isDisabled || isLoadingCategories}
              >
                <option value="all">Todas as Categorias</option>
                {categories.map(category => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </Select>
            </FormControl>
          </HStack>

          <Button 
            size="sm" 
            rightIcon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
            onClick={onToggle}
            variant="ghost"
          >
            Filtros avançados
          </Button>
        </Flex>

        <Collapse in={isOpen} animateOpacity>
          <Grid templateColumns="repeat(4, 1fr)" gap={4} mt={2}>
            <GridItem>
              <FormControl>
                <FormLabel fontSize="sm">Preço Mínimo</FormLabel>
                <Input
                  name="minPrice"
                  type="number"
                  defaultValue={filters.minPrice || ''}
                  size="sm"
                  min={0}
                  step={0.01}
                  isDisabled={isDisabled}
                />
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl>
                <FormLabel fontSize="sm">Preço Máximo</FormLabel>
                <Input
                  name="maxPrice"
                  type="number"
                  defaultValue={filters.maxPrice || ''}
                  size="sm"
                  min={0}
                  step={0.01}
                  isDisabled={isDisabled}
                />
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl>
                <FormLabel fontSize="sm">Estoque Mínimo</FormLabel>
                <Input
                  name="minStock"
                  type="number"
                  defaultValue={filters.minStock || ''}
                  size="sm"
                  min={0}
                  isDisabled={isDisabled}
                />
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl>
                <FormLabel fontSize="sm">Estoque Máximo</FormLabel>
                <Input
                  name="maxStock"
                  type="number"
                  defaultValue={filters.maxStock || ''}
                  size="sm"
                  min={0}
                  isDisabled={isDisabled}
                />
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl>
                <FormLabel fontSize="sm">Possui Variantes</FormLabel>
                <Select
                  name="hasVariants"
                  defaultValue={
                    filters.hasVariants === undefined
                      ? 'all'
                      : filters.hasVariants
                      ? 'true'
                      : 'false'
                  }
                  size="sm"
                  isDisabled={isDisabled}
                >
                  <option value="all">Todos</option>
                  <option value="true">Sim</option>
                  <option value="false">Não</option>
                </Select>
              </FormControl>
            </GridItem>
          </Grid>
        </Collapse>

        <Flex justify="flex-end" gap={2}>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleReset}
            isDisabled={isDisabled}
          >
            Limpar
          </Button>
          <Button
            type="submit"
            size="sm"
            colorScheme="blue"
            isLoading={isDisabled}
            loadingText="Filtrando..."
          >
            Aplicar Filtros
          </Button>
        </Flex>
      </Stack>
    </Box>
  );
} 