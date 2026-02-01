'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { authService } from '@/lib/services';
import { useRouter } from 'next/navigation';

// Context type
interface DashboardContextType {
  user: any;
  currentProfile: any;
  profiles: any[];
  handleProfileChange: () => void;
}

// Create context with proper type
export const DashboardContext = createContext<DashboardContextType | null>(null);

// Custom hook with null check
export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardLayout');
  }
  return context;
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);
  }, [router]);

  // Don't render children until user is resolved
  // This prevents children from mounting with a null user
  if (!user) {
    return (
      <div className="relative flex h-screen overflow-hidden bg-gray-50">
        <div className="flex-1 flex items-center justify-center">
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  const contextValue: DashboardContextType = {
    user,
    currentProfile: user,
    profiles: [user],
    handleProfileChange: () => {},
  };

  return (
    <DashboardContext.Provider value={contextValue}>
      <div className="relative flex h-screen overflow-hidden bg-gray-50">
        <Sidebar
          onCreateTask={() => router.push('/tasks?action=create')}
          onCreateCategory={() => router.push('/categories?action=create')}
        />
        <div className="flex-1 overflow-auto">
          <Header user={user} />
          <main className="p-8">
            <div className="min-h-[calc(100vh-8rem)]">{children}</div>
          </main>
        </div>
      </div>
    </DashboardContext.Provider>
  );
}