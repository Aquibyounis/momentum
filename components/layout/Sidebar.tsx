'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Calendar, TrendingUp, Settings2, Lock, LogOut } from 'lucide-react';
import { useMode } from '@/hooks/useMode';
import ModeBadge from '@/components/ui/ModeBadge';
import Tooltip from '@/components/ui/Tooltip';

const navItems = [
  { href: '/today', label: 'Today', icon: LayoutDashboard },
  { href: '/history', label: 'History', icon: Calendar },
  { href: '/progress', label: 'Progress', icon: TrendingUp },
  { href: '/blueprint', label: 'Blueprint Editor', icon: Settings2, adminOnly: true },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { mode, isAdmin, lock } = useMode();

  if (mode === 'locked') return null;

  return (
    <aside className="hidden lg:flex w-[220px] flex-col fixed left-0 top-0 bottom-0 bg-surface border-r border-border z-40">
      {/* Logo */}
      <div className="px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center bg-surface-2 border border-border">
            <img src="/logo-192.png" alt="Momentum Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-text-primary font-bold text-sm tracking-tight">Momentum</p>
            <p className="text-text-muted text-[10px]">Forever Blueprint</p>
          </div>
        </div>
      </div>

      <div className="h-px bg-border mx-4" />

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const isLocked = item.adminOnly && !isAdmin;
          const Icon = item.icon;

          if (isLocked) {
            return (
              <Tooltip key={item.href} content="Admin access required">
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-muted cursor-not-allowed opacity-50 w-full">
                  <Icon size={18} />
                  <span className="text-sm">{item.label}</span>
                  <Lock size={12} className="ml-auto" />
                </div>
              </Tooltip>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-surface-2 text-text-primary border-l-2 border-accent-blue'
                  : 'text-text-muted hover:text-text-secondary hover:bg-surface-2'
              }`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-4 pb-4 space-y-3">
        <ModeBadge />
        <button
          onClick={lock}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-text-muted text-sm hover:text-text-secondary hover:bg-surface-2 transition-colors"
        >
          <LogOut size={16} />
          <span>Lock / Switch</span>
        </button>
      </div>
    </aside>
  );
}
