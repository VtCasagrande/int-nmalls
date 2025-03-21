"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCustomers, Customer, CustomerSearchParams } from '@/services/customers';
import { PlusIcon, SearchIcon, FilterIcon } from '@heroicons/react/outline';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useState<CustomerSearchParams>({});
  const [showFilters, setShowFilters] = useState(false);
  const router = useRouter();

  // Carregar clientes
  useEffect(() => {
    async function loadCustomers() {
      try {
        setIsLoading(true);
        const data = await getCustomers(searchParams);
        setCustomers(data);
      } catch (error) {
        console.error('Erro ao carregar clientes:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadCustomers();
  }, [searchParams]);

  // Atualizar filtros de busca
  const updateSearchParams = (params: Partial<CustomerSearchParams>) => {
    setSearchParams(prev => ({ ...prev, ...params }));
  };

  // Limpar filtros
  const clearFilters = () => {
    setSearchParams({});
    setShowFilters(false);
  };

  // Ir para página de detalhes do cliente
  const goToCustomerDetails = (id: string) => {
    router.push(`/customers/${id}`);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Clientes</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie os clientes do sistema
          </p>
        </div>
        <Link 
          href="/customers/new" 
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Novo Cliente
        </Link>
      </div>

      {/* Barra de busca e filtros */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Buscar clientes por nome, email ou telefone..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              onChange={(e) => updateSearchParams({ name: e.target.value })}
              value={searchParams.name || ''}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
          </div>
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FilterIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
            Filtros
          </button>
        </div>

        {/* Painel de filtros */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="text"
                  id="email"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={searchParams.email || ''}
                  onChange={(e) => updateSearchParams({ email: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Tipo
                </label>
                <select
                  id="type"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={searchParams.type || ''}
                  onChange={(e) => updateSearchParams({ type: e.target.value })}
                >
                  <option value="">Todos</option>
                  <option value="individual">Pessoa Física</option>
                  <option value="company">Pessoa Jurídica</option>
                </select>
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  id="status"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={searchParams.isActive !== undefined ? searchParams.isActive.toString() : ''}
                  onChange={(e) => updateSearchParams({ isActive: e.target.value === 'true' })}
                >
                  <option value="">Todos</option>
                  <option value="true">Ativo</option>
                  <option value="false">Inativo</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                className="mr-3 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={clearFilters}
              >
                Limpar Filtros
              </button>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => setShowFilters(false)}
              >
                Aplicar Filtros
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tabela de clientes */}
      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contato
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Criado em
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    Nenhum cliente encontrado
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr 
                    key={customer._id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => goToCustomerDetails(customer._id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                          <div className="text-sm text-gray-500">
                            {customer.type === 'individual' 
                              ? customer.cpf 
                              : customer.cnpj}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{customer.email}</div>
                      <div className="text-sm text-gray-500">{customer.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {customer.type === 'individual' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        customer.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {customer.isActive ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(customer.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/customers/${customer._id}`}
                        className="text-blue-600 hover:text-blue-900"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Detalhes
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 