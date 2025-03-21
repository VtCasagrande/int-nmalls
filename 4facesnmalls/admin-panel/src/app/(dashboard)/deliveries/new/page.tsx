'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Flex,
  Heading,
  useToast,
  HStack,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepNumber,
  StepTitle,
  StepDescription,
  StepSeparator,
  useSteps,
  Card,
  CardBody
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import CustomerForm from '../components/CustomerForm';
import AddressForm from '../components/AddressForm';
import ItemsForm from '../components/ItemsForm';
import PaymentForm from '../components/PaymentForm';
import ReviewForm from '../components/ReviewForm';
import { Delivery, DeliveryStatus, PaymentMethod } from '@/types/delivery';
import { deliveryService } from '@/services/deliveryService';

const steps = [
  { title: 'Cliente', description: 'Selecione o cliente' },
  { title: 'Endereço', description: 'Endereço de entrega' },
  { title: 'Itens', description: 'Itens da entrega' },
  { title: 'Pagamento', description: 'Método de pagamento' },
  { title: 'Revisão', description: 'Confirme os dados' },
];

export default function NewDeliveryPage() {
  const router = useRouter();
  const toast = useToast();
  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<Delivery>>({
    status: DeliveryStatus.PENDING,
    items: [],
    deliveryFee: 0,
    total: 0,
  });

  const updateFormData = (data: Partial<Delivery>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    setActiveStep(current => current + 1);
  };

  const handleBack = () => {
    setActiveStep(current => current - 1);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      // Cálculo final do total
      const itemsTotal = formData.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
      const total = itemsTotal + (formData.deliveryFee || 0);
      
      const deliveryData = {
        ...formData,
        total,
        status: DeliveryStatus.PENDING,
      };
      
      // Enviar para a API
      await deliveryService.createDelivery(deliveryData as any);
      
      toast({
        title: 'Entrega criada',
        description: 'A entrega foi criada com sucesso.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      router.push('/deliveries');
    } catch (error) {
      console.error('Erro ao criar entrega:', error);
      toast({
        title: 'Erro ao criar entrega',
        description: 'Ocorreu um erro ao criar a entrega. Tente novamente.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <CustomerForm 
            formData={formData} 
            updateFormData={updateFormData} 
            onNext={handleNext} 
          />
        );
      case 1:
        return (
          <AddressForm 
            formData={formData} 
            updateFormData={updateFormData} 
            onNext={handleNext} 
            onBack={handleBack} 
          />
        );
      case 2:
        return (
          <ItemsForm 
            formData={formData} 
            updateFormData={updateFormData} 
            onNext={handleNext} 
            onBack={handleBack} 
          />
        );
      case 3:
        return (
          <PaymentForm 
            formData={formData} 
            updateFormData={updateFormData} 
            onNext={handleNext} 
            onBack={handleBack} 
          />
        );
      case 4:
        return (
          <ReviewForm 
            formData={formData} 
            onSubmit={handleSubmit} 
            onBack={handleBack}
            isSubmitting={isSubmitting} 
          />
        );
      default:
        return null;
    }
  };

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
          <Heading size="lg">Nova Entrega</Heading>
        </HStack>
      </Flex>

      <Stepper index={activeStep} colorScheme="blue" mb={8}>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepIndicator>
              <StepStatus 
                complete={<StepIcon />} 
                incomplete={<StepNumber />} 
                active={<StepNumber />} 
              />
            </StepIndicator>
            <Box flexShrink={0}>
              <StepTitle>{step.title}</StepTitle>
              <StepDescription>{step.description}</StepDescription>
            </Box>
            <StepSeparator />
          </Step>
        ))}
      </Stepper>

      <Card>
        <CardBody>
          {renderStepContent()}
        </CardBody>
      </Card>
    </Box>
  );
} 