"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { 
  HomeIcon, 
  UsersIcon, 
  TruckIcon, 
  CalendarIcon, 
  CubeIcon,
  SquaresPlusIcon,
  DocumentReportIcon,
  ChartBarIcon,
  CogIcon,
  LogoutIcon
} from '@heroicons/react/outline';

interface NavItem {
  name: string;
  href: string;
  icon: (props: React.ComponentProps<'svg'>) => JSX.Element;
  permission?: string;
}

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navigation: NavItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Clientes', href: '/customers', icon: UsersIcon, permission: 'customers:read' },
    { name: 'Entregas', href: '/deliveries', icon: TruckIcon, permission: 'deliveries:read' },
    { name: 'Recorrências', href: '/recurrencies', icon: CalendarIcon, permission: 'recurrencies:read' },
    { name: 'Produtos', href: '/products', icon: CubeIcon, permission: 'products:read' },
    { name: 'Promoções', href: '/promotions', icon: SquaresPlusIcon, permission: 'promotions:read' },
    { name: 'Relatórios', href: '/reports', icon: DocumentReportIcon, permission: 'reports:read' },
    { name: 'Métricas', href: '/metrics', icon: ChartBarIcon, permission: 'metrics:read' },
    { name: 'Configurações', href: '/settings', icon: CogIcon },
  ];

  // Função simples para verificar permissões (pode ser expandida conforme necessário)
  const hasPermission = (permission?: string) => {
    if (!permission) return true;
    if (user?.role === 'admin') return true;
    // Implementar lógica de verificação de permissões específicas
    return true; // Por enquanto, retornamos true para todas as permissões
  };

  return (
    <div className="flex flex-col h-full bg-white border-r">
      <div className="flex items-center justify-center h-16 border-b">
        <span className="text-xl font-bold text-blue-600">Nmalls</span>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-2 space-y-1">
          {navigation.map((item) => {
            // Verificar permissão para exibir este item
            if (!hasPermission(item.permission)) return null;

            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <item.icon
                  className={`mr-3 flex-shrink-0 h-6 w-6 ${
                    isActive 
                      ? 'text-blue-600' 
                      : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="border-t p-4">
        <button
          onClick={logout}
          className="w-full flex items-center px-2 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50"
        >
          <LogoutIcon className="mr-3 flex-shrink-0 h-6 w-6 text-red-500" aria-hidden="true" />
          Sair
        </button>
      </div>
    </div>
  );
} 