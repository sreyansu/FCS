'use client';

import { useState } from 'react';
import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="h-full relative">
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-[60]">
        <Button variant="outline" size="icon" onClick={() => setIsMobileOpen(true)} className="bg-white dark:bg-gray-900">
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileOpen(false)} />
          <div className="relative w-64 bg-white dark:bg-gray-900 h-full">
            <div className="absolute top-4 right-4">
              <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <DashboardSidebar />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-full w-64 flex-col fixed inset-y-0 z-50">
        <DashboardSidebar />
      </div>

      <main className="md:pl-64 p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}
