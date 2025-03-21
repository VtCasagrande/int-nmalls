'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  Text,
  Badge,
  Image,
  Divider,
  Skeleton,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  HStack,
  Card,
  CardBody,
  CardHeader,
  SimpleGrid,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { 
  ArrowBackIcon, 
  EditIcon, 
  DeleteIcon, 
  ChevronDownIcon,
  CheckIcon,
  CloseIcon,
} from '@chakra-ui/icons';
import { productService } from '@/services/productService';
import { Product, ProductStatus } from '@/types/product';

const statusColors = {
  [ProductStatus.ACTIVE]: 'green',
  [ProductStatus.INACTIVE]: 'gray',
  [ProductStatus.OUT_OF_STOCK]: 'red',
};

const statusLabels = {
  [ProductStatus.ACTIVE]: 'Ativo',
  [ProductStatus.INACTIVE]: 'Inativo',
  [ProductStatus.OUT_OF_STOCK]: 'Sem estoque',
};

export default function ProductDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const toast = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await productService.getProductById(params.id);
        setProduct(data);
        
        // Define a imagem principal como selecionada inicialmente
        if (data.images && data.images.length > 0) {
          const mainImage = data.images.find(img => img.isMain);
          setSelectedImage(mainImage ? mainImage.url : data.images[0].url);
        }
      } catch (error) {
        console.error('Erro ao buscar detalhes do produto:', error);
        toast({
          title: 'Erro ao carregar produto',
          description: 'Não foi possível carregar os detalhes do produto.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id, toast]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleEditProduct = () => {
    router.push(`/products/${params.id}/edit`);
  };

  const handleDeleteProduct = async () => {
    if (!product) return;
    
    if (confirm(`Tem certeza que deseja excluir o produto "${product.name}"?`)) {
      try {
        await productService.deleteProduct(params.id);
        
        toast({
          title: 'Produto excluído',
          description: 'O produto foi excluído com sucesso.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        
        router.push('/products');
      } catch (error) {
        console.error('Erro ao excluir produto:', error);
        toast({
          title: 'Erro ao excluir produto',
          description: 'Ocorreu um erro ao excluir o produto. Tente novamente.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const handleUpdateStatus = async (status: ProductStatus) => {
    if (!product) return;
    
    try {
      const updatedProduct = await productService.updateProductStatus(params.id, status);
      setProduct(updatedProduct);
      
      toast({
        title: 'Status atualizado',
        description: 'O status do produto foi atualizado com sucesso.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast({
        title: 'Erro ao atualizar status',
        description: 'Ocorreu um erro ao atualizar o status do produto.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleSetMainImage = async (imageUrl: string) => {
    if (!product) return;
    
    try {
      const updatedProduct = await productService.setMainProductImage(params.id, imageUrl);
      setProduct(updatedProduct);
      
      toast({
        title: 'Imagem principal atualizada',
        description: 'A imagem principal foi definida com sucesso.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Erro ao definir imagem principal:', error);
      toast({
        title: 'Erro ao definir imagem principal',
        description: 'Ocorreu um erro ao definir a imagem principal. Tente novamente.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDeleteImage = async (imageUrl: string) => {
    if (!product) return;
    
    if (confirm('Tem certeza que deseja excluir esta imagem?')) {
      try {
        await productService.deleteProductImage(params.id, imageUrl);
        
        // Atualiza o produto localmente para refletir a remoção da imagem
        setProduct(prev => {
          if (!prev) return prev;
          
          const updatedImages = prev.images.filter(img => img.url !== imageUrl);
          return {
            ...prev,
            images: updatedImages
          };
        });
        
        // Se a imagem excluída era a selecionada, seleciona outra
        if (selectedImage === imageUrl && product.images.length > 1) {
          const nextImage = product.images.find(img => img.url !== imageUrl);
          if (nextImage) {
            setSelectedImage(nextImage.url);
          } else {
            setSelectedImage(null);
          }
        }
        
        toast({
          title: 'Imagem excluída',
          description: 'A imagem foi excluída com sucesso.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        console.error('Erro ao excluir imagem:', error);
        toast({
          title: 'Erro ao excluir imagem',
          description: 'Ocorreu um erro ao excluir a imagem. Tente novamente.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
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

  if (!product) {
    return (
      <Box p={4} textAlign="center">
        <Heading size="md" mb={4}>Produto não encontrado</Heading>
        <Button leftIcon={<ArrowBackIcon />} onClick={() => router.push('/products')}>
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
            onClick={() => router.push('/products')}
          >
            Voltar
          </Button>
          <Heading size="lg">Produto: {product.name}</Heading>
          <Badge colorScheme={statusColors[product.status]} fontSize="0.8em" p={1}>
            {statusLabels[product.status]}
          </Badge>
        </HStack>

        <HStack>
          <Button
            leftIcon={<EditIcon />}
            colorScheme="blue"
            size="sm"
            onClick={handleEditProduct}
          >
            Editar
          </Button>
          
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />} size="sm">
              Ações
            </MenuButton>
            <MenuList>
              {product.status !== ProductStatus.ACTIVE && (
                <MenuItem
                  icon={<CheckIcon color="green.500" />}
                  onClick={() => handleUpdateStatus(ProductStatus.ACTIVE)}
                >
                  Marcar como ativo
                </MenuItem>
              )}
              {product.status !== ProductStatus.INACTIVE && (
                <MenuItem
                  icon={<CloseIcon color="orange.500" />}
                  onClick={() => handleUpdateStatus(ProductStatus.INACTIVE)}
                >
                  Marcar como inativo
                </MenuItem>
              )}
              {product.status !== ProductStatus.OUT_OF_STOCK && product.stock === 0 && (
                <MenuItem
                  icon={<CloseIcon color="red.500" />}
                  onClick={() => handleUpdateStatus(ProductStatus.OUT_OF_STOCK)}
                >
                  Marcar sem estoque
                </MenuItem>
              )}
              <MenuItem
                icon={<DeleteIcon color="red.500" />}
                onClick={handleDeleteProduct}
              >
                Excluir produto
              </MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>

      <Tabs isLazy variant="enclosed" mb={6}>
        <TabList>
          <Tab>Informações</Tab>
          {product.hasVariants && <Tab>Variantes</Tab>}
          <Tab>Estoque</Tab>
        </TabList>

        <TabPanels>
          <TabPanel p={0} pt={4}>
            <Grid templateColumns={{ base: "1fr", md: "350px 1fr" }} gap={6}>
              {/* Galeria de Imagens */}
              <GridItem>
                <Card>
                  <CardBody>
                    <Box mb={4}>
                      <Image
                        src={selectedImage || 'https://via.placeholder.com/300'}
                        alt={product.name}
                        width="100%"
                        height="300px"
                        objectFit="contain"
                        borderRadius="md"
                      />
                    </Box>
                    
                    <SimpleGrid columns={4} spacing={2}>
                      {product.images && product.images.map((image, index) => (
                        <Box 
                          key={index} 
                          position="relative"
                          borderWidth={image.url === selectedImage ? "2px" : "1px"}
                          borderColor={image.url === selectedImage ? "blue.500" : "gray.200"}
                          borderRadius="md"
                          overflow="hidden"
                        >
                          <Image
                            src={image.url}
                            alt={`${product.name} ${index + 1}`}
                            height="60px"
                            width="100%"
                            objectFit="cover"
                            cursor="pointer"
                            onClick={() => setSelectedImage(image.url)}
                          />
                          {image.isMain && (
                            <Badge 
                              position="absolute" 
                              top="0" 
                              right="0" 
                              colorScheme="green"
                              fontSize="xs"
                            >
                              Principal
                            </Badge>
                          )}
                          <HStack 
                            position="absolute" 
                            bottom="0" 
                            left="0" 
                            right="0" 
                            bg="blackAlpha.600"
                            p={1}
                            justifyContent="center"
                            spacing={1}
                          >
                            {!image.isMain && (
                              <IconButton
                                aria-label="Definir como principal"
                                icon={<CheckIcon />}
                                size="xs"
                                colorScheme="green"
                                onClick={() => handleSetMainImage(image.url)}
                              />
                            )}
                            <IconButton
                              aria-label="Excluir imagem"
                              icon={<DeleteIcon />}
                              size="xs"
                              colorScheme="red"
                              onClick={() => handleDeleteImage(image.url)}
                            />
                          </HStack>
                        </Box>
                      ))}
                    </SimpleGrid>
                  </CardBody>
                </Card>
              </GridItem>

              {/* Informações do Produto */}
              <GridItem>
                <Card mb={4}>
                  <CardHeader pb={0}>
                    <Heading size="md">Detalhes</Heading>
                  </CardHeader>
                  <CardBody>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      <Box>
                        <Text color="gray.500" fontSize="sm">SKU</Text>
                        <Text fontWeight="medium">{product.sku}</Text>
                      </Box>
                      <Box>
                        <Text color="gray.500" fontSize="sm">Categoria</Text>
                        <Text fontWeight="medium">{product.categoryName || '-'}</Text>
                      </Box>
                      <Box>
                        <Text color="gray.500" fontSize="sm">Preço</Text>
                        <Text fontWeight="medium">{formatCurrency(product.price)}</Text>
                      </Box>
                      {product.comparePrice && (
                        <Box>
                          <Text color="gray.500" fontSize="sm">Preço Anterior</Text>
                          <Text fontWeight="medium" textDecoration="line-through">{formatCurrency(product.comparePrice)}</Text>
                        </Box>
                      )}
                      <Box>
                        <Text color="gray.500" fontSize="sm">Estoque</Text>
                        <Badge colorScheme={product.stock > 10 ? 'green' : product.stock > 0 ? 'yellow' : 'red'}>
                          {product.stock} unidades
                        </Badge>
                      </Box>
                      {product.cost && (
                        <Box>
                          <Text color="gray.500" fontSize="sm">Custo</Text>
                          <Text fontWeight="medium">{formatCurrency(product.cost)}</Text>
                        </Box>
                      )}
                    </SimpleGrid>

                    <Divider my={4} />

                    <Box>
                      <Text color="gray.500" fontSize="sm" mb={1}>Descrição</Text>
                      <Text>{product.description}</Text>
                    </Box>

                    {product.attributes && Object.keys(product.attributes).length > 0 && (
                      <>
                        <Divider my={4} />
                        <Box>
                          <Text color="gray.500" fontSize="sm" mb={2}>Atributos</Text>
                          <SimpleGrid columns={2} spacing={3}>
                            {Object.entries(product.attributes).map(([key, value]) => (
                              <Box key={key}>
                                <Text fontWeight="medium">{key}</Text>
                                <Text>{value}</Text>
                              </Box>
                            ))}
                          </SimpleGrid>
                        </Box>
                      </>
                    )}

                    {product.dimensions && (
                      <>
                        <Divider my={4} />
                        <Box>
                          <Text color="gray.500" fontSize="sm" mb={2}>Dimensões</Text>
                          <SimpleGrid columns={3} spacing={3}>
                            <Box>
                              <Text fontWeight="medium">Comprimento</Text>
                              <Text>{product.dimensions.length} cm</Text>
                            </Box>
                            <Box>
                              <Text fontWeight="medium">Largura</Text>
                              <Text>{product.dimensions.width} cm</Text>
                            </Box>
                            <Box>
                              <Text fontWeight="medium">Altura</Text>
                              <Text>{product.dimensions.height} cm</Text>
                            </Box>
                          </SimpleGrid>
                        </Box>
                      </>
                    )}

                    {product.weight && (
                      <>
                        <Divider my={4} />
                        <Box>
                          <Text color="gray.500" fontSize="sm" mb={1}>Peso</Text>
                          <Text>{product.weight} kg</Text>
                        </Box>
                      </>
                    )}

                    {product.tags && product.tags.length > 0 && (
                      <>
                        <Divider my={4} />
                        <Box>
                          <Text color="gray.500" fontSize="sm" mb={2}>Tags</Text>
                          <HStack flexWrap="wrap" spacing={2}>
                            {product.tags.map((tag, index) => (
                              <Badge key={index} colorScheme="blue" variant="outline">
                                {tag}
                              </Badge>
                            ))}
                          </HStack>
                        </Box>
                      </>
                    )}
                  </CardBody>
                </Card>
              </GridItem>
            </Grid>
          </TabPanel>

          {product.hasVariants && (
            <TabPanel p={0} pt={4}>
              <Card>
                <CardHeader pb={0}>
                  <Heading size="md">Variantes</Heading>
                </CardHeader>
                <CardBody>
                  {product.variants && product.variants.length > 0 ? (
                    <Table variant="simple" size="sm">
                      <Thead>
                        <Tr>
                          <Th>Nome</Th>
                          <Th>SKU</Th>
                          <Th isNumeric>Preço</Th>
                          <Th isNumeric>Estoque</Th>
                          <Th>Atributos</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {product.variants.map((variant) => (
                          <Tr key={variant._id}>
                            <Td fontWeight="medium">{variant.name}</Td>
                            <Td>{variant.sku}</Td>
                            <Td isNumeric>{formatCurrency(variant.price)}</Td>
                            <Td isNumeric>
                              <Badge colorScheme={variant.stock > 10 ? 'green' : variant.stock > 0 ? 'yellow' : 'red'}>
                                {variant.stock}
                              </Badge>
                            </Td>
                            <Td>
                              {Object.entries(variant.attributes).map(([key, value]) => (
                                <Badge key={key} mr={1} colorScheme="gray">
                                  {key}: {value}
                                </Badge>
                              ))}
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  ) : (
                    <Text>Nenhuma variante cadastrada para este produto.</Text>
                  )}
                </CardBody>
              </Card>
            </TabPanel>
          )}

          <TabPanel p={0} pt={4}>
            <Card>
              <CardHeader pb={0}>
                <Heading size="md">Estoque</Heading>
              </CardHeader>
              <CardBody>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={4}>
                  <Box>
                    <Text color="gray.500" fontSize="sm">Estoque Atual</Text>
                    <Text fontSize="xl" fontWeight="bold">
                      <Badge 
                        fontSize="lg" 
                        colorScheme={product.stock > 10 ? 'green' : product.stock > 0 ? 'yellow' : 'red'}
                        p={1}
                      >
                        {product.stock} unidades
                      </Badge>
                    </Text>
                  </Box>
                  
                  <Box>
                    <Text color="gray.500" fontSize="sm">Status</Text>
                    <Badge 
                      fontSize="md" 
                      colorScheme={statusColors[product.status]}
                      p={1}
                    >
                      {statusLabels[product.status]}
                    </Badge>
                  </Box>
                </SimpleGrid>

                <Box>
                  <Text mb={2}>Ajustar estoque:</Text>
                  <HStack>
                    <Button 
                      colorScheme="blue" 
                      size="sm"
                      onClick={() => router.push(`/products/${product._id}/stock`)}
                    >
                      Atualizar Estoque
                    </Button>
                  </HStack>
                </Box>
              </CardBody>
            </Card>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
} 