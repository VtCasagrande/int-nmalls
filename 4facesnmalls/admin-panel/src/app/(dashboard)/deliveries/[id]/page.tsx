'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  Grid,
  GridItem,
  Badge,
  Button,
  Divider,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  HStack,
  Skeleton,
  useToast,
  Card,
  CardBody,
  CardHeader,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Icon,
} from '@chakra-ui/react';
import { ArrowBackIcon, CheckIcon, ChevronDownIcon, CloseIcon, EditIcon, TimeIcon } from '@chakra-ui/icons';
import { FaTruck, FaUser } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { deliveryService } from '@/services/deliveryService';
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

export default function DeliveryDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const toast = useToast();
  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDelivery = async () => {
      try {
        setLoading(true);
        const data = await deliveryService.getDeliveryById(params.id);
        setDelivery(data);
      } catch (error) {
        console.error('Erro ao buscar detalhes da entrega:', error);
        toast({
          title: 'Erro ao carregar detalhes',
          description: 'Não foi possível carregar os detalhes da entrega.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDelivery();
  }, [params.id, toast]);

  const handleStatusChange = async (newStatus: DeliveryStatus) => {
    if (!delivery) return;
    
    try {
      const updatedDelivery = await deliveryService.updateDeliveryStatus(delivery._id, newStatus);
      setDelivery(updatedDelivery);
      
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
    } catch (error) {
      return dateString;
    }
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: ptBR });
    } catch (error) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <Box p={4}>
        <Skeleton height="40px" mb={4} />
        <Skeleton height="200px" mb={4} />
        <Skeleton height="300px" />
      </Box>
    );
  }

  if (!delivery) {
    return (
      <Box p={4} textAlign="center">
        <Heading size="md" mb={4}>Entrega não encontrada</Heading>
        <Button leftIcon={<ArrowBackIcon />} onClick={() => router.push('/deliveries')}>
          Voltar para lista
        </Button>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Flex justify="space-between" align="center" mb={6}>
        <HStack>
          <Button 
            leftIcon={<ArrowBackIcon />} 
            variant="outline" 
            size="sm"
            onClick={() => router.push('/deliveries')}
          >
            Voltar
          </Button>
          <Heading size="lg">Entrega #{delivery.code}</Heading>
          <Badge colorScheme={statusColors[delivery.status]} fontSize="0.8em" p={1}>
            {statusLabels[delivery.status]}
          </Badge>
        </HStack>

        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />} size="sm">
            Ações
          </MenuButton>
          <MenuList>
            <MenuItem icon={<EditIcon />} onClick={() => router.push(`/deliveries/${delivery._id}/edit`)}>
              Editar entrega
            </MenuItem>
            
            {delivery.status === DeliveryStatus.PENDING && (
              <MenuItem 
                icon={<Icon as={FaUser} />}
                onClick={() => handleStatusChange(DeliveryStatus.ASSIGNED)}
              >
                Atribuir a entregador
              </MenuItem>
            )}
            
            {delivery.status === DeliveryStatus.ASSIGNED && (
              <MenuItem 
                icon={<Icon as={FaTruck} />}
                onClick={() => handleStatusChange(DeliveryStatus.IN_TRANSIT)}
              >
                Marcar em trânsito
              </MenuItem>
            )}
            
            {delivery.status === DeliveryStatus.IN_TRANSIT && (
              <MenuItem 
                icon={<CheckIcon />}
                onClick={() => handleStatusChange(DeliveryStatus.DELIVERED)}
              >
                Marcar como entregue
              </MenuItem>
            )}
            
            {[DeliveryStatus.PENDING, DeliveryStatus.ASSIGNED, DeliveryStatus.IN_TRANSIT].includes(delivery.status) && (
              <MenuItem 
                icon={<CloseIcon />}
                onClick={() => handleStatusChange(DeliveryStatus.CANCELED)}
              >
                Cancelar entrega
              </MenuItem>
            )}
            
            {[DeliveryStatus.PENDING, DeliveryStatus.ASSIGNED, DeliveryStatus.IN_TRANSIT].includes(delivery.status) && (
              <MenuItem 
                icon={<TimeIcon />}
                onClick={() => handleStatusChange(DeliveryStatus.RETURNED)}
              >
                Marcar como devolvida
              </MenuItem>
            )}
          </MenuList>
        </Menu>
      </Flex>

      <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6}>
        {/* Informações do cliente */}
        <Card>
          <CardHeader pb={0}>
            <Heading size="md">Cliente</Heading>
          </CardHeader>
          <CardBody>
            <Text fontWeight="bold">{delivery.customerName}</Text>
            <Button 
              variant="link" 
              colorScheme="blue" 
              size="sm" 
              onClick={() => router.push(`/customers/${delivery.customerId}`)}
            >
              Ver perfil do cliente
            </Button>
          </CardBody>
        </Card>

        {/* Informações de entrega */}
        <Card>
          <CardHeader pb={0}>
            <Heading size="md">Detalhes da Entrega</Heading>
          </CardHeader>
          <CardBody>
            <Text><strong>Data de Entrega:</strong> {formatDate(delivery.deliveryDate)}</Text>
            <Text><strong>Método de Pagamento:</strong> {delivery.paymentMethod}</Text>
            <Text><strong>Taxa de Entrega:</strong> R$ {delivery.deliveryFee.toFixed(2)}</Text>
            {delivery.notes && <Text><strong>Observações:</strong> {delivery.notes}</Text>}
          </CardBody>
        </Card>

        {/* Status */}
        <Card>
          <CardHeader pb={0}>
            <Heading size="md">Status da Entrega</Heading>
          </CardHeader>
          <CardBody>
            <Flex align="center" mb={2}>
              <Badge colorScheme={statusColors[delivery.status]} mr={2}>
                {statusLabels[delivery.status]}
              </Badge>
            </Flex>
            {delivery.driverName && (
              <Text><strong>Entregador:</strong> {delivery.driverName}</Text>
            )}
            {delivery.deliveredAt && (
              <Text><strong>Entregue em:</strong> {formatDateTime(delivery.deliveredAt)}</Text>
            )}
            <Text><strong>Criado em:</strong> {formatDateTime(delivery.createdAt)}</Text>
            <Text><strong>Atualizado em:</strong> {formatDateTime(delivery.updatedAt)}</Text>
          </CardBody>
        </Card>
      </Grid>

      {/* Endereço de entrega */}
      <Card mt={6}>
        <CardHeader>
          <Heading size="md">Endereço de Entrega</Heading>
        </CardHeader>
        <CardBody>
          <Text>
            {delivery.deliveryAddress.street}, {delivery.deliveryAddress.number}
            {delivery.deliveryAddress.complement && ` - ${delivery.deliveryAddress.complement}`}
          </Text>
          <Text>
            {delivery.deliveryAddress.neighborhood} - {delivery.deliveryAddress.city}/{delivery.deliveryAddress.state}
          </Text>
          <Text>CEP: {delivery.deliveryAddress.zipCode}</Text>
          {delivery.deliveryAddress.reference && (
            <Text><strong>Referência:</strong> {delivery.deliveryAddress.reference}</Text>
          )}
        </CardBody>
      </Card>

      {/* Itens */}
      <Card mt={6}>
        <CardHeader>
          <Heading size="md">Itens da Entrega</Heading>
        </CardHeader>
        <CardBody>
          <Box overflowX="auto">
            <Table size="sm">
              <Thead>
                <Tr>
                  <Th>Produto</Th>
                  <Th isNumeric>Quantidade</Th>
                  <Th isNumeric>Preço Unit.</Th>
                  <Th isNumeric>Subtotal</Th>
                </Tr>
              </Thead>
              <Tbody>
                {delivery.items.map((item, index) => (
                  <Tr key={index}>
                    <Td>{item.name}</Td>
                    <Td isNumeric>{item.quantity}</Td>
                    <Td isNumeric>R$ {item.price.toFixed(2)}</Td>
                    <Td isNumeric>R$ {(item.quantity * item.price).toFixed(2)}</Td>
                  </Tr>
                ))}
                <Tr>
                  <Td colSpan={3} textAlign="right" fontWeight="bold">Taxa de Entrega:</Td>
                  <Td isNumeric>R$ {delivery.deliveryFee.toFixed(2)}</Td>
                </Tr>
                <Tr>
                  <Td colSpan={3} textAlign="right" fontWeight="bold">Total:</Td>
                  <Td isNumeric fontWeight="bold">R$ {delivery.total.toFixed(2)}</Td>
                </Tr>
              </Tbody>
            </Table>
          </Box>
        </CardBody>
      </Card>
    </Box>
  );
} 