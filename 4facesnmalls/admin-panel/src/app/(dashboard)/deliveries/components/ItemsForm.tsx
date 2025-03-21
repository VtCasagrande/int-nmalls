'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  HStack,
  Text,
  Divider,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  InputGroup,
  InputRightElement,
  Spinner,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Flex,
  Badge,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon, SearchIcon } from '@chakra-ui/icons';
import { Delivery, DeliveryItem } from '@/types/delivery';
import { useDebounce } from '@/lib/hooks/useDebounce';

// Simulação de interface de produto
interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
}

// Simulação do serviço de produtos
const productService = {
  async searchProducts(query: string): Promise<Product[]> {
    // Em um ambiente real, isso faria uma chamada à API
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulação de delay
    
    if (!query) return [];
    
    // Dados simulados
    const mockProducts: Product[] = [
      { _id: '1', name: 'Camisa Básica', price: 49.90, stock: 20 },
      { _id: '2', name: 'Calça Jeans', price: 99.90, stock: 15 },
      { _id: '3', name: 'Tênis Casual', price: 159.90, stock: 10 },
      { _id: '4', name: 'Boné Ajustável', price: 39.90, stock: 25 },
      { _id: '5', name: 'Meias Kit 3 pares', price: 29.90, stock: 30 },
    ];
    
    return mockProducts.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase())
    );
  }
};

interface ItemsFormProps {
  formData: Partial<Delivery>;
  updateFormData: (data: Partial<Delivery>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function ItemsForm({ formData, updateFormData, onNext, onBack }: ItemsFormProps) {
  const toast = useToast();
  const [items, setItems] = useState<DeliveryItem[]>(formData.items || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentItem, setCurrentItem] = useState<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
  }>({
    productId: '',
    name: '',
    price: 0,
    quantity: 1,
  });
  
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    const searchProducts = async () => {
      if (!debouncedSearchTerm) {
        setSearchResults([]);
        return;
      }
      
      try {
        setIsSearching(true);
        const results = await productService.searchProducts(debouncedSearchTerm);
        setSearchResults(results);
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        toast({
          title: 'Erro na busca',
          description: 'Não foi possível buscar os produtos. Tente novamente.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsSearching(false);
      }
    };

    searchProducts();
  }, [debouncedSearchTerm, toast]);

  const handleSelectProduct = (product: Product) => {
    setCurrentItem({
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
    });
    setSearchTerm('');
    setSearchResults([]);
  };

  const handleQuantityChange = (value: string) => {
    const quantity = parseInt(value, 10) || 1;
    setCurrentItem(prev => ({
      ...prev,
      quantity: quantity,
    }));
  };

  const handleAddItem = () => {
    if (!currentItem.productId) {
      toast({
        title: 'Selecione um produto',
        description: 'É necessário selecionar um produto para adicionar.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    // Verifica se o produto já está na lista
    const existingItemIndex = items.findIndex(item => item.productId === currentItem.productId);
    
    if (existingItemIndex >= 0) {
      // Atualiza a quantidade do item existente
      const updatedItems = [...items];
      updatedItems[existingItemIndex].quantity += currentItem.quantity;
      setItems(updatedItems);
      
      toast({
        title: 'Item atualizado',
        description: `Quantidade de ${currentItem.name} atualizada.`,
        status: 'info',
        duration: 2000,
        isClosable: true,
      });
    } else {
      // Adiciona um novo item
      setItems(prev => [...prev, { ...currentItem }]);
      
      toast({
        title: 'Item adicionado',
        description: `${currentItem.name} adicionado à entrega.`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    }
    
    // Limpa o item atual
    setCurrentItem({
      productId: '',
      name: '',
      price: 0,
      quantity: 1,
    });
  };

  const handleRemoveItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
    
    toast({
      title: 'Item removido',
      description: 'Item removido da entrega.',
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleContinue = () => {
    if (items.length === 0) {
      toast({
        title: 'Nenhum item adicionado',
        description: 'É necessário adicionar pelo menos um item à entrega.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    updateFormData({ items });
    onNext();
  };

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        <Text fontSize="lg" fontWeight="medium">Itens da Entrega</Text>

        <Box>
          <FormControl mb={4}>
            <FormLabel>Buscar produto</FormLabel>
            <InputGroup>
              <Input
                placeholder="Digite o nome do produto"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <InputRightElement>
                {isSearching ? <Spinner size="sm" /> : <SearchIcon color="gray.400" />}
              </InputRightElement>
            </InputGroup>
          </FormControl>

          {searchResults.length > 0 && (
            <Box boxShadow="md" borderRadius="md" p={3} bg="white" mb={4}>
              <Table size="sm" variant="simple">
                <Thead>
                  <Tr>
                    <Th>Produto</Th>
                    <Th isNumeric>Preço</Th>
                    <Th isNumeric>Estoque</Th>
                    <Th width="80px">Ações</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {searchResults.map((product) => (
                    <Tr 
                      key={product._id} 
                      cursor="pointer" 
                      _hover={{ bg: 'gray.50' }}
                    >
                      <Td>{product.name}</Td>
                      <Td isNumeric>R$ {product.price.toFixed(2)}</Td>
                      <Td isNumeric>
                        <Badge 
                          colorScheme={product.stock > 0 ? 'green' : 'red'}
                        >
                          {product.stock}
                        </Badge>
                      </Td>
                      <Td>
                        <Button
                          size="xs"
                          colorScheme="blue"
                          leftIcon={<AddIcon />}
                          onClick={() => handleSelectProduct(product)}
                          isDisabled={product.stock <= 0}
                        >
                          Add
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          )}

          {currentItem.productId && (
            <Flex 
              mb={4} 
              p={4} 
              bg="blue.50" 
              borderRadius="md" 
              align="center"
              justifyContent="space-between"
            >
              <Box flex="1">
                <Text fontWeight="bold">{currentItem.name}</Text>
                <Text>R$ {currentItem.price.toFixed(2)}</Text>
              </Box>
              
              <HStack>
                <FormControl width="120px">
                  <FormLabel fontSize="sm">Quantidade</FormLabel>
                  <NumberInput 
                    min={1} 
                    max={99} 
                    value={currentItem.quantity}
                    onChange={handleQuantityChange}
                    size="sm"
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
                
                <Button
                  colorScheme="blue"
                  onClick={handleAddItem}
                  size="sm"
                  mt={7}
                >
                  Adicionar
                </Button>
              </HStack>
            </Flex>
          )}

          {items.length > 0 ? (
            <Box>
              <Text fontWeight="bold" mb={2}>Itens adicionados</Text>
              <Table size="sm" variant="simple">
                <Thead>
                  <Tr>
                    <Th>Produto</Th>
                    <Th isNumeric>Preço</Th>
                    <Th isNumeric>Qtd</Th>
                    <Th isNumeric>Subtotal</Th>
                    <Th width="50px"></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {items.map((item, index) => (
                    <Tr key={index}>
                      <Td>{item.name}</Td>
                      <Td isNumeric>R$ {item.price.toFixed(2)}</Td>
                      <Td isNumeric>{item.quantity}</Td>
                      <Td isNumeric>R$ {(item.price * item.quantity).toFixed(2)}</Td>
                      <Td>
                        <IconButton
                          aria-label="Remover item"
                          icon={<DeleteIcon />}
                          size="xs"
                          colorScheme="red"
                          variant="ghost"
                          onClick={() => handleRemoveItem(index)}
                        />
                      </Td>
                    </Tr>
                  ))}
                  <Tr fontWeight="bold">
                    <Td colSpan={3} textAlign="right">Subtotal:</Td>
                    <Td isNumeric>R$ {calculateSubtotal().toFixed(2)}</Td>
                    <Td></Td>
                  </Tr>
                </Tbody>
              </Table>
            </Box>
          ) : (
            <Box textAlign="center" py={4} bg="gray.50" borderRadius="md">
              <Text>Nenhum item adicionado à entrega</Text>
            </Box>
          )}
        </Box>

        <Divider />

        <HStack justify="space-between" spacing={4}>
          <Button variant="outline" onClick={onBack}>
            Voltar
          </Button>
          <Button 
            colorScheme="blue" 
            onClick={handleContinue}
            isDisabled={items.length === 0}
          >
            Continuar
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
} 