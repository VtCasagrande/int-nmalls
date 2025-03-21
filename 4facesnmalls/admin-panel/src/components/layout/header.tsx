"use client";

import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { MenuIcon, BellIcon, SearchIcon } from '@heroicons/react/outline';
import { UserCircleIcon } from '@heroicons/react/solid';

interface HeaderProps {
  openSidebar: () => void;
}

export default function Header({ openSidebar }: HeaderProps) {
  const { user } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={openSidebar}
            >
              <span className="sr-only">Abrir menu lateral</span>
              <MenuIcon className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              {/* Título da página atual seria exibido aqui */}
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="relative rounded-full text-gray-500 p-1 hover:text-gray-900 hover:bg-gray-100">
                <span className="sr-only">Ver notificações</span>
                <BellIcon className="h-6 w-6" aria-hidden="true" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
              </div>
            </div>
            <div className="hidden md:ml-4 md:flex-shrink-0 md:flex md:items-center">
              <div className="ml-3 relative">
                <div>
                  <button
                    className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    id="user-menu-button"
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                  >
                    <span className="sr-only">Abrir menu de usuário</span>
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                      <UserCircleIcon className="h-8 w-8" aria-hidden="true" />
                    </div>
                    <span className="ml-2 text-gray-700 font-medium flex items-center">
                      {user?.name || 'Usuário'}
                    </span>
                  </button>
                </div>

                {isProfileOpen && (
                  <div
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                    tabIndex={-1}
                  >
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      tabIndex={-1}
                      id="user-menu-item-0"
                    >
                      Seu Perfil
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      tabIndex={-1}
                      id="user-menu-item-1"
                    >
                      Configurações
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 