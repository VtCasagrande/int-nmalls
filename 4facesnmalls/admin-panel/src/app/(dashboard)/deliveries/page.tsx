import { Box, Button, Flex, Heading, Text, useDisclosure, useToast } from '@chakra-ui/react';
import { useState } from 'react';
import { AddIcon } from '@chakra-ui/icons';
import DeliveryTable from './components/DeliveryTable';
import DeliveryFilters from './components/DeliveryFilters';
import { DeliveryStatus } from '@/types/delivery';

export default function DeliveriesPage() {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: undefined as DeliveryStatus | undefined,
    customerId: '',
    startDate: '',
    endDate: '',
    page: 1,
    limit: 10
  });

  const handleFilterChange = (newFilters: any) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1 // Reset to first page on filter change
    }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
  };

  return (
    <Box p={4}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">Entregas</Heading>
        <Button 
          leftIcon={<AddIcon />} 
          colorScheme="blue"
          size="sm"
          onClick={() => window.location.href = '/deliveries/new'}
        >
          Nova Entrega
        </Button>
      </Flex>

      <DeliveryFilters 
        filters={filters} 
        onFilterChange={handleFilterChange} 
        isDisabled={isLoading}
      />

      <Box mt={6}>
        <DeliveryTable 
          filters={filters}
          onPageChange={handlePageChange}
          setIsLoading={setIsLoading}
        />
      </Box>
    </Box>
  );
} 