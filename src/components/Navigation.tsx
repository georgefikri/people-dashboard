'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThemeToggle, SimpleThemeToggle } from '@/components/ThemeToggle';
import { IconDarkModeToggle } from '@/components/DarkModeToggle';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, Users, User, ChevronDown } from 'lucide-react';

export function Navigation() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <header className="border-b bg-white dark:bg-gray-900 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Title */}
          <div className="flex items-center space-x-2">
            <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Team Manager
            </h1>
          </div>

          {/* User Info and Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle Options - You can switch between these: */}
            {/* Option 1: Dropdown with Light/Dark/System */}
            <ThemeToggle />

            {/* Option 2: Simple Light/Dark toggle */}
            {/* <SimpleThemeToggle /> */}

            {/* Option 3: Animated icon toggle */}
            {/* <IconDarkModeToggle /> */}

            {/* Desktop view */}
            <div className="hidden md:block text-sm">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900 dark:text-white">
                  {user.name}
                </span>
                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                  {user.role}
                </Badge>
              </div>
              <div className="text-gray-500 dark:text-gray-400">{user.email}</div>
            </div>

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">{user.name}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                  <Badge
                    variant={user.role === 'admin' ? 'default' : 'secondary'}
                    className="w-fit"
                  >
                    {user.role}
                  </Badge>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  className="text-red-600 focus:text-red-600 cursor-pointer"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
