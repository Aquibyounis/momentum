'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, LayoutDashboard, Calendar, TrendingUp, Settings2, Lock, LogOut } from 'lucide-react';
import { useMode } from '@/hooks/useMode';
import ModeBadge from '@/components/ui/ModeBadge';

const navItems = [
  { href: '/today', label: 'Today', icon: LayoutDashboard },
  { href: '/history', label: 'History', icon: Calendar },
  { href: '/progress', label: 'Progress', icon: TrendingUp },
  { href: '/blueprint', label: 'Blueprint Editor', icon: Settings2, adminOnly: true },
];

export default function TopBar() {
  const pathname = usePathname();
  const { mode, isAdmin, lock } = useMode();
  const [menuOpen, setMenuOpen] = useState(false);

  if (mode === 'locked') return null;

  const currentPage = navItems.find(
    (item) => pathname === item.href || pathname.startsWith(item.href + '/')
  );

  return (
    <>
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-surface/95 backdrop-blur-md border-b border-border z-40 flex items-center px-4 gap-3">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface-2 transition-colors text-text-secondary"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <div className="flex items-center gap-2 flex-1">
          <div className="w-7 h-7 rounded-lg overflow-hidden flex items-center justify-center bg-surface-2 border border-border">
            <img src="/logo-192.png" alt="Momentum Logo" className="w-full h-full object-cover" />
          </div>
          <span className="text-text-primary font-semibold text-sm">
            {currentPage?.label || 'Momentum'}
          </span>
        </div>
        <ModeBadge />
      </header>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 z-[45] bg-black/60 backdrop-blur-sm" onClick={() => setMenuOpen(false)}>
          <div
            className="w-[260px] h-full bg-surface border-r border-border p-4 animate-slide-down"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-6 mt-2">
              <div className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center bg-surface-2 border border-border">
                <img src="/logo-192.png" alt="Momentum Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-text-primary font-bold text-sm">Momentum</p>
                <p className="text-text-muted text-[10px]">Forever Blueprint</p>
              </div>
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const isLocked = item.adminOnly && !isAdmin;
                const Icon = item.icon;

                if (isLocked) {
                  return (
                    <div
                      key={item.href}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-muted opacity-50"
                    >
                      <Icon size={18} />
                      <span className="text-sm">{item.label}</span>
                      <Lock size={12} className="ml-auto" />
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
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

            <div className="absolute bottom-6 left-4 right-4 space-y-3">
              <ModeBadge />
              <button
                onClick={() => {
                  lock();
                  setMenuOpen(false);
                }}
                className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-text-muted text-sm hover:bg-surface-2 transition-colors"
              >
                <LogOut size={16} />
                <span>Lock / Switch</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
