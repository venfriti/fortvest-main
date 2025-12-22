'use client';

import Link from 'next/link';
import Image from 'next/image';
import { LayoutDashboard, Wallet, ArrowRightLeft, Settings, LogOut, ChevronDown } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { name: 'Fort Services', icon: Wallet, href: '/services', hasDropdown: true },
    { name: 'Transactions', icon: ArrowRightLeft, href: '/transactions' },
    { name: 'Settings', icon: Settings, href: '/settings' },
  ];

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-100 flex flex-col fixed left-0 top-0 z-50">
      {/* Logo */}
      <div className="p-8">
        <Image
          src="/fortvest-logo.png"
          alt="Fortvest Logo"
          width={140}
          height={40}
          priority
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-[#F24E1E] text-white' // Active State (Orange)
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={20} />
                <span className="font-medium text-sm">{item.name}</span>
              </div>
              {item.hasDropdown && <ChevronDown size={16} />}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-8 border-t border-gray-50">
        <button className="flex items-center gap-3 text-red-500 font-medium hover:text-red-600 transition-colors">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}