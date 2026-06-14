'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Calendar, TrendingUp, Settings2, Lock } from 'lucide-react';
import { useMode } from '@/hooks/useMode';

const navItems = [
  { href: '/today', label: 'Today', icon: LayoutDashboard },
  { href: '/history', label: 'History', icon: Calendar },
  { href: '/progress', label: 'Progress', icon: TrendingUp },
  { href: '/blueprint', label: 'Blueprint', icon: Settings2, adminOnly: true },
];

export default function MobileNav() {
  const pathname = usePathname();
  const { mode, isAdmin } = useMode();

  if (mode === 'locked') return null;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface/95 backdrop-blur-md border-t border-border z-40 flex items-center justify-around px-2 safe-bottom">
      {navItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
        const isLocked = item.adminOnly && !isAdmin;
        const Icon = item.icon;

        if (isLocked) {
          return (
            <div
              key={item.href}
              className="flex flex-col items-center gap-1 px-3 py-1.5 text-text-muted opacity-40"
            >
              <div className="relative">
                <Icon size={20} />
                <Lock size={8} className="absolute -top-1 -right-1" />
              </div>
              <span className="text-[10px]">{item.label}</span>
            </div>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${
              isActive ? 'text-accent-blue' : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            <Icon size={20} />
            <span className="text-[10px] font-medium">{item.label}</span>
            {isActive && (
              <div className="absolute bottom-1 w-5 h-0.5 rounded-full bg-accent-blue" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
