'use client';

import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
} from '@chakra-ui/react';
import { DeliveryStatus } from '@/types/delivery';
import { useRef } from 'react';

interface DeliveryFiltersProps {
  filters: {
    status?: DeliveryStatus;
    customerId?: string;
    startDate?: string;
    endDate?: string;
  };
  onFilterChange: (filters: any) => void;
  isDisabled?: boolean;
}

export default function DeliveryFilters({
  filters,
  onFilterChange,
  isDisabled = false,
}: DeliveryFiltersProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    const status = formData.get('status') as string;
    const customerId = formData.get('customerId') as string;
    const startDate = formData.get('startDate') as string;
    const endDate = formData.get('endDate') as string;

    onFilterChange({
      status: status !== 'all' ? status as DeliveryStatus : undefined,
      customerId: customerId || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    });
  };

  const handleReset = () => {
    if (formRef.current) {
      formRef.current.reset();
    }
    
    onFilterChange({
      status: undefined,
      customerId: undefined,
      startDate: undefined,
      endDate: undefined,
    });
  };

  return (
    <Box as="form" ref={formRef} onSubmit={handleSubmit} bg="white" p={4} borderRadius="md" shadow="sm">
      <Stack spacing={4} direction={{ base: 'column', md: 'row' }} wrap="wrap">
        <FormControl maxW={{ base: '100%', md: '200px' }}>
          <FormLabel fontSize="sm">Status</FormLabel>
          <Select
            name="status"
            defaultValue={filters.status || 'all'}
            size="sm"
            isDisabled={isDisabled}
          >
            <option value="all">Todos</option>
            <option value={DeliveryStatus.PENDING}>Pendente</option>
            <option value={DeliveryStatus.ASSIGNED}>Atribuída</option>
            <option value={DeliveryStatus.IN_TRANSIT}>Em trânsito</option>
            <option value={DeliveryStatus.DELIVERED}>Entregue</option>
            <option value={DeliveryStatus.RETURNED}>Devolvida</option>
            <option value={DeliveryStatus.CANCELED}>Cancelada</option>
          </Select>
        </FormControl>

        <FormControl maxW={{ base: '100%', md: '200px' }}>
          <FormLabel fontSize="sm">ID do Cliente</FormLabel>
          <Input
            name="customerId"
            defaultValue={filters.customerId || ''}
            size="sm"
            isDisabled={isDisabled}
          />
        </FormControl>

        <FormControl maxW={{ base: '100%', md: '200px' }}>
          <FormLabel fontSize="sm">Data Inicial</FormLabel>
          <Input
            name="startDate"
            type="date"
            defaultValue={filters.startDate || ''}
            size="sm"
            isDisabled={isDisabled}
          />
        </FormControl>

        <FormControl maxW={{ base: '100%', md: '200px' }}>
          <FormLabel fontSize="sm">Data Final</FormLabel>
          <Input
            name="endDate"
            type="date"
            defaultValue={filters.endDate || ''}
            size="sm"
            isDisabled={isDisabled}
          />
        </FormControl>

        <Flex alignItems="flex-end" gap={2} mt={{ base: 4, md: 0 }}>
          <Button
            type="submit"
            size="sm"
            colorScheme="blue"
            isLoading={isDisabled}
            loadingText="Filtrando..."
          >
            Filtrar
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleReset}
            isDisabled={isDisabled}
          >
            Limpar
          </Button>
        </Flex>
      </Stack>
    </Box>
  );
} 