import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserCircleIcon, 
  BellIcon, 
  ShieldCheckIcon, 
  PaintBrushIcon,
  ArrowLeftOnRectangleIcon 
} from '@heroicons/react/24/outline';

const API_URL = process.env.REACT_APP_API_URL || 'https://career-guidnece-production-d6a5.up.railway.app/api';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    experience: '',
    skills: '',
    education: '',
    professionalBio: '',
    careerGoals: '',
    currentRole: '',
    targetRole: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [preferences, setPreferences] = useState({
    notifications: {
      email: true,
      push: false,
      weeklyReport: true,
      jobAlerts: true,
    },
    privacy: {
      profileVisibility: 'public',
      dataSharing: false,
    },
    appearance: {
      darkMode: false,
      language: 'en',
    },
  });

  const fetchUserProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${API_URL}/user/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          experience: userData.experience || 'entry',
          skills: Array.isArray(userData.skills) ? userData.skills.join(', ') : '',
          education: userData.education || '',
          professionalBio: userData.professionalBio || '',
          careerGoals: userData.careerGoals || '',
          currentRole: userData.currentRole || '',
          targetRole: userData.targetRole || '',
        });
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile data');
    }
  }, [navigate]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePreferenceChange = (category: string, key: string, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value,
      },
    }));
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const skillsArray = formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill);

      const response = await fetch(`${API_URL}/user/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          experience: formData.experience,
          skills: skillsArray,
          education: formData.education,
          professionalBio: formData.professionalBio,
          careerGoals: formData.careerGoals,
          currentRole: formData.currentRole,
          targetRole: formData.targetRole,
        }),
      });

      if (response.ok) {
        setSuccess('Profile updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to update profile');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      setIsLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/user/change-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Password changed successfully!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Failed to change password');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: UserCircleIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'privacy', name: 'Privacy & Security', icon: ShieldCheckIcon },
    { id: 'appearance', name: 'Appearance', icon: PaintBrushIcon },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="font-medium">Back to Dashboard</span>
            </button>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              Settings
            </h1>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:text-white hover:bg-red-600 border-2 border-red-600 rounded-lg transition-all font-medium"
            >
              <ArrowLeftOnRectangleIcon className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-6 py-8">
        <div className="flex gap-6">
          {/* Sidebar Navigation */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-lg transform scale-105'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              {/* Success/Error Messages */}
              {success && (
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 rounded-xl">
                  {success}
                </div>
              )}
              {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 rounded-xl">
                  {error}
                </div>
              )}

              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Information</h2>
                  
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-all"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-600 dark:text-gray-400 cursor-not-allowed"
                          disabled
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Current Role
                        </label>
                        <input
                          type="text"
                          name="currentRole"
                          value={formData.currentRole}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-all"
                          placeholder="e.g., Software Engineer"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Target Role
                        </label>
                        <input
                          type="text"
                          name="targetRole"
                          value={formData.targetRole}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-all"
                          placeholder="e.g., Senior Software Engineer"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Experience Level
                        </label>
                        <select
                          name="experience"
                          value={formData.experience}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-all"
                        >
                          <option value="entry">Entry Level (0-2 years)</option>
                          <option value="mid">Mid Level (3-5 years)</option>
                          <option value="senior">Senior Level (6-10 years)</option>
                          <option value="lead">Lead/Principal (10+ years)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Education
                        </label>
                        <input
                          type="text"
                          name="education"
                          value={formData.education}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-all"
                          placeholder="e.g., B.S. Computer Science"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Skills (comma-separated)
                      </label>
                      <input
                        type="text"
                        name="skills"
                        value={formData.skills}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-all"
                        placeholder="e.g., JavaScript, React, Node.js"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Professional Bio
                      </label>
                      <textarea
                        name="professionalBio"
                        value={formData.professionalBio}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-all resize-none"
                        placeholder="Tell us about your professional background..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Career Goals
                      </label>
                      <textarea
                        name="careerGoals"
                        value={formData.careerGoals}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-all resize-none"
                        placeholder="What are your career aspirations?"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Updating...' : 'Update Profile'}
                    </button>
                  </form>

                  {/* Password Change Section */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mt-8">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Change Password</h3>
                    
                    <form onSubmit={handlePasswordChange} className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Current Password
                        </label>
                        <input
                          type="password"
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-all"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            New Password
                          </label>
                          <input
                            type="password"
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-all"
                            required
                            minLength={6}
                          />
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Minimum 6 characters</p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-all"
                            required
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? 'Changing...' : 'Change Password'}
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Notification Preferences</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">Email Notifications</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Receive email updates about your progress</p>
                      </div>
                      <button
                        onClick={() => handlePreferenceChange('notifications', 'email', !preferences.notifications.email)}
                        className={`relative w-14 h-8 rounded-full transition-colors ${
                          preferences.notifications.email ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <span
                          className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                            preferences.notifications.email ? 'transform translate-x-6' : ''
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">Weekly Report</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Get a weekly summary of your activities</p>
                      </div>
                      <button
                        onClick={() => handlePreferenceChange('notifications', 'weeklyReport', !preferences.notifications.weeklyReport)}
                        className={`relative w-14 h-8 rounded-full transition-colors ${
                          preferences.notifications.weeklyReport ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <span
                          className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                            preferences.notifications.weeklyReport ? 'transform translate-x-6' : ''
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">Job Alerts</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Receive notifications about matching jobs</p>
                      </div>
                      <button
                        onClick={() => handlePreferenceChange('notifications', 'jobAlerts', !preferences.notifications.jobAlerts)}
                        className={`relative w-14 h-8 rounded-full transition-colors ${
                          preferences.notifications.jobAlerts ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <span
                          className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                            preferences.notifications.jobAlerts ? 'transform translate-x-6' : ''
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy Tab */}
              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Privacy & Security</h2>
                  
                  <div className="space-y-4">
                    <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Profile Visibility</h3>
                      <select
                        value={preferences.privacy.profileVisibility}
                        onChange={(e) => handlePreferenceChange('privacy', 'profileVisibility', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 dark:bg-gray-600 dark:text-white"
                      >
                        <option value="public">Public - Visible to everyone</option>
                        <option value="private">Private - Only visible to you</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">Data Sharing</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Allow sharing anonymized data for improvements</p>
                      </div>
                      <button
                        onClick={() => handlePreferenceChange('privacy', 'dataSharing', !preferences.privacy.dataSharing)}
                        className={`relative w-14 h-8 rounded-full transition-colors ${
                          preferences.privacy.dataSharing ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      >
                        <span
                          className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                            preferences.privacy.dataSharing ? 'transform translate-x-6' : ''
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Appearance Tab */}
              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Appearance</h2>
                  
                  <div className="space-y-4">
                    <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Language</h3>
                      <select
                        value={preferences.appearance.language}
                        onChange={(e) => handlePreferenceChange('appearance', 'language', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 dark:bg-gray-600 dark:text-white"
                      >
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                        <option value="de">Deutsch</option>
                      </select>
                    </div>

                    <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">Dark Mode</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Toggle dark mode theme</p>
                        </div>
                        <button
                          onClick={() => handlePreferenceChange('appearance', 'darkMode', !preferences.appearance.darkMode)}
                          className={`relative w-14 h-8 rounded-full transition-colors ${
                            preferences.appearance.darkMode ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                        >
                          <span
                            className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                              preferences.appearance.darkMode ? 'transform translate-x-6' : ''
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
