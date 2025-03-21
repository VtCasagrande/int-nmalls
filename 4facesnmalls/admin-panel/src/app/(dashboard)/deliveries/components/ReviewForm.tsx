'use client';

import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  Divider,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { Delivery, PaymentMethod } from '@/types/delivery';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ReviewFormProps {
  formData: Partial<Delivery>;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export default function ReviewForm({ formData, onSubmit, onBack, isSubmitting }: ReviewFormProps) {
  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2)}`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  const getPaymentMethodLabel = (method?: PaymentMethod): string => {
    if (!method) return '-';
    
    const labels: Record<PaymentMethod, string> = {
      [PaymentMethod.CASH]: 'Dinheiro',
      [PaymentMethod.CREDIT_CARD]: 'Cartão de Crédito',
      [PaymentMethod.DEBIT_CARD]: 'Cartão de Débito',
      [PaymentMethod.PIX]: 'PIX',
      [PaymentMethod.PREPAID]: 'Pré-pago',
    };
    return labels[method];
  };

  // Calcular o subtotal dos itens
  const calculateItemsTotal = () => {
    if (!formData.items || formData.items.length === 0) return 0;
    return formData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const itemsTotal = calculateItemsTotal();
  const total = itemsTotal + (formData.deliveryFee || 0);

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        <Heading size="md">Revisão da Entrega</Heading>
        <Text>Verifique se todas as informações estão corretas antes de finalizar.</Text>

        <Box bg="blue.50" p={4} borderRadius="md" borderWidth="1px" borderColor="blue.200">
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
            <GridItem>
              <Heading size="sm" mb={2}>Cliente</Heading>
              <Text>{formData.customerName}</Text>
            </GridItem>
            
            <GridItem>
              <Heading size="sm" mb={2}>Data de Entrega</Heading>
              <Text>{formatDate(formData.deliveryDate)}</Text>
            </GridItem>
            
            <GridItem>
              <Heading size="sm" mb={2}>Método de Pagamento</Heading>
              <Text>{getPaymentMethodLabel(formData.paymentMethod)}</Text>
            </GridItem>
            
            <GridItem>
              <Heading size="sm" mb={2}>Taxa de Entrega</Heading>
              <Text>{formatCurrency(formData.deliveryFee || 0)}</Text>
            </GridItem>
          </Grid>

          {formData.notes && (
            <Box mt={4}>
              <Heading size="sm" mb={2}>Observações</Heading>
              <Text>{formData.notes}</Text>
            </Box>
          )}
        </Box>

        <Box>
          <Heading size="sm" mb={2}>Endereço de Entrega</Heading>
          <Box bg="gray.50" p={4} borderRadius="md">
            {formData.deliveryAddress && (
              <>
                <Text>
                  {formData.deliveryAddress.street}, {formData.deliveryAddress.number}
                  {formData.deliveryAddress.complement && ` - ${formData.deliveryAddress.complement}`}
                </Text>
                <Text>
                  {formData.deliveryAddress.neighborhood} - {formData.deliveryAddress.city}/{formData.deliveryAddress.state}
                </Text>
                <Text>CEP: {formData.deliveryAddress.zipCode}</Text>
                {formData.deliveryAddress.reference && (
                  <Text><strong>Referência:</strong> {formData.deliveryAddress.reference}</Text>
                )}
              </>
            )}
          </Box>
        </Box>

        <Box>
          <Heading size="sm" mb={2}>Itens da Entrega</Heading>
          <Box overflowX="auto">
            <Table size="sm" variant="simple">
              <Thead>
                <Tr>
                  <Th>Produto</Th>
                  <Th isNumeric>Preço</Th>
                  <Th isNumeric>Qtd</Th>
                  <Th isNumeric>Subtotal</Th>
                </Tr>
              </Thead>
              <Tbody>
                {formData.items?.map((item, index) => (
                  <Tr key={index}>
                    <Td>{item.name}</Td>
                    <Td isNumeric>{formatCurrency(item.price)}</Td>
                    <Td isNumeric>{item.quantity}</Td>
                    <Td isNumeric>{formatCurrency(item.price * item.quantity)}</Td>
                  </Tr>
                ))}
                <Tr>
                  <Td colSpan={3} textAlign="right" fontWeight="bold">Taxa de Entrega:</Td>
                  <Td isNumeric>{formatCurrency(formData.deliveryFee || 0)}</Td>
                </Tr>
                <Tr>
                  <Td colSpan={3} textAlign="right" fontWeight="bold">Total:</Td>
                  <Td isNumeric fontWeight="bold">{formatCurrency(total)}</Td>
                </Tr>
              </Tbody>
            </Table>
          </Box>
        </Box>

        <Box bg="green.50" p={4} borderRadius="md" borderWidth="1px" borderColor="green.200">
          <Heading size="sm" mb={2}>Status Inicial</Heading>
          <Badge colorScheme="yellow">Pendente</Badge>
          <Text mt={1} fontSize="sm">O status da entrega será definido como "Pendente" até que seja atribuída a um entregador.</Text>
        </Box>

        <Divider />

        <HStack justify="space-between" spacing={4}>
          <Button variant="outline" onClick={onBack} isDisabled={isSubmitting}>
            Voltar
          </Button>
          <Button 
            colorScheme="green" 
            onClick={onSubmit}
            isLoading={isSubmitting}
            loadingText="Criando entrega..."
          >
            Finalizar Entrega
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
} 