"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/firebase/firebase';
import { supabase } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DashboardSidebar from './components/DashboardSidebar';
import DashboardStats from './components/DashboardStats';
import { FaUser, FaMoneyBillWave, FaHome, FaBriefcase, FaIdCard } from 'react-icons/fa';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeForm, setActiveForm] = useState('general');
  const [formData, setFormData] = useState({
    general: {
      fullName: '',
      email: '',
      phone: '',
      bio: '',
      profileImage: ''
    },
    lipaNamba: {
      mpesaNumber: '',
      accountName: '',
      preferredPaymentMethod: 'mpesa'
    },
    payment: {
      bankName: '',
      accountNumber: '',
      branchName: '',
      swiftCode: '',
      taxId: ''
    },
    residency: {
      address: '',
      city: '',
      region: '',
      postalCode: '',
      country: 'Tanzania'
    },
    work: {
      occupation: '',
      companyName: '',
      position: '',
      workAddress: '',
      workPhone: ''
    }
  });
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // Check authentication
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        setUser(authUser);
        // Fetch user profile from Supabase
        await fetchUserProfile(authUser.uid);
      } else {
        router.push('/login?redirect=/dashboard');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  // Fetch user profile from Supabase
  const fetchUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error);
        return;
      }

      if (data) {
        setUserProfile(data);
        
        // Populate form data from profile
        setFormData({
          general: {
            fullName: data.full_name || '',
            email: data.email || '',
            phone: data.phone || '',
            bio: data.bio || '',
            profileImage: data.profile_image || ''
          },
          lipaNamba: {
            mpesaNumber: data.mpesa_number || '',
            accountName: data.account_name || '',
            preferredPaymentMethod: data.preferred_payment_method || 'mpesa'
          },
          payment: {
            bankName: data.bank_name || '',
            accountNumber: data.account_number || '',
            branchName: data.branch_name || '',
            swiftCode: data.swift_code || '',
            taxId: data.tax_id || ''
          },
          residency: {
            address: data.address || '',
            city: data.city || '',
            region: data.region || '',
            postalCode: data.postal_code || '',
            country: data.country || 'Tanzania'
          },
          work: {
            occupation: data.occupation || '',
            companyName: data.company_name || '',
            position: data.position || '',
            workAddress: data.work_address || '',
            workPhone: data.work_phone || ''
          }
        });
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  };

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSaveProfile = async (section) => {
    setSaving(true);
    setSaveSuccess(false);
    setSaveError(null);

    try {
      if (!user) {
        setSaveError("You must be logged in to save profile information");
        return;
      }

      // Map the form data section to database fields
      let updateData = {};
      
      if (section === 'general') {
        updateData = {
          full_name: formData.general.fullName,
          email: formData.general.email,
          phone: formData.general.phone,
          bio: formData.general.bio,
          profile_image: formData.general.profileImage
        };
      } else if (section === 'lipaNamba') {
        updateData = {
          mpesa_number: formData.lipaNamba.mpesaNumber,
          account_name: formData.lipaNamba.accountName,
          preferred_payment_method: formData.lipaNamba.preferredPaymentMethod
        };
      } else if (section === 'payment') {
        updateData = {
          bank_name: formData.payment.bankName,
          account_number: formData.payment.accountNumber,
          branch_name: formData.payment.branchName,
          swift_code: formData.payment.swiftCode,
          tax_id: formData.payment.taxId
        };
      } else if (section === 'residency') {
        updateData = {
          address: formData.residency.address,
          city: formData.residency.city,
          region: formData.residency.region,
          postal_code: formData.residency.postalCode,
          country: formData.residency.country
        };
      } else if (section === 'work') {
        updateData = {
          occupation: formData.work.occupation,
          company_name: formData.work.companyName,
          position: formData.work.position,
          work_address: formData.work.workAddress,
          work_phone: formData.work.workPhone
        };
      }

      // Add user_id and updated_at to the update data
      updateData.user_id = user.uid;
      updateData.updated_at = new Date().toISOString();

      // Check if profile exists
      if (userProfile) {
        // Update existing profile
        const { error } = await supabase
          .from('user_profiles')
          .update(updateData)
          .eq('user_id', user.uid);

        if (error) throw error;
      } else {
        // Create new profile
        const { error } = await supabase
          .from('user_profiles')
          .insert([{ ...updateData, created_at: new Date().toISOString() }]);

        if (error) throw error;
      }

      setSaveSuccess(true);
      
      // Refetch user profile
      await fetchUserProfile(user.uid);
    } catch (error) {
      console.error("Error saving profile:", error);
      setSaveError(error.message || "Failed to save profile information");
    } finally {
      setSaving(false);
      
      // Clear success message after 3 seconds
      if (saveSuccess) {
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      }
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <DashboardSidebar 
                activeForm={activeForm}
                setActiveForm={setActiveForm}
                user={user}
                userProfile={userProfile}
              />
            </div>
            
            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-md p-6">
                {/* Dashboard Stats */}
                {activeForm === 'stats' && (
                  <DashboardStats userId={user.uid} />
                )}
                
                {/* General Information Form */}
                {activeForm === 'general' && (
                  <div>
                    <div className="flex items-center mb-6">
                      <FaUser className="text-purple-600 mr-3 text-xl" />
                      <h2 className="text-2xl font-bold text-gray-800">General Information</h2>
                    </div>
                    
                    <form className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          value={formData.general.fullName}
                          onChange={(e) => handleInputChange('general', 'fullName', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Your full name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                          type="email"
                          value={formData.general.email}
                          onChange={(e) => handleInputChange('general', 'email', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Your email address"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input
                          type="tel"
                          value={formData.general.phone}
                          onChange={(e) => handleInputChange('general', 'phone', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Your phone number"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                        <textarea
                          value={formData.general.bio}
                          onChange={(e) => handleInputChange('general', 'bio', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Tell us about yourself"
                          rows={4}
                        ></textarea>
                      </div>
                      
                      {saveSuccess && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                          Profile information saved successfully!
                        </div>
                      )}
                      
                      {saveError && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                          {saveError}
                        </div>
                      )}
                      
                      <div>
                        <button
                          type="button"
                          onClick={() => handleSaveProfile('general')}
                          disabled={saving}
                          className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
                        >
                          {saving ? 'Saving...' : 'Save Information'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
                
                {/* Lipa Namba Form */}
                {activeForm === 'lipaNamba' && (
                  <div>
                    <div className="flex items-center mb-6">
                      <FaMoneyBillWave className="text-purple-600 mr-3 text-xl" />
                      <h2 className="text-2xl font-bold text-gray-800">Lipa Namba Details</h2>
                    </div>
                    
                    <form className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">M-Pesa Number (Lipa Namba)</label>
                        <input
                          type="text"
                          value={formData.lipaNamba.mpesaNumber}
                          onChange={(e) => handleInputChange('lipaNamba', 'mpesaNumber', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Your M-Pesa number"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
                        <input
                          type="text"
                          value={formData.lipaNamba.accountName}
                          onChange={(e) => handleInputChange('lipaNamba', 'accountName', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Name registered with M-Pesa"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Payment Method</label>
                        <select
                          value={formData.lipaNamba.preferredPaymentMethod}
                          onChange={(e) => handleInputChange('lipaNamba', 'preferredPaymentMethod', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="mpesa">M-Pesa</option>
                          <option value="bank">Bank Transfer</option>
                          <option value="tigopesa">Tigo Pesa</option>
                          <option value="airtelmoney">Airtel Money</option>
                        </select>
                      </div>
                      
                      {saveSuccess && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                          Lipa Namba information saved successfully!
                        </div>
                      )}
                      
                      {saveError && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                          {saveError}
                        </div>
                      )}
                      
                      <div>
                        <button
                          type="button"
                          onClick={() => handleSaveProfile('lipaNamba')}
                          disabled={saving}
                          className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
                        >
                          {saving ? 'Saving...' : 'Save Lipa Namba Details'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
                
                {/* Payment Details Form */}
                {activeForm === 'payment' && (
                  <div>
                    <div className="flex items-center mb-6">
                      <FaIdCard className="text-purple-600 mr-3 text-xl" />
                      <h2 className="text-2xl font-bold text-gray-800">Payment Details</h2>
                    </div>
                    
                    <form className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                        <input
                          type="text"
                          value={formData.payment.bankName}
                          onChange={(e) => handleInputChange('payment', 'bankName', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Your bank name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                        <input
                          type="text"
                          value={formData.payment.accountNumber}
                          onChange={(e) => handleInputChange('payment', 'accountNumber', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Your account number"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Branch Name</label>
                        <input
                          type="text"
                          value={formData.payment.branchName}
                          onChange={(e) => handleInputChange('payment', 'branchName', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Your bank branch"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">SWIFT Code (Optional)</label>
                        <input
                          type="text"
                          value={formData.payment.swiftCode}
                          onChange={(e) => handleInputChange('payment', 'swiftCode', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Bank SWIFT code"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tax ID (Optional)</label>
                        <input
                          type="text"
                          value={formData.payment.taxId}
                          onChange={(e) => handleInputChange('payment', 'taxId', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Your tax identification number"
                        />
                      </div>
                      
                      {saveSuccess && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                          Payment information saved successfully!
                        </div>
                      )}
                      
                      {saveError && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                          {saveError}
                        </div>
                      )}
                      
                      <div>
                        <button
                          type="button"
                          onClick={() => handleSaveProfile('payment')}
                          disabled={saving}
                          className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
                        >
                          {saving ? 'Saving...' : 'Save Payment Details'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
                
                {/* Residency Form */}
                {activeForm === 'residency' && (
                  <div>
                    <div className="flex items-center mb-6">
                      <FaHome className="text-purple-600 mr-3 text-xl" />
                      <h2 className="text-2xl font-bold text-gray-800">Residency Information</h2>
                    </div>
                    
                    <form className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <input
                          type="text"
                          value={formData.residency.address}
                          onChange={(e) => handleInputChange('residency', 'address', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Your street address"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                        <input
                          type="text"
                          value={formData.residency.city}
                          onChange={(e) => handleInputChange('residency', 'city', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Your city"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Region/State</label>
                        <input
                          type="text"
                          value={formData.residency.region}
                          onChange={(e) => handleInputChange('residency', 'region', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Your region or state"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                        <input
                          type="text"
                          value={formData.residency.postalCode}
                          onChange={(e) => handleInputChange('residency', 'postalCode', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Your postal code"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                        <select
                          value={formData.residency.country}
                          onChange={(e) => handleInputChange('residency', 'country', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="Tanzania">Tanzania</option>
                          <option value="Kenya">Kenya</option>
                          <option value="Uganda">Uganda</option>
                          <option value="Rwanda">Rwanda</option>
                          <option value="Burundi">Burundi</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      
                      {saveSuccess && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                          Residency information saved successfully!
                        </div>
                      )}
                      
                      {saveError && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                          {saveError}
                        </div>
                      )}
                      
                      <div>
                        <button
                          type="button"
                          onClick={() => handleSaveProfile('residency')}
                          disabled={saving}
                          className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
                        >
                          {saving ? 'Saving...' : 'Save Residency Information'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
                
                {/* Work Information Form */}
                {activeForm === 'work' && (
                  <div>
                    <div className="flex items-center mb-6">
                      <FaBriefcase className="text-purple-600 mr-3 text-xl" />
                      <h2 className="text-2xl font-bold text-gray-800">Work Information</h2>
                    </div>
                    
                    <form className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                        <input
                          type="text"
                          value={formData.work.occupation}
                          onChange={(e) => handleInputChange('work', 'occupation', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Your occupation"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company/Organization Name</label>
                        <input
                          type="text"
                          value={formData.work.companyName}
                          onChange={(e) => handleInputChange('work', 'companyName', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Your company or organization"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Position/Title</label>
                        <input
                          type="text"
                          value={formData.work.position}
                          onChange={(e) => handleInputChange('work', 'position', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Your position or job title"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Work Address</label>
                        <input
                          type="text"
                          value={formData.work.workAddress}
                          onChange={(e) => handleInputChange('work', 'workAddress', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Your work address"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Work Phone</label>
                        <input
                          type="tel"
                          value={formData.work.workPhone}
                          onChange={(e) => handleInputChange('work', 'workPhone', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Your work phone number"
                        />
                      </div>
                      
                      {saveSuccess && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                          Work information saved successfully!
                        </div>
                      )}
                      
                      {saveError && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                          {saveError}
                        </div>
                      )}
                      
                      <div>
                        <button
                          type="button"
                          onClick={() => handleSaveProfile('work')}
                          disabled={saving}
                          className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
                        >
                          {saving ? 'Saving...' : 'Save Work Information'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}