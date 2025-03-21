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
  FormErrorMessage,
  Grid,
  GridItem,
  Textarea,
} from '@chakra-ui/react';
import { Delivery, DeliveryAddress } from '@/types/delivery';

interface AddressFormProps {
  formData: Partial<Delivery>;
  updateFormData: (data: Partial<Delivery>) => void;
  onNext: () => void;
  onBack: () => void;
}

interface FormErrors {
  [key: string]: string;
}

export default function AddressForm({ formData, updateFormData, onNext, onBack }: AddressFormProps) {
  const toast = useToast();
  const [address, setAddress] = useState<DeliveryAddress>(
    formData.deliveryAddress || {
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: '',
      reference: '',
    }
  );
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAddress(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Limpa o erro quando o usuário digita
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const requiredFields = ['street', 'number', 'neighborhood', 'city', 'state', 'zipCode'];
    
    requiredFields.forEach(field => {
      if (!address[field as keyof DeliveryAddress]) {
        newErrors[field] = 'Campo obrigatório';
      }
    });
    
    // Validação específica para CEP (formato brasileiro: 00000-000)
    if (address.zipCode && !/^\d{5}-?\d{3}$/.test(address.zipCode)) {
      newErrors.zipCode = 'CEP inválido. Use o formato 00000-000';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateForm()) {
      updateFormData({
        deliveryAddress: address,
      });
      onNext();
    } else {
      toast({
        title: 'Formulário incompleto',
        description: 'Preencha todos os campos obrigatórios corretamente.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const formatCEP = (value: string) => {
    // Remove tudo que não for número
    const cep = value.replace(/\D/g, '');
    
    // Formata como 00000-000
    if (cep.length <= 5) {
      return cep;
    }
    
    return `${cep.substring(0, 5)}-${cep.substring(5, 8)}`;
  };

  const handleCEPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCEP = formatCEP(e.target.value);
    setAddress(prev => ({
      ...prev,
      zipCode: formattedCEP,
    }));
    
    if (errors.zipCode) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.zipCode;
        return newErrors;
      });
    }
  };

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        <Text fontSize="lg" fontWeight="medium">Endereço de Entrega</Text>

        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
          <GridItem colSpan={{ base: 1, md: 2 }}>
            <FormControl isRequired isInvalid={!!errors.street}>
              <FormLabel>Rua</FormLabel>
              <Input
                name="street"
                value={address.street}
                onChange={handleChange}
                placeholder="Rua, Avenida, etc."
              />
              {errors.street && <FormErrorMessage>{errors.street}</FormErrorMessage>}
            </FormControl>
          </GridItem>

          <FormControl isRequired isInvalid={!!errors.number}>
            <FormLabel>Número</FormLabel>
            <Input
              name="number"
              value={address.number}
              onChange={handleChange}
              placeholder="Ex: 123"
            />
            {errors.number && <FormErrorMessage>{errors.number}</FormErrorMessage>}
          </FormControl>

          <FormControl>
            <FormLabel>Complemento</FormLabel>
            <Input
              name="complement"
              value={address.complement || ''}
              onChange={handleChange}
              placeholder="Apto, Sala, etc."
            />
          </FormControl>

          <GridItem colSpan={{ base: 1, md: 2 }}>
            <FormControl isRequired isInvalid={!!errors.neighborhood}>
              <FormLabel>Bairro</FormLabel>
              <Input
                name="neighborhood"
                value={address.neighborhood}
                onChange={handleChange}
                placeholder="Bairro"
              />
              {errors.neighborhood && <FormErrorMessage>{errors.neighborhood}</FormErrorMessage>}
            </FormControl>
          </GridItem>

          <FormControl isRequired isInvalid={!!errors.city}>
            <FormLabel>Cidade</FormLabel>
            <Input
              name="city"
              value={address.city}
              onChange={handleChange}
              placeholder="Cidade"
            />
            {errors.city && <FormErrorMessage>{errors.city}</FormErrorMessage>}
          </FormControl>

          <FormControl isRequired isInvalid={!!errors.state}>
            <FormLabel>Estado</FormLabel>
            <Input
              name="state"
              value={address.state}
              onChange={handleChange}
              placeholder="Ex: SP"
              maxLength={2}
            />
            {errors.state && <FormErrorMessage>{errors.state}</FormErrorMessage>}
          </FormControl>

          <FormControl isRequired isInvalid={!!errors.zipCode}>
            <FormLabel>CEP</FormLabel>
            <Input
              name="zipCode"
              value={address.zipCode}
              onChange={handleCEPChange}
              placeholder="00000-000"
              maxLength={9}
            />
            {errors.zipCode && <FormErrorMessage>{errors.zipCode}</FormErrorMessage>}
          </FormControl>

          <GridItem colSpan={{ base: 1, md: 2 }}>
            <FormControl>
              <FormLabel>Referência</FormLabel>
              <Textarea
                name="reference"
                value={address.reference || ''}
                onChange={handleChange}
                placeholder="Ponto de referência para facilitar a entrega"
                rows={3}
              />
            </FormControl>
          </GridItem>
        </Grid>

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