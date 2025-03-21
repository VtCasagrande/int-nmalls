"use client";

import { useState, useEffect } from 'react';
import { 
  UserGroupIcon, 
  TruckIcon, 
  CalendarIcon, 
  CubeIcon,
  CurrencyDollarIcon,
  ExclamationCircleIcon 
} from '@heroicons/react/outline';

interface StatCard {
  id: string;
  name: string;
  value: string | number;
  change: string;
  isIncrease: boolean;
  icon: React.ComponentType<React.ComponentProps<'svg'>>;
  bgColor: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<StatCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Aqui, em uma implementação real, buscaríamos os dados da API
    // Por enquanto, vamos usar dados mockados
    const mockStats: StatCard[] = [
      {
        id: 'clients',
        name: 'Clientes',
        value: 125,
        change: '+5.2%',
        isIncrease: true,
        icon: UserGroupIcon,
        bgColor: 'bg-blue-500',
      },
      {
        id: 'deliveries',
        name: 'Entregas',
        value: 287,
        change: '+12.5%',
        isIncrease: true,
        icon: TruckIcon,
        bgColor: 'bg-green-500',
      },
      {
        id: 'recurrencies',
        name: 'Recorrências',
        value: 48,
        change: '+3.8%',
        isIncrease: true,
        icon: CalendarIcon,
        bgColor: 'bg-purple-500',
      },
      {
        id: 'products',
        name: 'Produtos',
        value: 342,
        change: '0%',
        isIncrease: false,
        icon: CubeIcon,
        bgColor: 'bg-yellow-500',
      },
      {
        id: 'revenue',
        name: 'Receita Mensal',
        value: 'R$ 18.250',
        change: '+8.3%',
        isIncrease: true,
        icon: CurrencyDollarIcon,
        bgColor: 'bg-indigo-500',
      },
      {
        id: 'pending',
        name: 'Entregas Pendentes',
        value: 15,
        change: '-2.3%',
        isIncrease: false,
        icon: ExclamationCircleIcon,
        bgColor: 'bg-red-500',
      },
    ];

    setStats(mockStats);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Visão geral do sistema Nmalls
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 rounded-md p-3 ${stat.bgColor}`}>
                  <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        {stat.value}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <span
                  className={`font-medium ${
                    stat.isIncrease ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {stat.change}
                </span>{' '}
                <span className="text-gray-500">vs. mês anterior</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Próximas Entregas
            </h3>
            <div className="mt-5">
              <p className="text-gray-500 text-sm">
                Entregas agendadas para os próximos dias
              </p>
              <div className="mt-4 border-t border-gray-200 divide-y divide-gray-200">
                <div className="py-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Cliente A</div>
                    <div className="text-sm text-gray-500">Hoje, 14:30</div>
                  </div>
                  <div className="mt-1 text-sm text-gray-500">
                    Rua ABC, 123 - Bairro Centro
                  </div>
                </div>
                <div className="py-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Cliente B</div>
                    <div className="text-sm text-gray-500">Amanhã, 10:00</div>
                  </div>
                  <div className="mt-1 text-sm text-gray-500">
                    Av. XYZ, 456 - Bairro Norte
                  </div>
                </div>
                <div className="py-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Cliente C</div>
                    <div className="text-sm text-gray-500">Amanhã, 15:45</div>
                  </div>
                  <div className="mt-1 text-sm text-gray-500">
                    Rua DEF, 789 - Bairro Sul
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Recorrências Ativas
            </h3>
            <div className="mt-5">
              <p className="text-gray-500 text-sm">
                Recorrências com próxima entrega planejada
              </p>
              <div className="mt-4 border-t border-gray-200 divide-y divide-gray-200">
                <div className="py-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Assinatura Mensal - Cliente X</div>
                    <div className="text-sm text-gray-500">05/06/2023</div>
                  </div>
                  <div className="mt-1 text-sm text-gray-500">
                    Mensal - 12 entregas realizadas
                  </div>
                </div>
                <div className="py-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Entrega Semanal - Cliente Y</div>
                    <div className="text-sm text-gray-500">01/06/2023</div>
                  </div>
                  <div className="mt-1 text-sm text-gray-500">
                    Semanal - 8 entregas realizadas
                  </div>
                </div>
                <div className="py-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Contrato Trimestral - Cliente Z</div>
                    <div className="text-sm text-gray-500">15/06/2023</div>
                  </div>
                  <div className="mt-1 text-sm text-gray-500">
                    Mensal - 2 entregas realizadas
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 