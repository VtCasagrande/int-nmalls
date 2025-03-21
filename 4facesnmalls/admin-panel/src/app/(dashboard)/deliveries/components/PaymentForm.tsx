'use client';

import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  VStack,
  HStack,
  Text,
  Divider,
  useToast,
  Radio,
  RadioGroup,
  Stack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Textarea,
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  Card,
  CardBody,
} from '@chakra-ui/react';
import { Delivery, PaymentMethod } from '@/types/delivery';

interface PaymentFormProps {
  formData: Partial<Delivery>;
  updateFormData: (data: Partial<Delivery>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function PaymentForm({ formData, updateFormData, onNext, onBack }: PaymentFormProps) {
  const toast = useToast();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    formData.paymentMethod || PaymentMethod.CASH
  );
  const [deliveryFee, setDeliveryFee] = useState<number>(
    formData.deliveryFee || 0
  );
  const [notes, setNotes] = useState<string>(
    formData.notes || ''
  );
  const [deliveryDate, setDeliveryDate] = useState<string>(
    formData.deliveryDate || new Date().toISOString().split('T')[0]
  );

  // Calcular o subtotal dos itens
  const calculateItemsTotal = () => {
    if (!formData.items || formData.items.length === 0) return 0;
    return formData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const itemsTotal = calculateItemsTotal();
  const total = itemsTotal + deliveryFee;

  const handleDeliveryFeeChange = (valueAsString: string) => {
    const fee = parseFloat(valueAsString) || 0;
    setDeliveryFee(fee);
  };

  const getPaymentMethodLabel = (method: PaymentMethod): string => {
    const labels: Record<PaymentMethod, string> = {
      [PaymentMethod.CASH]: 'Dinheiro',
      [PaymentMethod.CREDIT_CARD]: 'Cartão de Crédito',
      [PaymentMethod.DEBIT_CARD]: 'Cartão de Débito',
      [PaymentMethod.PIX]: 'PIX',
      [PaymentMethod.PREPAID]: 'Pré-pago',
    };
    return labels[method];
  };

  const handleContinue = () => {
    updateFormData({
      paymentMethod,
      deliveryFee,
      notes,
      deliveryDate,
      total,
    });
    onNext();
  };

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        <Text fontSize="lg" fontWeight="medium">Informações de Pagamento</Text>

        <Flex direction={{ base: 'column', md: 'row' }} gap={6}>
          <Box flex="2">
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel>Método de Pagamento</FormLabel>
                <RadioGroup
                  value={paymentMethod}
                  onChange={(value) => setPaymentMethod(value as PaymentMethod)}
                >
                  <Stack direction="column" spacing={2}>
                    {Object.values(PaymentMethod).map((method) => (
                      <Radio key={method} value={method}>
                        {getPaymentMethodLabel(method)}
                      </Radio>
                    ))}
                  </Stack>
                </RadioGroup>
              </FormControl>

              <FormControl>
                <FormLabel>Data de Entrega</FormLabel>
                <input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ padding: '8px', borderRadius: '4px', border: '1px solid #E2E8F0' }}
                  min={new Date().toISOString().split('T')[0]}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Taxa de Entrega (R$)</FormLabel>
                <NumberInput
                  value={deliveryFee}
                  onChange={handleDeliveryFeeChange}
                  min={0}
                  precision={2}
                  step={1}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <FormControl>
                <FormLabel>Observações</FormLabel>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Instruções especiais para entrega, observações sobre pagamento, etc."
                  rows={4}
                />
              </FormControl>
            </VStack>
          </Box>

          <Box flex="1">
            <Card>
              <CardBody>
                <Text fontWeight="bold" mb={4}>Resumo do Pedido</Text>
                
                <Stat mb={3}>
                  <StatLabel>Subtotal</StatLabel>
                  <StatNumber>R$ {itemsTotal.toFixed(2)}</StatNumber>
                </Stat>
                
                <Stat mb={3}>
                  <StatLabel>Taxa de Entrega</StatLabel>
                  <StatNumber>R$ {deliveryFee.toFixed(2)}</StatNumber>
                </Stat>
                
                <Divider my={3} />
                
                <Stat>
                  <StatLabel>Total</StatLabel>
                  <StatNumber fontSize="xl" color="blue.600">
                    R$ {total.toFixed(2)}
                  </StatNumber>
                </Stat>
              </CardBody>
            </Card>
          </Box>
        </Flex>

        <Divider />

        <HStack justify="space-between" spacing={4}>
          <Button variant="outline" onClick={onBack}>
            Voltar
          </Button>
          <Button colorScheme="blue" onClick={handleContinue}>
            Continuar
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
} 