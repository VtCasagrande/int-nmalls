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
  InputGroup,
  InputRightElement,
  Spinner,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Radio,
  RadioGroup,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { Delivery } from '@/types/delivery';
import { useDebounce } from '@/lib/hooks/useDebounce';

// Este serviço precisará ser implementado
interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

// Simulação do serviço de cliente
const customerService = {
  async searchCustomers(query: string): Promise<Customer[]> {
    // Em um ambiente real, isso faria uma chamada à API
    // Para simulação, retornamos dados fictícios
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulação de delay
    
    if (!query) return [];
    
    // Dados simulados
    const mockCustomers: Customer[] = [
      { _id: '1', name: 'João Silva', email: 'joao@example.com', phone: '(11) 99999-9999' },
      { _id: '2', name: 'Maria Oliveira', email: 'maria@example.com', phone: '(11) 88888-8888' },
      { _id: '3', name: 'Pedro Santos', email: 'pedro@example.com', phone: '(11) 77777-7777' },
    ];
    
    return mockCustomers.filter(c => 
      c.name.toLowerCase().includes(query.toLowerCase()) || 
      c.email.toLowerCase().includes(query.toLowerCase()) ||
      c.phone.includes(query)
    );
  }
};

interface CustomerFormProps {
  formData: Partial<Delivery>;
  updateFormData: (data: Partial<Delivery>) => void;
  onNext: () => void;
}

export default function CustomerForm({ formData, updateFormData, onNext }: CustomerFormProps) {
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    formData.customerId ? { 
      _id: formData.customerId, 
      name: formData.customerName || '', 
      email: '', 
      phone: '' 
    } : null
  );
  
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    const searchCustomers = async () => {
      if (!debouncedSearchTerm) {
        setSearchResults([]);
        return;
      }
      
      try {
        setIsSearching(true);
        const results = await customerService.searchCustomers(debouncedSearchTerm);
        setSearchResults(results);
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
        toast({
          title: 'Erro na busca',
          description: 'Não foi possível buscar os clientes. Tente novamente.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsSearching(false);
      }
    };

    searchCustomers();
  }, [debouncedSearchTerm, toast]);

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    updateFormData({
      customerId: customer._id,
      customerName: customer.name,
    });
    setSearchTerm('');
    setSearchResults([]);
  };

  const handleContinue = () => {
    if (!selectedCustomer) {
      toast({
        title: 'Selecione um cliente',
        description: 'É necessário selecionar um cliente para continuar.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    onNext();
  };

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        <Text fontSize="lg" fontWeight="medium">Selecione o cliente para a entrega</Text>

        <FormControl>
          <FormLabel>Buscar cliente</FormLabel>
          <InputGroup>
            <Input
              placeholder="Digite nome, email ou telefone do cliente"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <InputRightElement>
              {isSearching ? <Spinner size="sm" /> : <SearchIcon color="gray.400" />}
            </InputRightElement>
          </InputGroup>
        </FormControl>

        {searchResults.length > 0 && (
          <Box boxShadow="md" borderRadius="md" p={3} bg="white">
            <Table size="sm" variant="simple">
              <Thead>
                <Tr>
                  <Th width="40px"></Th>
                  <Th>Nome</Th>
                  <Th>Email</Th>
                  <Th>Telefone</Th>
                </Tr>
              </Thead>
              <Tbody>
                {searchResults.map((customer) => (
                  <Tr 
                    key={customer._id} 
                    cursor="pointer" 
                    _hover={{ bg: 'gray.50' }}
                    onClick={() => handleSelectCustomer(customer)}
                  >
                    <Td>
                      <Radio 
                        isChecked={selectedCustomer?._id === customer._id}
                        onChange={() => {}}
                        colorScheme="blue"
                      />
                    </Td>
                    <Td>{customer.name}</Td>
                    <Td>{customer.email}</Td>
                    <Td>{customer.phone}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}

        {selectedCustomer && (
          <Box borderRadius="md" p={4} bg="blue.50" borderWidth="1px" borderColor="blue.200">
            <Text fontWeight="bold" fontSize="md">Cliente selecionado:</Text>
            <Text>{selectedCustomer.name}</Text>
            <Button 
              variant="link" 
              colorScheme="blue" 
              size="sm" 
              onClick={() => setSelectedCustomer(null)}
            >
              Alterar
            </Button>
          </Box>
        )}

        <Divider />

        <HStack justify="flex-end" spacing={4}>
          <Button 
            colorScheme="blue" 
            onClick={handleContinue}
            isDisabled={!selectedCustomer}
          >
            Continuar
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
} 