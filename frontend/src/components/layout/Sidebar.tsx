// src/components/layout/Sidebar.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import {
  Home,
  UserPlus,
  Users,
  Crown,
  Sparkles,
  User,
  Sword,
} from 'lucide-react';

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { path: '/', label: 'Dashboard', icon: Home },
  { path: '/characters/new', label: 'Add New Character', icon: UserPlus },
  { path: '/characters', label: 'Manage Characters', icon: Users },
  { path: '/items', label: 'Manage Items', icon: Sword },
  { path: '/spells', label: 'Manage Spells', icon: Sparkles },
  { path: '/profile', label: 'Profile', icon: User },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="w-70 min-h-screen bg-gradient-to-b from-sidebar-dark to-sidebar-darker text-white shadow-lg fixed left-0 top-0 z-40">
      <div className="p-6 border-b border-white/10">
        <h1 className="text-xl font-bold flex items-center">
          <Crown className="w-6 h-6 mr-2 text-yellow-400" />
          Character Sheet Manager
        </h1>
      </div>

      <div className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={clsx(
                    'flex items-center px-4 py-3 rounded-lg transition-all duration-200 group',
                    isActive
                      ? 'bg-primary-500 text-white shadow-md'
                      : 'text-white/80 hover:bg-white/10 hover:text-white hover:translate-x-1'
                  )}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};