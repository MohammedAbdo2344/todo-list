'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card, CardContent, CardHeader } from '@/components/ui';
import { Button, Input } from '@/components/ui';
import { authService, profileService } from '@/lib/services';

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [currentProfile, setCurrentProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'account'>('profile');
  const [profileForm, setProfileForm] = useState({
    name: '',
    username: '',
    gender: 'male' as 'male' | 'female' | 'other',
  });
  const [accountForm, setAccountForm] = useState({
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);
    setProfileForm({
      name: currentUser.name || '',
      username: currentUser.username || '',
      gender: (currentUser.gender as 'male' | 'female' | 'other') || 'male',
    });
    setAccountForm({
      email: currentUser.email,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  }, [router]);

  useEffect(() => {
    if (user) {
      loadProfiles();
    }
  }, [user]);

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

  const handleProfileChange = (profileId: string) => {
    const profile = profiles.find(p => p.id === profileId);
    setCurrentProfile(profile);
  };

  const validateProfileForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!profileForm.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!profileForm.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAccountForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!accountForm.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(accountForm.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (accountForm.newPassword && accountForm.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (accountForm.newPassword && accountForm.newPassword !== accountForm.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (accountForm.newPassword && !accountForm.currentPassword) {
      newErrors.currentPassword = 'Current password is required to change password';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateProfileForm()) return;
    
    setIsLoading(true);
    setSuccessMessage('');
    
    try {
      // Update profile (not implemented in mock API)
      console.log('Update profile:', profileForm);
      setSuccessMessage('Profile updated successfully!');
      
      // Update local user data
      const updatedUser = { ...user, ...profileForm };
      authService.setUser(updatedUser, authService.getCurrentUser() ? localStorage.getItem('token') || '' : '');
      setUser(updatedUser);
    } catch (error: any) {
      setErrors({ general: error.response?.data?.error || 'Failed to update profile' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateAccountForm()) return;
    
    setIsLoading(true);
    setSuccessMessage('');
    
    try {
      // Update account (not implemented in mock API)
      console.log('Update account:', accountForm);
      setSuccessMessage('Account updated successfully!');
      
      // Clear password fields
      setAccountForm(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } catch (error: any) {
      setErrors({ general: error.response?.data?.error || 'Failed to update account' });
    } finally {
      setIsLoading(false);
    }
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
        <Sidebar />
        
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600 mt-1">
                Manage your profile and account settings
              </p>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-8">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'profile'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Profile Settings
                </button>
                <button
                  onClick={() => setActiveTab('account')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'account'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Account Settings
                </button>
              </nav>
            </div>

            {successMessage && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-6">
                {successMessage}
              </div>
            )}

            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
                {errors.general}
              </div>
            )}

            {activeTab === 'profile' && (
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
                  <p className="text-sm text-gray-600">
                    Update your personal information and profile details
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <Input
                      name="name"
                      label="Full Name"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                      error={errors.name}
                      placeholder="Enter your full name"
                      required
                    />
                    
                    <Input
                      name="username"
                      label="Username"
                      value={profileForm.username}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, username: e.target.value }))}
                      error={errors.username}
                      placeholder="Enter your username"
                      required
                    />
                    
                    <div className="w-full">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gender
                      </label>
                      <select
                        value={profileForm.gender}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, gender: e.target.value as any }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full"
                    >
                      {isLoading ? 'Updating...' : 'Update Profile'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {activeTab === 'account' && (
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-semibold text-gray-900">Account Settings</h2>
                  <p className="text-sm text-gray-600">
                    Update your email and password
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAccountSubmit} className="space-y-4">
                    <Input
                      name="email"
                      type="email"
                      label="Email Address"
                      value={accountForm.email}
                      onChange={(e) => setAccountForm(prev => ({ ...prev, email: e.target.value }))}
                      error={errors.email}
                      placeholder="Enter your email"
                      required
                    />
                    
                    <div className="border-t pt-4">
                      <h3 className="text-md font-medium text-gray-900 mb-4">Change Password</h3>
                      
                      <Input
                        name="currentPassword"
                        type="password"
                        label="Current Password"
                        value={accountForm.currentPassword}
                        onChange={(e) => setAccountForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                        error={errors.currentPassword}
                        placeholder="Enter current password"
                      />
                      
                      <Input
                        name="newPassword"
                        type="password"
                        label="New Password"
                        value={accountForm.newPassword}
                        onChange={(e) => setAccountForm(prev => ({ ...prev, newPassword: e.target.value }))}
                        error={errors.newPassword}
                        placeholder="Enter new password"
                      />
                      
                      <Input
                        name="confirmPassword"
                        type="password"
                        label="Confirm New Password"
                        value={accountForm.confirmPassword}
                        onChange={(e) => setAccountForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        error={errors.confirmPassword}
                        placeholder="Confirm new password"
                      />
                    </div>
                    
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full"
                    >
                      {isLoading ? 'Updating...' : 'Update Account'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
