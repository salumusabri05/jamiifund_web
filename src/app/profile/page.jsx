"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { updateProfile } from 'firebase/auth';
import { auth } from '@/firebase/firebase';
import { FaUser, FaPhone, FaEnvelope, FaExclamationCircle, FaCheck } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';

export default function UserProfile() {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    bio: '',
    location: '',
    website: '',
    address: '',
    city: '',
    region: '',
    postalCode: '',
    isOrganization: false,
    organizationName: '',
    organizationRegNumber: '',
    organizationType: '',
    organizationDescription: '',
    username: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  
  const supabase = createClientComponentClient();
  
  useEffect(() => {
    async function fetchProfile() {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.uid)
          .single();
        
        if (error) throw error;
        
        setProfile(data);
        setFormData({
          fullName: data.full_name || '',
          phone: data.phone || '',
          bio: data.bio || '',
          location: data.location || '',
          website: data.website || '',
          address: data.address || '',
          city: data.city || '',
          region: data.region || '',
          postalCode: data.postal_code || '',
          isOrganization: data.is_organization || false,
          organizationName: data.organization_name || '',
          organizationRegNumber: data.organization_reg_number || '',
          organizationType: data.organization_type || '',
          organizationDescription: data.organization_description || '',
          username: data.username || ''
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    if (!loading) {
      fetchProfile();
    }
  }, [user, loading, supabase]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Update Firebase display name
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: formData.fullName
        });
      }
      
      // Update Supabase profile
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.fullName,
          phone: formData.phone,
          bio: formData.bio,
          location: formData.location,
          website: formData.website,
          address: formData.address,
          city: formData.city,
          region: formData.region,
          postal_code: formData.postalCode,
          is_organization: formData.isOrganization,
          organization_name: formData.organizationName,
          organization_reg_number: formData.organizationRegNumber,
          organization_type: formData.organizationType,
          organization_description: formData.organizationDescription,
          username: formData.username,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.uid);
        
      if (error) throw error;
      
      setProfile(prev => ({
        ...prev,
        full_name: formData.fullName,
        phone: formData.phone,
        bio: formData.bio,
        location: formData.location,
        website: formData.website,
        address: formData.address,
        city: formData.city,
        region: formData.region,
        postal_code: formData.postalCode,
        is_organization: formData.isOrganization,
        organization_name: formData.organizationName,
        organization_reg_number: formData.organizationRegNumber,
        organization_type: formData.organizationType,
        organization_description: formData.organizationDescription,
        username: formData.username
      }));
      
      setIsEditing(false);
      showNotification('Profile updated successfully', 'success');
    } catch (error) {
      console.error('Error updating profile:', error);
      showNotification('Failed to update profile', 'error');
    } finally {
      setIsLoading(false);
    }
  };
  
  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };
  
  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto text-center">
            <FaExclamationCircle className="text-5xl text-purple-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Access Required</h2>
            <p className="text-gray-600 mb-6">Please sign in to access your profile.</p>
            <Link 
              href="/login?redirect=/profile" 
              className="rounded-full bg-purple-600 px-6 py-3 text-white hover:bg-purple-700 transition"
            >
              Log In
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        
        {notification && (
          <div className={`mb-6 p-4 rounded-lg ${
            notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            <div className="flex items-center">
              {notification.type === 'success' ? 
                <FaCheck className="mr-2" /> : 
                <FaExclamationCircle className="mr-2" />
              }
              {notification.message}
            </div>
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Profile Header */}
          <div className="bg-purple-600 p-6 text-white">
            <div className="flex flex-col md:flex-row items-center">
              <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center mb-4 md:mb-0 md:mr-6">
                {profile?.avatar_url ? (
                  <Image 
                    src={profile.avatar_url}
                    alt="Profile"
                    width={96}
                    height={96}
                    className="rounded-full"
                  />
                ) : (
                  <FaUser className="text-4xl text-purple-300" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{profile?.full_name || user.displayName || 'User'}</h2>
                <p className="text-purple-200">Member since {new Date(profile?.created_at || Date.now()).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
          
          {/* Profile Content */}
          <div className="p-6">
            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Email</label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                    />
                    <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                      placeholder="Your phone number"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                      placeholder="Your location"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Username</label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                      placeholder="Username"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Website</label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                      placeholder="Your website"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                      placeholder="Your address"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                      placeholder="City"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Region</label>
                    <input
                      type="text"
                      name="region"
                      value={formData.region}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                      placeholder="Region/State/Province"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Postal Code</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                      placeholder="Postal/ZIP code"
                    />
                  </div>
                </div>
                
                {/* Organization section */}
                <div className="mb-6">
                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      id="isOrganization"
                      name="isOrganization"
                      checked={formData.isOrganization}
                      onChange={(e) => setFormData(prev => ({...prev, isOrganization: e.target.checked}))}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <label htmlFor="isOrganization" className="ml-2 block text-gray-700 font-medium">
                      This is an organization account
                    </label>
                  </div>
                  
                  {formData.isOrganization && (
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-2">
                      <h3 className="font-medium text-gray-800 mb-3">Organization Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-700 text-sm font-medium mb-1">Organization Name</label>
                          <input
                            type="text"
                            name="organizationName"
                            value={formData.organizationName}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                            placeholder="Organization name"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-gray-700 text-sm font-medium mb-1">Registration Number</label>
                          <input
                            type="text"
                            name="organizationRegNumber"
                            value={formData.organizationRegNumber}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                            placeholder="Registration number"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-gray-700 text-sm font-medium mb-1">Organization Type</label>
                          <select
                            name="organizationType"
                            value={formData.organizationType}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                          >
                            <option value="">Select organization type</option>
                            <option value="ngo">NGO</option>
                            <option value="charity">Charity</option>
                            <option value="business">Business</option>
                            <option value="government">Government</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        
                        <div className="md:col-span-2">
                          <label className="block text-gray-700 text-sm font-medium mb-1">Organization Description</label>
                          <textarea
                            name="organizationDescription"
                            value={formData.organizationDescription}
                            onChange={handleChange}
                            rows={3}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                            placeholder="Describe your organization"
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-purple-600 rounded-lg text-white hover:bg-purple-700 transition"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Full Name</h3>
                    <p className="text-gray-800 font-medium">{profile?.full_name || user.displayName || 'Not set'}</p>
                  </div>
                  
                  <div className="flex items-start">
                    <FaEnvelope className="text-purple-600 mt-1 mr-2" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Email</h3>
                      <p className="text-gray-800 font-medium">{user.email}</p>
                    </div>
                  </div>
                  
                  {profile?.phone && (
                    <div className="flex items-start">
                      <FaPhone className="text-purple-600 mt-1 mr-2" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Phone</h3>
                        <p className="text-gray-800 font-medium">{profile.phone}</p>
                      </div>
                    </div>
                  )}
                  
                  {profile?.location && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Location</h3>
                      <p className="text-gray-800 font-medium">{profile.location}</p>
                    </div>
                  )}
                </div>
                
                {profile?.bio && (
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Bio</h3>
                    <p className="text-gray-800">{profile.bio}</p>
                  </div>
                )}
                
                <div className="flex justify-end">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-2 bg-purple-600 rounded-lg text-white hover:bg-purple-700 transition"
                  >
                    Edit Profile
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}