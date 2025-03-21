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
  Tooltip,
  HStack,
  Heading,
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon, SettingsIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/navigation';
import { deliveryService, DeliveryFilters, DeliveryListResponse } from '@/services/deliveryService';
import { Delivery, DeliveryStatus } from '@/types/delivery';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const statusColors = {
  [DeliveryStatus.PENDING]: 'yellow',
  [DeliveryStatus.ASSIGNED]: 'blue',
  [DeliveryStatus.IN_TRANSIT]: 'purple',
  [DeliveryStatus.DELIVERED]: 'green',
  [DeliveryStatus.RETURNED]: 'orange',
  [DeliveryStatus.CANCELED]: 'red',
};

const statusLabels = {
  [DeliveryStatus.PENDING]: 'Pendente',
  [DeliveryStatus.ASSIGNED]: 'Atribuída',
  [DeliveryStatus.IN_TRANSIT]: 'Em trânsito',
  [DeliveryStatus.DELIVERED]: 'Entregue',
  [DeliveryStatus.RETURNED]: 'Devolvida',
  [DeliveryStatus.CANCELED]: 'Cancelada',
};

interface DeliveryTableProps {
  filters: DeliveryFilters;
  onPageChange: (page: number) => void;
  setIsLoading: (loading: boolean) => void;
}

export default function DeliveryTable({ filters, onPageChange, setIsLoading }: DeliveryTableProps) {
  const router = useRouter();
  const toast = useToast();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        setLoading(true);
        setIsLoading(true);
        
        const response = await deliveryService.getDeliveries(filters);
        
        setDeliveries(response.data);
        setPagination({
          total: response.total,
          page: response.page,
          limit: response.limit,
          totalPages: Math.ceil(response.total / response.limit),
        });
      } catch (error) {
        console.error('Erro ao buscar entregas:', error);
        toast({
          title: 'Erro ao buscar entregas',
          description: 'Ocorreu um erro ao buscar as entregas. Tente novamente mais tarde.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
        setIsLoading(false);
      }
    };

    fetchDeliveries();
  }, [filters, toast, setIsLoading]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    onPageChange(newPage);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
    } catch (error) {
      return dateString;
    }
  };

  const goToDetails = (id: string) => {
    router.push(`/deliveries/${id}`);
  };

  const handleStatusChange = async (id: string, newStatus: DeliveryStatus) => {
    try {
      await deliveryService.updateDeliveryStatus(id, newStatus);
      
      // Atualiza o status na lista local
      setDeliveries(prevDeliveries => 
        prevDeliveries.map(delivery => 
          delivery._id === id 
            ? { ...delivery, status: newStatus } 
            : delivery
        )
      );
      
      toast({
        title: 'Status atualizado',
        description: 'O status da entrega foi atualizado com sucesso.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast({
        title: 'Erro ao atualizar status',
        description: 'Ocorreu um erro ao atualizar o status da entrega.',
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

  if (deliveries.length === 0) {
    return (
      <Box textAlign="center" py={10}>
        <Heading size="md" mb={2}>Nenhuma entrega encontrada</Heading>
        <Text>Tente ajustar os filtros ou criar uma nova entrega.</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Box overflowX="auto">
        <Table variant="simple" size="sm">
          <Thead>
            <Tr>
              <Th>Código</Th>
              <Th>Cliente</Th>
              <Th>Data de Entrega</Th>
              <Th>Valor Total</Th>
              <Th>Status</Th>
              <Th>Ações</Th>
            </Tr>
          </Thead>
          <Tbody>
            {deliveries.map((delivery) => (
              <Tr 
                key={delivery._id} 
                cursor="pointer" 
                _hover={{ bg: 'gray.50' }}
                onClick={() => goToDetails(delivery._id)}
              >
                <Td fontWeight="medium">{delivery.code}</Td>
                <Td>{delivery.customerName}</Td>
                <Td>{formatDate(delivery.deliveryDate)}</Td>
                <Td>R$ {delivery.total.toFixed(2)}</Td>
                <Td>
                  <Badge colorScheme={statusColors[delivery.status]}>
                    {statusLabels[delivery.status]}
                  </Badge>
                </Td>
                <Td onClick={(e) => e.stopPropagation()}>
                  <Menu>
                    <Tooltip label="Opções">
                      <MenuButton
                        as={IconButton}
                        icon={<SettingsIcon />}
                        variant="ghost"
                        size="sm"
                        aria-label="Opções"
                      />
                    </Tooltip>
                    <MenuList>
                      <MenuItem onClick={() => goToDetails(delivery._id)}>
                        Visualizar detalhes
                      </MenuItem>
                      
                      {delivery.status === DeliveryStatus.PENDING && (
                        <MenuItem 
                          onClick={() => handleStatusChange(delivery._id, DeliveryStatus.ASSIGNED)}
                        >
                          Atribuir a entregador
                        </MenuItem>
                      )}
                      
                      {delivery.status === DeliveryStatus.ASSIGNED && (
                        <MenuItem 
                          onClick={() => handleStatusChange(delivery._id, DeliveryStatus.IN_TRANSIT)}
                        >
                          Marcar em trânsito
                        </MenuItem>
                      )}
                      
                      {delivery.status === DeliveryStatus.IN_TRANSIT && (
                        <MenuItem 
                          onClick={() => handleStatusChange(delivery._id, DeliveryStatus.DELIVERED)}
                        >
                          Marcar como entregue
                        </MenuItem>
                      )}
                      
                      {[DeliveryStatus.PENDING, DeliveryStatus.ASSIGNED, DeliveryStatus.IN_TRANSIT].includes(delivery.status) && (
                        <MenuItem 
                          onClick={() => handleStatusChange(delivery._id, DeliveryStatus.CANCELED)}
                        >
                          Cancelar entrega
                        </MenuItem>
                      )}
                      
                      {[DeliveryStatus.PENDING, DeliveryStatus.ASSIGNED, DeliveryStatus.IN_TRANSIT].includes(delivery.status) && (
                        <MenuItem 
                          onClick={() => handleStatusChange(delivery._id, DeliveryStatus.RETURNED)}
                        >
                          Marcar como devolvida
                        </MenuItem>
                      )}
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
          {Math.min(pagination.page * pagination.limit, pagination.total)} de {pagination.total} entregas
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
            Página {pagination.page} de {pagination.totalPages}
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