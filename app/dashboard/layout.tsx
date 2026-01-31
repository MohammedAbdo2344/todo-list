// here 
'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { authService, profileService } from '@/lib/services';

// Create a context to share state with child pages
export const DashboardContext = createContext<any>(null);
export const useDashboard = () => useContext(DashboardContext);

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

  const contextValue = {
    user,
    currentProfile: user, // User is their own profile
    profiles: [user], // Single profile array for compatibility
    handleProfileChange: () => {}, // No profile switching needed
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