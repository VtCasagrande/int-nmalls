"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  getCustomerById, 
  Customer, 
  Address, 
  deleteCustomer 
} from '@/services/customers';
import { getCustomerDeliveries } from '@/services/deliveries';
import { getCustomerRecurrencies } from '@/services/recurrencies';
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  LocationMarkerIcon,
  PhoneIcon,
  MailIcon,
  IdentificationIcon,
  ExclamationIcon,
  CalendarIcon,
  TruckIcon
} from '@heroicons/react/outline';

export default function CustomerDetailsPage({ params }: { params: { id: string } }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');
  const [deliveriesCount, setDeliveriesCount] = useState(0);
  const [recurrenciesCount, setRecurrenciesCount] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function loadCustomerData() {
      try {
        setIsLoading(true);
        const customerData = await getCustomerById(params.id);
        setCustomer(customerData);

        // Carregar contagens relacionadas
        const deliveries = await getCustomerDeliveries(params.id);
        setDeliveriesCount(deliveries.length);

        const recurrencies = await getCustomerRecurrencies(params.id);
        setRecurrenciesCount(recurrencies.length);
      } catch (error) {
        console.error('Erro ao carregar dados do cliente:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadCustomerData();
  }, [params.id]);

  const handleDeleteCustomer = async () => {
    try {
      await deleteCustomer(params.id);
      router.push('/customers');
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      alert('Erro ao excluir cliente. Tente novamente mais tarde.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-500">Cliente não encontrado</p>
        <Link 
          href="/customers" 
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <ArrowLeftIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Voltar para Clientes
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Cabeçalho com ações */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
        <div className="flex items-center mb-4 sm:mb-0">
          <Link 
            href="/customers" 
            className="mr-4 text-gray-500 hover:text-gray-700"
          >
            <ArrowLeftIcon className="h-5 w-5" aria-hidden="true" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{customer.name}</h1>
            <p className="mt-1 text-sm text-gray-500">
              {customer.type === 'individual' ? 'Pessoa Física' : 'Pessoa Jurídica'} • 
              {customer.isActive ? (
                <span className="text-green-600 ml-1">Ativo</span>
              ) : (
                <span className="text-red-600 ml-1">Inativo</span>
              )}
            </p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <TrashIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
            Excluir
          </button>
          <Link
            href={`/customers/edit/${params.id}`}
            className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PencilIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
            Editar
          </Link>
        </div>
      </div>

      {/* Tabs de navegação */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('details')}
            className={`${
              activeTab === 'details'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Informações
          </button>
          <button
            onClick={() => setActiveTab('deliveries')}
            className={`${
              activeTab === 'deliveries'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Entregas ({deliveriesCount})
          </button>
          <button
            onClick={() => setActiveTab('recurrencies')}
            className={`${
              activeTab === 'recurrencies'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Recorrências ({recurrenciesCount})
          </button>
        </nav>
      </div>

      {/* Conteúdo da aba selecionada */}
      {activeTab === 'details' && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Informações do Cliente</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Dados pessoais e de contato.</p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Nome completo</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{customer.name}</dd>
              </div>
              
              {customer.type === 'individual' && customer.cpf && (
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">CPF</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{customer.cpf}</dd>
                </div>
              )}
              
              {customer.type === 'company' && customer.cnpj && (
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">CNPJ</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{customer.cnpj}</dd>
                </div>
              )}
              
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {customer.email || 'Não informado'}
                </dd>
              </div>
              
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Telefone</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {customer.phone}
                </dd>
              </div>
              
              {customer.alternativePhone && (
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Telefone alternativo</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {customer.alternativePhone}
                  </dd>
                </div>
              )}
              
              {customer.birthDate && (
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Data de nascimento</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {new Date(customer.birthDate).toLocaleDateString('pt-BR')}
                  </dd>
                </div>
              )}
              
              {customer.notes && (
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Observações</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {customer.notes}
                  </dd>
                </div>
              )}
            </dl>
          </div>
          
          {/* Endereços */}
          <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Endereços</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Endereços cadastrados para este cliente.</p>
          </div>
          
          {customer.addresses.length === 0 ? (
            <div className="px-4 py-5 sm:px-6 text-sm text-gray-500">
              Nenhum endereço cadastrado.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 px-4 py-5 sm:px-6">
              {customer.addresses.map((address, index) => (
                <div key={address._id || index} className={`p-4 border rounded-lg ${address.isMain ? 'border-blue-200 bg-blue-50' : 'border-gray-200'}`}>
                  {address.isMain && (
                    <div className="mb-2">
                      <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">Principal</span>
                    </div>
                  )}
                  <p className="font-medium">{address.street}, {address.number}</p>
                  {address.complement && <p className="text-sm text-gray-500">Complemento: {address.complement}</p>}
                  <p className="text-sm text-gray-500">{address.neighborhood}</p>
                  <p className="text-sm text-gray-500">{address.city} - {address.state}</p>
                  <p className="text-sm text-gray-500">CEP: {address.zipCode}</p>
                  {address.reference && <p className="text-sm text-gray-500 mt-1">Referência: {address.reference}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'deliveries' && (
        <div className="bg-white shadow sm:rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Entregas</h3>
            <Link
              href={`/deliveries/new?customerId=${params.id}`}
              className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Nova Entrega
            </Link>
          </div>
          
          {deliveriesCount === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
                <TruckIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </div>
              <p className="text-lg font-medium text-gray-900">Nenhuma entrega encontrada</p>
              <p className="mt-1 text-sm text-gray-500">Este cliente ainda não possui entregas registradas.</p>
              <Link
                href={`/deliveries/new?customerId=${params.id}`}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Criar Primeira Entrega
              </Link>
            </div>
          ) : (
            <div className="px-4 py-3 bg-gray-50 rounded-lg text-center">
              <Link
                href={`/deliveries?customerId=${params.id}`}
                className="text-blue-600 hover:text-blue-900 font-medium"
              >
                Ver todas as entregas deste cliente
              </Link>
            </div>
          )}
        </div>
      )}

      {activeTab === 'recurrencies' && (
        <div className="bg-white shadow sm:rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Recorrências</h3>
            <Link
              href={`/recurrencies/new?customerId=${params.id}`}
              className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Nova Recorrência
            </Link>
          </div>
          
          {recurrenciesCount === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
                <CalendarIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </div>
              <p className="text-lg font-medium text-gray-900">Nenhuma recorrência encontrada</p>
              <p className="mt-1 text-sm text-gray-500">Este cliente ainda não possui recorrências registradas.</p>
              <Link
                href={`/recurrencies/new?customerId=${params.id}`}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Criar Primeira Recorrência
              </Link>
            </div>
          ) : (
            <div className="px-4 py-3 bg-gray-50 rounded-lg text-center">
              <Link
                href={`/recurrencies?customerId=${params.id}`}
                className="text-blue-600 hover:text-blue-900 font-medium"
              >
                Ver todas as recorrências deste cliente
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Modal de confirmação de exclusão */}
      {showDeleteConfirm && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Excluir cliente</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.
                        Todos os dados relacionados a este cliente serão permanentemente removidos.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleDeleteCustomer}
                >
                  Excluir
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 