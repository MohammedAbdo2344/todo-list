'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { CategoryForm } from '@/components/categories/CategoryForm';
import { CategoryCard } from '@/components/categories/CategoryCard';
import { Button } from '@/components/ui';
import { authService, profileService, categoryService, taskService } from '@/lib/services';
import { Category } from '@/lib/services';

export default function CategoriesPage() {
  const [user, setUser] = useState<any>(null);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [currentProfile, setCurrentProfile] = useState<any>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryTaskCounts, setCategoryTaskCounts] = useState<Record<string, number>>({});
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);
  }, [router]);

  useEffect(() => {
    if (user) {
      loadProfiles();
    }
  }, [user]);

  useEffect(() => {
    if (currentProfile) {
      loadCategories();
      loadTaskCounts();
    }
  }, [currentProfile]);

  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'create' && currentProfile) {
      setSelectedCategory(null);
      setIsFormOpen(true);
    }
  }, [searchParams, currentProfile]);

  const loadProfiles = async () => {
    try {
      const userProfiles = await profileService.getProfiles(user.id);
      setProfiles(userProfiles);
      if (userProfiles.length > 0) {
        setCurrentProfile(userProfiles[0]);
      }
    } catch (error) {
      console.error('Failed to load profiles:', error);
    }
  };

  const loadCategories = async () => {
    try {
      const profileCategories = await categoryService.getCategories(currentProfile.id);
      setCategories(profileCategories);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const loadTaskCounts = async () => {
    try {
      const tasks = await taskService.getTasks({
        profileId: currentProfile.id,
        deleted: false,
      });
      
      const counts = tasks.reduce((acc, task) => {
        acc[task.categoryId] = (acc[task.categoryId] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      setCategoryTaskCounts(counts);
    } catch (error) {
      console.error('Failed to load task counts:', error);
    }
  };

  const handleProfileChange = (profileId: string) => {
    const profile = profiles.find(p => p.id === profileId);
    setCurrentProfile(profile);
  };

  const handleCreateCategory = () => {
    setSelectedCategory(null);
    setIsFormOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setIsFormOpen(true);
  };

  const handleDeleteCategory = async (category: Category) => {
    const taskCount = categoryTaskCounts[category.id] || 0;
    
    if (taskCount > 0) {
      alert(`Cannot delete category "${category.name}" because it has ${taskCount} tasks. Please move or delete the tasks first.`);
      return;
    }
    
    if (window.confirm(`Are you sure you want to delete the category "${category.name}"?`)) {
      try {
        // Delete category (not implemented in mock API)
        console.log('Delete category:', category);
        loadCategories();
      } catch (error) {
        console.error('Failed to delete category:', error);
      }
    }
  };

  const handleFormSuccess = () => {
    loadCategories();
    loadTaskCounts();
  };

  if (!user || !currentProfile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        currentProfile={currentProfile}
        profiles={profiles}
        onProfileChange={handleProfileChange}
      />
      
      <div className="flex">
        <Sidebar onCreateCategory={handleCreateCategory} />
        
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
                <p className="text-gray-600 mt-1">
                  Manage categories for {currentProfile.name}
                </p>
              </div>
              <Button onClick={handleCreateCategory}>
                Create Category
              </Button>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.length === 0 ? (
                <div className="col-span-full text-center py-12 bg-white rounded-lg border border-gray-200">
                  <p className="text-gray-500">
                    No categories yet. Create your first category to organize your tasks!
                  </p>
                </div>
              ) : (
                categories.map((category) => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    taskCount={categoryTaskCounts[category.id] || 0}
                    onEdit={handleEditCategory}
                    onDelete={handleDeleteCategory}
                  />
                ))
              )}
            </div>
          </div>
        </main>
      </div>

      <CategoryForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        category={selectedCategory}
        profileId={currentProfile.id}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
}
