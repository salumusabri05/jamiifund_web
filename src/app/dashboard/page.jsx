"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FaChartLine, FaCreditCard, FaUsers, FaExclamationCircle, 
         FaPlus, FaList, FaCalendarAlt, FaExternalLinkAlt, FaEdit,
         FaUser, FaBuilding, FaFileUpload, FaIdCard, FaCheckCircle,
         FaPencilAlt, FaSave, FaTimes, FaMoneyBillWave } from 'react-icons/fa';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [userCampaigns, setUserCampaigns] = useState([]);
  const [stats, setStats] = useState({
    totalRaised: 0,
    activeCampaigns: 0,
    totalDonors: 0,
    pendingWithdrawals: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
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
    username: '',
    avatarUrl: ''
  });
  const [paymentData, setPaymentData] = useState({
    bankName: '',
    bankAccountNumber: '',
    accountName: '',
    bankBranch: '',
    mobileNetwork: '',
    phoneNumber: '',
    lipaNamba: '',
    paymentType: 'bank',
    preferred: false,
    verified: false,
    notes: ''
  });
  const [verificationData, setVerificationData] = useState({
    idType: 'nationalId',
    idNumber: '',
    idFrontUrl: '',
    idBackUrl: '',
    status: 'unverified'
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingPayment, setIsEditingPayment] = useState(false);
  const [isEditingVerification, setIsEditingVerification] = useState(false);
  const [notification, setNotification] = useState(null);
  const [pendingVerifications, setPendingVerifications] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const supabase = createClientComponentClient();
  
  // Check if user is admin using admin_roles table
  useEffect(() => {
    async function checkAdminStatus() {
      if (!user) return;
      
      try {
        // Query the admin_roles table to check if user's UUID exists
        const { data, error } = await supabase
          .from('admin_roles')
          .select('role, permissions')
          .eq('user_id', user.uid);
          
        if (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
          return;
        }
        
        // Set isAdmin to true if the user's UUID was found in the admin_roles table
        setIsAdmin(data && data.length > 0);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      }
    }
    
    if (user) {
      checkAdminStatus();
    }
  }, [user, supabase]);

  useEffect(() => {
    async function fetchUserData() {
      if (!user) {
        return;
      }
    
      try {
        // Fetch user's campaigns
        const { data: campaigns, error } = await supabase
          .from('campaigns')
          .select('*, donations(*)')
          .eq('created_by', user.uid);
          
        if (error) throw error;
        
        // Fetch user profile data
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.uid)
          .single();
          
        if (profileError && profileError.code !== 'PGRST116') {
          throw profileError;
        }
        
        // Fetch payment methods
        const { data: payment, error: paymentError } = await supabase
          .from('payment_methods')
          .select('*')
          .eq('user_id', user.uid)
          .single();
          
        if (paymentError && paymentError.code !== 'PGRST116') {
          throw paymentError;
        }
        
        // Fetch verification data
        const { data: verification, error: verificationError } = await supabase
          .from('verifications')
          .select('*')
          .eq('user_id', user.uid)
          .single();
          
        if (verificationError && verificationError.code !== 'PGRST116') {
          throw verificationError;
        }
        
        // Calculate statistics
        const totalRaised = campaigns?.reduce((sum, campaign) => 
          sum + (campaign.current_amount || 0), 0) || 0;
        
        const activeCampaigns = campaigns?.filter(c => 
          new Date(c.end_date) > new Date()).length || 0;
          
        const uniqueDonorIds = new Set();
        campaigns?.forEach(campaign => {
          campaign.donations?.forEach(donation => {
            uniqueDonorIds.add(donation.donor_id || donation.id);
          });
        });
        
        setUserCampaigns(campaigns || []);
        setStats({
          totalRaised,
          activeCampaigns,
          totalDonors: uniqueDonorIds.size,
          pendingWithdrawals: 0
        });
        
        // Update form data if profile exists
        if (profile) {
          setProfileData({
            fullName: profile.full_name || user.displayName || '',
            email: profile.email || user.email || '',
            phone: profile.phone || '',
            bio: profile.bio || '',
            location: profile.location || '',
            website: profile.website || '',
            address: profile.address || '',
            city: profile.city || '',
            region: profile.region || '',
            postalCode: profile.postal_code || '',
            isOrganization: profile.is_organization || false,
            organizationName: profile.organization_name || '',
            organizationRegNumber: profile.organization_reg_number || '',
            organizationType: profile.organization_type || '',
            organizationDescription: profile.organization_description || '',
            username: profile.username || '',
            avatarUrl: profile.avatar_url || ''
          });
        } else {
          // Set defaults from Firebase user if no profile exists
          setProfileData(prev => ({
            ...prev,
            fullName: user.displayName || '',
            email: user.email || '',
          }));
        }
        
        // Update payment data if exists
        if (payment) {
          setPaymentData({
            bankName: payment.bank_name || '',
            bankAccountNumber: payment.bank_account_number || '',
            accountName: payment.account_name || '',
            bankBranch: payment.bank_branch || '',
            mobileNetwork: payment.mobile_network || '',
            phoneNumber: payment.phone_number || '',
            lipaNamba: payment.lipa_namba || '',
            paymentType: payment.payment_type || 'bank',
            preferred: payment.preferred || false,
            verified: payment.verified || false,
            notes: payment.notes || ''
          });
        }
        
        // Update verification data if exists
        if (verification) {
          setVerificationData({
            idType: verification.id_type || 'nationalId',
            idNumber: verification.id_number || '',
            idFrontUrl: verification.id_front_url || '',
            idBackUrl: verification.id_back_url || '',
            status: verification.status || 'unverified'
          });
        }
        
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        showNotification('Failed to load your information', 'error');
      }
    }
    
    if (!loading) {
      fetchUserData();
    }
  }, [user, loading, supabase]);
  
  useEffect(() => {
    // Only fetch pending verifications if user is admin
    if (!isAdmin) return;
    
    async function fetchPendingVerifications() {
      const { data, error } = await supabase
        .from('verifications')
        .select(`
          id, 
          identity_type, 
          identity_number,
          id_front_url,
          id_back_url,
          status,
          created_at,
          profiles(full_name, email, is_organization, organization_name)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching verifications:', error);
        return;
      }
      
      setPendingVerifications(data || []);
    }
    
    fetchPendingVerifications();
  }, [supabase, isAdmin]);
  
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };
  
  const handleProfileChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handlePaymentChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPaymentData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleVerificationChange = (e) => {
    const { name, value } = e.target;
    setVerificationData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add missing file upload handlers
  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;
    
    try {
      // Show loading state
      showNotification('Uploading image...', 'info');
      
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.uid}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `avatar/${fileName}`;
      
      // Upload the file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);
        
      // Update profile with new avatar URL
      setProfileData(prev => ({
        ...prev,
        avatarUrl: publicUrl
      }));
      
      showNotification('Image uploaded successfully', 'success');
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      showNotification('Failed to upload image', 'error');
    }
  };
  
  const handleIdFrontUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;
    
    try {
      showNotification('Uploading document...', 'info');
      
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.uid}-id-front-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `verifications/${fileName}`;
      
      // Upload the file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);
        
      // Update state with new URL
      setVerificationData(prev => ({
        ...prev,
        idFrontUrl: publicUrl
      }));
      
      showNotification('ID front uploaded successfully', 'success');
    } catch (error) {
      console.error('Error uploading ID front:', error);
      showNotification('Failed to upload document', 'error');
    }
  };
  
  const handleIdBackUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;
    
    try {
      showNotification('Uploading document...', 'info');
      
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.uid}-id-back-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `verifications/${fileName}`;
      
      // Upload the file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);
        
      // Update state with new URL
      setVerificationData(prev => ({
        ...prev,
        idBackUrl: publicUrl
      }));
      
      showNotification('ID back uploaded successfully', 'success');
    } catch (error) {
      console.error('Error uploading ID back:', error);
      showNotification('Failed to upload document', 'error');
    }
  };
  
  const saveProfileData = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.uid,
          full_name: profileData.fullName,
          email: profileData.email,
          phone: profileData.phone,
          bio: profileData.bio,
          location: profileData.location,
          website: profileData.website,
          address: profileData.address,
          city: profileData.city,
          region: profileData.region,
          postal_code: profileData.postalCode,
          is_organization: profileData.isOrganization,
          organization_name: profileData.organizationName,
          organization_reg_number: profileData.organizationRegNumber,
          organization_type: profileData.organizationType,
          organization_description: profileData.organizationDescription,
          username: profileData.username,
          avatar_url: profileData.avatarUrl,
          updated_at: new Date().toISOString()
        });
        
      if (error) throw error;
      
      setIsEditingProfile(false);
      showNotification('Profile information saved successfully');
    } catch (error) {
      console.error('Error saving profile:', error);
      showNotification('Failed to save profile information', 'error');
    }
  };
  
  const savePaymentData = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('payment_methods')
        .upsert({
          user_id: user.uid,
          bank_name: paymentData.bankName,
          bank_account_number: paymentData.bankAccountNumber,
          account_name: paymentData.accountName,
          bank_branch: paymentData.bankBranch,
          mobile_network: paymentData.mobileNetwork,
          phone_number: paymentData.phoneNumber,
          lipa_namba: paymentData.lipaNamba,
          payment_type: paymentData.paymentType,
          preferred: paymentData.preferred,
          verified: paymentData.verified,
          notes: paymentData.notes,
          updated_at: new Date().toISOString()
        });
        
      if (error) throw error;
      
      setIsEditingPayment(false);
      showNotification('Payment information saved successfully');
    } catch (error) {
      console.error('Error saving payment info:', error);
      showNotification('Failed to save payment information', 'error');
    }
  };
  
  const saveVerificationData = async () => {
    if (!user) return;
    
    // Validate required fields
    if (!verificationData.idType || !verificationData.idNumber || !verificationData.idFrontUrl) {
      showNotification('Please provide ID type, number and upload the front of your ID', 'error');
      return;
    }
    
    try {
      const { error } = await supabase
        .from('verifications')
        .upsert({
          user_id: user.uid,
          id_type: verificationData.idType,
          id_number: verificationData.idNumber,
          id_front_url: verificationData.idFrontUrl,
          id_back_url: verificationData.idBackUrl,
          status: 'pending', // Always set to pending when user submits
          updated_at: new Date().toISOString()
        });
        
      if (error) throw error;
      
      setVerificationData(prev => ({
        ...prev,
        status: 'pending'
      }));
      
      setIsEditingVerification(false);
      showNotification('Verification information submitted for review');
    } catch (error) {
      console.error('Error saving verification info:', error);
      showNotification('Failed to submit verification information', 'error');
    }
  };
  
  const approveVerification = async (id) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('verifications')
        .update({
          status: 'approved',
          verified_by: user.uid,
          verified_at: new Date().toISOString()
        })
        .eq('id', id);
        
      if (error) {
        console.error('Error approving verification:', error);
        return;
      }
      
      // Log the verification action
      await supabase
        .from('verification_logs')
        .insert({
          admin_id: user.uid,
          verification_type: 'identity',
          entity_id: id,
          action: 'approved',
          notes: 'Identity verified'
        });
        
      // Refresh the list
      setPendingVerifications(pendingVerifications.filter(v => v.id !== id));
      showNotification('Verification approved successfully');
    } catch (error) {
      console.error('Error approving verification:', error);
      showNotification('Failed to approve verification', 'error');
    }
  };
  
  const rejectVerification = async (id, reason) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('verifications')
        .update({
          status: 'rejected',
          rejection_reason: reason,
          verified_by: user.uid,
          verified_at: new Date().toISOString()
        })
        .eq('id', id);
        
      if (error) {
        console.error('Error rejecting verification:', error);
        return;
      }
      
      // Log the verification action
      await supabase
        .from('verification_logs')
        .insert({
          admin_id: user.uid,
          verification_type: 'identity',
          entity_id: id,
          action: 'rejected',
          notes: reason
        });
        
      // Refresh the list
      setPendingVerifications(pendingVerifications.filter(v => v.id !== id));
      showNotification('Verification rejected');
    } catch (error) {
      console.error('Error rejecting verification:', error);
      showNotification('Failed to reject verification', 'error');
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          {notification && (
            <div className={`mb-6 p-4 rounded-lg ${
              notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {notification.message}
            </div>
          )}
          
          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <h1 className="text-3xl font-bold mb-4 md:mb-0">
              {isAdmin ? 'Admin Dashboard' : 'Dashboard'}
            </h1>
            
            <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
              <button 
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 rounded-md transition ${
                  activeTab === 'overview' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Overview
              </button>
              <button 
                onClick={() => setActiveTab('profile')}
                className={`px-4 py-2 rounded-md transition ${
                  activeTab === 'profile' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Profile
              </button>
              <button 
                onClick={() => setActiveTab('payments')}
                className={`px-4 py-2 rounded-md transition ${
                  activeTab === 'payments' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Payments
              </button>
              <button 
                onClick={() => setActiveTab('verification')}
                className={`px-4 py-2 rounded-md transition ${
                  activeTab === 'verification' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Verification
              </button>
            </div>
          </div>
          
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <>
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                      <FaChartLine className="text-purple-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-700">Total Raised</h3>
                  </div>
                  <p className="text-3xl font-bold text-purple-600">Tsh {stats.totalRaised.toLocaleString()}</p>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                      <FaList className="text-green-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-700">Active Campaigns</h3>
                  </div>
                  <p className="text-3xl font-bold text-green-600">{stats.activeCampaigns}</p>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <FaUsers className="text-blue-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-700">Total Donors</h3>
                  </div>
                  <p className="text-3xl font-bold text-blue-600">{stats.totalDonors}</p>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                      <FaCreditCard className="text-yellow-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-700">Pending Withdrawals</h3>
                  </div>
                  <p className="text-3xl font-bold text-yellow-600">Tsh {stats.pendingWithdrawals.toLocaleString()}</p>
                </div>
              </div>
              
              {/* My Campaigns Section */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-10">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">My Campaigns</h2>
                  <Link 
                    href="/campaigns/create" 
                    className="flex items-center rounded-full bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 transition"
                  >
                    <FaPlus className="mr-2" /> New Campaign
                  </Link>
                </div>
                
                {userCampaigns.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="py-3 text-left text-gray-700">Campaign</th>
                          <th className="py-3 text-left text-gray-700">Status</th>
                          <th className="py-3 text-left text-gray-700">Raised</th>
                          <th className="py-3 text-left text-gray-700">Goal</th>
                          <th className="py-3 text-left text-gray-700">Ends</th>
                          <th className="py-3 text-left text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userCampaigns.map(campaign => {
                          const endDate = new Date(campaign.end_date);
                          const isActive = endDate > new Date();
                          const progress = campaign.goal_amount 
                            ? Math.round((campaign.current_amount / campaign.goal_amount) * 100) 
                            : 0;
                          
                          return (
                            <tr key={campaign.id} className="border-b border-gray-200 hover:bg-gray-50">
                              <td className="py-4">
                                <div className="font-medium text-gray-800">{campaign.title}</div>
                                <div className="w-24 h-1.5 bg-gray-200 rounded-full mt-1">
                                  <div 
                                    className="h-1.5 bg-purple-600 rounded-full" 
                                    style={{ width: `${Math.min(progress, 100)}%` }}
                                  ></div>
                                </div>
                              </td>
                              <td className="py-4">
                                <span className={`px-3 py-1 rounded-full text-xs ${
                                  isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {isActive ? 'Active' : 'Ended'}
                                </span>
                              </td>
                              <td className="py-4">Tsh {campaign.current_amount?.toLocaleString() || 0}</td>
                              <td className="py-4">Tsh {campaign.goal_amount?.toLocaleString() || 0}</td>
                              <td className="py-4">
                                <div className="flex items-center text-gray-600">
                                  <FaCalendarAlt className="mr-2 text-xs" />
                                  {endDate.toLocaleDateString()}
                                </div>
                              </td>
                              <td className="py-4">
                                <div className="flex space-x-2">
                                  <Link 
                                    href={`/campaigns/${campaign.id}`}
                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition"
                                    title="View"
                                  >
                                    <FaExternalLinkAlt />
                                  </Link>
                                  <Link 
                                    href={`/campaigns/${campaign.id}/edit`}
                                    className="p-2 text-purple-600 hover:bg-purple-50 rounded-full transition"
                                    title="Edit"
                                  >
                                    <FaEdit />
                                  </Link>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-lg">
                    <FaList className="text-4xl text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">No campaigns yet</h3>
                    <p className="text-gray-500 mb-4">Create your first fundraising campaign to get started</p>
                    <Link 
                      href="/campaigns/create" 
                      className="inline-flex items-center rounded-full bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 transition"
                    >
                      <FaPlus className="mr-2" /> Start Campaign
                    </Link>
                  </div>
                )}
              </div>
              
              {/* Recent Activity Section */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-6">Recent Activity</h2>
                
                {/* Activity would be populated from a separate query */}
                <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-lg">
                  <p className="text-gray-500">No recent activity to display</p>
                </div>
              </div>
            </>
          )}
          
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Profile Information</h2>
                {!isEditingProfile ? (
                  <button 
                    onClick={() => setIsEditingProfile(true)}
                    className="flex items-center text-purple-600 hover:text-purple-700"
                  >
                    <FaPencilAlt className="mr-2" /> Edit
                  </button>
                ) : (
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => setIsEditingProfile(false)}
                      className="flex items-center text-gray-500 hover:text-gray-700"
                    >
                      <FaTimes className="mr-2" /> Cancel
                    </button>
                    <button 
                      onClick={saveProfileData}
                      className="flex items-center text-green-600 hover:text-green-700"
                    >
                      <FaSave className="mr-2" /> Save
                    </button>
                  </div>
                )}
              </div>
              
              {/* Profile Picture */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
                {isEditingProfile ? (
                  <div className="flex items-center space-x-4">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100">
                      {profileData.avatarUrl ? (
                        <img src={profileData.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <FaUser className="text-3xl" />
                        </div>
                      )}
                    </div>
                    
                    <label className="cursor-pointer px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition">
                      <span>Change Photo</span>
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleProfilePictureUpload} 
                      />
                    </label>
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100">
                    {profileData.avatarUrl ? (
                      <img src={profileData.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <FaUser className="text-3xl" />
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Personal Information */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    {isEditingProfile ? (
                      <input 
                        type="text"
                        name="fullName"
                        value={profileData.fullName}
                        onChange={handleProfileChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                        placeholder="Your full name"
                        required
                      />
                    ) : (
                      <p className="text-gray-800">{profileData.fullName || 'Not provided'}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    {isEditingProfile ? (
                      <input 
                        type="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleProfileChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                        placeholder="Your email"
                        disabled
                      />
                    ) : (
                      <p className="text-gray-800">{profileData.email}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    {isEditingProfile ? (
                      <input 
                        type="tel"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleProfileChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                        placeholder="Your phone number"
                      />
                    ) : (
                      <p className="text-gray-800">{profileData.phone || 'Not provided'}</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Address Information */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">Address Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    {isEditingProfile ? (
                      <input 
                        type="text"
                        name="address"
                        value={profileData.address}
                        onChange={handleProfileChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                        placeholder="Your street address"
                      />
                    ) : (
                      <p className="text-gray-800">{profileData.address || 'Not provided'}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    {isEditingProfile ? (
                      <input 
                        type="text"
                        name="city"
                        value={profileData.city}
                        onChange={handleProfileChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                        placeholder="Your city"
                      />
                    ) : (
                      <p className="text-gray-800">{profileData.city || 'Not provided'}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
                    {isEditingProfile ? (
                      <select
                        name="region"
                        value={profileData.region}
                        onChange={handleProfileChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                      >
                        <option value="">Select a region</option>
                        <option value="Arusha">Arusha</option>
                        <option value="Dar es Salaam">Dar es Salaam</option>
                        <option value="Dodoma">Dodoma</option>
                        <option value="Geita">Geita</option>
                        <option value="Iringa">Iringa</option>
                        <option value="Kagera">Kagera</option>
                        <option value="Katavi">Katavi</option>
                        <option value="Kigoma">Kigoma</option>
                        <option value="Kilimanjaro">Kilimanjaro</option>
                        <option value="Lindi">Lindi</option>
                        <option value="Manyara">Manyara</option>
                        <option value="Mara">Mara</option>
                        <option value="Mbeya">Mbeya</option>
                        <option value="Morogoro">Morogoro</option>
                        <option value="Mtwara">Mtwara</option>
                        <option value="Mwanza">Mwanza</option>
                        <option value="Njombe">Njombe</option>
                        <option value="Pwani">Pwani</option>
                        <option value="Rukwa">Rukwa</option>
                        <option value="Ruvuma">Ruvuma</option>
                        <option value="Shinyanga">Shinyanga</option>
                        <option value="Simiyu">Simiyu</option>
                        <option value="Singida">Singida</option>
                        <option value="Songwe">Songwe</option>
                        <option value="Tabora">Tabora</option>
                        <option value="Tanga">Tanga</option>
                        <option value="Zanzibar">Zanzibar</option>
                      </select>
                    ) : (
                      <p className="text-gray-800">{profileData.region || 'Not provided'}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                    {isEditingProfile ? (
                      <input 
                        type="text"
                        name="postalCode"
                        value={profileData.postalCode}
                        onChange={handleProfileChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                        placeholder="Your postal code"
                      />
                    ) : (
                      <p className="text-gray-800">{profileData.postalCode || 'Not provided'}</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Organization Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">Organization Information</h3>
                
                <div className="mb-4">
                  {isEditingProfile ? (
                    <div className="flex items-center mb-4">
                      <input 
                        type="checkbox"
                        id="isOrganization"
                        name="isOrganization"
                        checked={profileData.isOrganization}
                        onChange={handleProfileChange}
                        className="mr-2 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <label htmlFor="isOrganization" className="text-sm font-medium text-gray-700">
                        I am fundraising for an organization
                      </label>
                    </div>
                  ) : (
                    profileData.isOrganization && <p className="text-purple-600 font-medium mb-4">Fundraising for an organization</p>
                  )}
                </div>
                
                {(isEditingProfile && profileData.isOrganization) || (!isEditingProfile && profileData.isOrganization) ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
                      {isEditingProfile ? (
                        <input 
                          type="text"
                          name="organizationName"
                          value={profileData.organizationName}
                          onChange={handleProfileChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                          placeholder="Name of the organization"
                        />
                      ) : (
                        <p className="text-gray-800">{profileData.organizationName || 'Not provided'}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
                      {isEditingProfile ? (
                        <input 
                          type="text"
                          name="organizationRegNumber"
                          value={profileData.organizationRegNumber}
                          onChange={handleProfileChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                          placeholder="Registration number"
                        />
                      ) : (
                        <p className="text-gray-800">{profileData.organizationRegNumber || 'Not provided'}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Organization Type</label>
                      {isEditingProfile ? (
                        <select
                          name="organizationType"
                          value={profileData.organizationType}
                          onChange={handleProfileChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                        >
                          <option value="">Select organization type</option>
                          <option value="NGO">NGO</option>
                          <option value="Non-profit">Non-profit</option>
                          <option value="School">School</option>
                          <option value="Religious">Religious Organization</option>
                          <option value="Community">Community Group</option>
                          <option value="Other">Other</option>
                        </select>
                      ) : (
                        <p className="text-gray-800">{profileData.organizationType || 'Not provided'}</p>
                      )}
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Organization Description</label>
                      {isEditingProfile ? (
                        <textarea
                          name="organizationDescription"
                          value={profileData.organizationDescription}
                          onChange={handleProfileChange}
                          rows={4}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                          placeholder="Brief description of the organization"
                        ></textarea>
                      ) : (
                        <p className="text-gray-800">{profileData.organizationDescription || 'Not provided'}</p>
                      )}
                    </div>
                  </div>
                ) : !isEditingProfile ? (
                  <p className="text-gray-500 italic">Not fundraising as an organization</p>
                ) : null}
              </div>
              
              {/* Add these fields to your profile form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  {isEditingProfile ? (
                    <input 
                      type="text"
                      name="username"
                      value={profileData.username}
                      onChange={handleProfileChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                      placeholder="Choose a username"
                    />
                  ) : (
                    <p className="text-gray-800">{profileData.username || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  {isEditingProfile ? (
                    <input 
                      type="url"
                      name="website"
                      value={profileData.website}
                      onChange={handleProfileChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                      placeholder="Your website URL"
                    />
                  ) : (
                    <p className="text-gray-800">{profileData.website || 'Not provided'}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  {isEditingProfile ? (
                    <textarea
                      name="bio"
                      value={profileData.bio}
                      onChange={handleProfileChange}
                      rows={3}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                      placeholder="Tell us about yourself"
                    ></textarea>
                  ) : (
                    <p className="text-gray-800">{profileData.bio || 'Not provided'}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  {isEditingProfile ? (
                    <input 
                      type="text"
                      name="location"
                      value={profileData.location}
                      onChange={handleProfileChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                      placeholder="Your general location"
                    />
                  ) : (
                    <p className="text-gray-800">{profileData.location || 'Not provided'}</p>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Payment Information Tab */}
          {activeTab === 'payments' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Payment Information</h2>
                {!isEditingPayment ? (
                  <button 
                    onClick={() => setIsEditingPayment(true)}
                    className="flex items-center text-purple-600 hover:text-purple-700"
                  >
                    <FaPencilAlt className="mr-2" /> Edit
                  </button>
                ) : (
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => setIsEditingPayment(false)}
                      className="flex items-center text-gray-500 hover:text-gray-700"
                    >
                      <FaTimes className="mr-2" /> Cancel
                    </button>
                    <button 
                      onClick={savePaymentData}
                      className="flex items-center text-green-600 hover:text-green-700"
                    >
                      <FaSave className="mr-2" /> Save
                    </button>
                  </div>
                )}
              </div>
              
              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  Add your payment details to receive funds from your campaigns. This information is kept secure and only used for processing withdrawals.
                </p>
                
                {isEditingPayment && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Type</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <label className={`flex items-center p-3 border rounded-md cursor-pointer ${paymentData.paymentType === 'bank' ? 'border-purple-500 bg-purple-50' : 'border-gray-300'}`}>
                        <input 
                          type="radio" 
                          name="paymentType" 
                          value="bank" 
                          checked={paymentData.paymentType === 'bank'} 
                          onChange={handlePaymentChange}
                          className="mr-2 h-4 w-4 text-purple-600"
                        />
                        <span>Bank Transfer</span>
                      </label>
                      
                      <label className={`flex items-center p-3 border rounded-md cursor-pointer ${paymentData.paymentType === 'mobile' ? 'border-purple-500 bg-purple-50' : 'border-gray-300'}`}>
                        <input 
                          type="radio" 
                          name="paymentType" 
                          value="mobile" 
                          checked={paymentData.paymentType === 'mobile'} 
                          onChange={handlePaymentChange}
                          className="mr-2 h-4 w-4 text-purple-600"
                        />
                        <span>Mobile Money</span>
                      </label>
                      
                      <label className={`flex items-center p-3 border rounded-md cursor-pointer ${paymentData.paymentType === 'lipa_namba' ? 'border-purple-500 bg-purple-50' : 'border-gray-300'}`}>
                        <input 
                          type="radio" 
                          name="paymentType" 
                          value="lipa_namba" 
                          checked={paymentData.paymentType === 'lipa_namba'} 
                          onChange={handlePaymentChange}
                          className="mr-2 h-4 w-4 text-purple-600"
                        />
                        <span>Lipa Namba</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Bank Account Details */}
              <div className="mb-8">
                <h3 className="flex items-center text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
                  <FaMoneyBillWave className="mr-2 text-purple-600" /> 
                  Bank Account Details
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                    {isEditingPayment ? (
                      <select
                        name="bankName"
                        value={paymentData.bankName}
                        onChange={handlePaymentChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                      >
                        <option value="">Select bank</option>
                        <option value="CRDB">CRDB Bank</option>
                        <option value="NMB">NMB Bank</option>
                        <option value="NBC">NBC Bank</option>
                        <option value="Equity">Equity Bank</option>
                        <option value="Stanbic">Stanbic Bank</option>
                        <option value="Exim">Exim Bank</option>
                        <option value="Other">Other</option>
                      </select>
                    ) : (
                      <p className="text-gray-800">{paymentData.bankName || 'Not provided'}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                    {isEditingPayment ? (
                      <input 
                        type="text"
                        name="bankAccountNumber"
                        value={paymentData.bankAccountNumber}
                        onChange={handlePaymentChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                        placeholder="Your account number"
                      />
                    ) : (
                      <p className="text-gray-800">{paymentData.bankAccountNumber || 'Not provided'}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
                    {isEditingPayment ? (
                      <input 
                        type="text"
                        name="accountName"
                        value={paymentData.accountName}
                        onChange={handlePaymentChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                        placeholder="Name on the account"
                      />
                    ) : (
                      <p className="text-gray-800">{paymentData.accountName || 'Not provided'}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                    {isEditingPayment ? (
                      <input 
                        type="text"
                        name="bankBranch"
                        value={paymentData.bankBranch}
                        onChange={handlePaymentChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                        placeholder="Bank branch"
                      />
                    ) : (
                      <p className="text-gray-800">{paymentData.bankBranch || 'Not provided'}</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Mobile Money Details */}
              <div className="mb-8">
                <h3 className="flex items-center text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
                  <FaMoneyBillWave className="mr-2 text-purple-600" /> 
                  Mobile Money Details
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Network</label>
                    {isEditingPayment ? (
                      <select
                        name="mobileNetwork"
                        value={paymentData.mobileNetwork}
                        onChange={handlePaymentChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                      >
                        <option value="">Select network</option>
                        <option value="Vodacom">Vodacom</option>
                        <option value="Airtel">Airtel</option>
                        <option value="Tigo">Tigo</option>
                        <option value="Halotel">Halotel</option>
                        <option value="TTCL">TTCL</option>
                        <option value="Zantel">Zantel</option>
                      </select>
                    ) : (
                      <p className="text-gray-800">{paymentData.mobileNetwork || 'Not provided'}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    {isEditingPayment ? (
                      <input 
                        type="tel"
                        name="phoneNumber"
                        value={paymentData.phoneNumber}
                        onChange={handlePaymentChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                        placeholder="Mobile money number"
                      />
                    ) : (
                      <p className="text-gray-800">{paymentData.phoneNumber || 'Not provided'}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lipa Namba</label>
                    {isEditingPayment ? (
                      <input 
                        type="text"
                        name="lipaNamba"
                        value={paymentData.lipaNamba}
                        onChange={handlePaymentChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                        placeholder="Your Lipa Namba"
                      />
                    ) : (
                      <p className="text-gray-800">{paymentData.lipaNamba || 'Not provided'}</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Additional Payment Details */}
              <div className="mb-8">
                <h3 className="flex items-center text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
                  <FaMoneyBillWave className="mr-2 text-purple-600" /> 
                  Payment Preferences
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Type</label>
                    {isEditingPayment ? (
                      <select
                        name="paymentType"
                        value={paymentData.paymentType}
                        onChange={handlePaymentChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                      >
                        <option value="bank">Bank Account</option>
                        <option value="mobile">Mobile Money</option>
                        <option value="lipa_namba">Lipa Namba</option>
                      </select>
                    ) : (
                      <p className="text-gray-800">
                        {paymentData.paymentType === 'bank' ? 'Bank Account' :
                         paymentData.paymentType === 'mobile' ? 'Mobile Money' :
                         paymentData.paymentType === 'lipa_namba' ? 'Lipa Namba' : 'Not specified'}
                      </p>
                    )}
                  </div>
                  
                  {isEditingPayment && (
                    <div className="flex items-center h-full">
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          name="preferred"
                          checked={paymentData.preferred}
                          onChange={(e) => setPaymentData(prev => ({...prev, preferred: e.target.checked}))}
                          className="form-checkbox h-5 w-5 text-purple-600"
                        />
                        <span className="ml-2 text-gray-700">Set as preferred payment method</span>
                      </label>
                    </div>
                  )}
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
                    {isEditingPayment ? (
                      <textarea
                        name="notes"
                        value={paymentData.notes}
                        onChange={handlePaymentChange}
                        rows={3}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                        placeholder="Any special instructions for payments"
                      ></textarea>
                    ) : (
                      <p className="text-gray-800">{paymentData.notes || 'No additional notes'}</p>
                    )}
                  </div>
                </div>
                
                {paymentData.verified && (
                  <div className="mt-4 flex items-center text-green-700">
                    <FaCheckCircle className="mr-2" />
                    <span>This payment method has been verified</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Verification Tab */}
          {activeTab === 'verification' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Account Verification</h2>
                {!isEditingVerification ? (
                  <button 
                    onClick={() => setIsEditingVerification(true)}
                    className="flex items-center text-purple-600 hover:text-purple-700"
                    disabled={verificationData.verificationStatus === 'approved'}
                  >
                    <FaPencilAlt className="mr-2" /> Edit
                  </button>
                ) : (
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => setIsEditingVerification(false)}
                      className="flex items-center text-gray-500 hover:text-gray-700"
                    >
                      <FaTimes className="mr-2" /> Cancel
                    </button>
                    <button 
                      onClick={saveVerificationData}
                      className="flex items-center text-green-600 hover:text-green-700"
                    >
                      <FaSave className="mr-2" /> Submit
                    </button>
                  </div>
                )}
              </div>
              
              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  Verify your account to establish credibility and build trust with donors. Verified accounts are more likely to receive donations.
                </p>
                
                <div className="mb-4">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    verificationData.status === 'approved' ? 'bg-green-100 text-green-800' :
                    verificationData.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {verificationData.status === 'approved' ? (
                      <>
                        <FaCheckCircle className="mr-1" /> Verified
                      </>
                    ) : verificationData.status === 'pending' ? (
                      <>
                        <FaExclamationCircle className="mr-1" /> Pending Review
                      </>
                    ) : (
                      <>
                        <FaExclamationCircle className="mr-1" /> Not Verified
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Identity Verification */}
              <div className="mb-8">
                <h3 className="flex items-center text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
                  <FaIdCard className="mr-2 text-purple-600" /> 
                  Identity Verification
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ID Type</label>
                    {isEditingVerification ? (
                      <select
                        name="identityType"
                        value={verificationData.identityType}
                        onChange={handleVerificationChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                        disabled={verificationData.verificationStatus === 'approved'}
                      >
                        <option value="nationalId">National ID</option>
                        <option value="passport">Passport</option>
                        <option value="votersCard">Voter's Card</option>
                        <option value="drivingLicense">Driving License</option>
                      </select>
                    ) : (
                      <p className="text-gray-800">
                        {verificationData.idType === 'nationalId' ? 'National ID' : 
                         verificationData.idType === 'passport' ? 'Passport' :
                         verificationData.idType === 'votersCard' ? "Voter's Card" :
                         verificationData.idType === 'drivingLicense' ? "Driving License" :
                         'Not provided'}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ID Number</label>
                    {isEditingVerification ? (
                      <input 
                        type="text"
                        name="identityNumber"
                        value={verificationData.identityNumber}
                        onChange={handleVerificationChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                        placeholder="Your ID number"
                        disabled={verificationData.verificationStatus === 'approved'}
                      />
                    ) : (
                      <p className="text-gray-800">{verificationData.idNumber || 'Not provided'}</p>
                    )}
                  </div>
                </div>
                
                {isEditingVerification && (
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload ID Document (Front) <span className="text-red-500">*</span></label>
                    <div className="flex items-center justify-center w-full">
                      {verificationData.idFrontUrl ? (
                        <div className="relative w-full">
                          <div className="border rounded-lg p-2 bg-gray-50">
                            <div className="flex items-center">
                              <FaFileUpload className="text-green-600 mr-2" />
                              <span className="text-sm text-gray-700">Document uploaded</span>
                            </div>
                            <a 
                              href={verificationData.idFrontUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:underline mt-1 inline-block"
                            >
                              View document
                            </a>
                          </div>
                          <button 
                            onClick={() => setVerificationData(prev => ({...prev, idFrontUrl: ''}))}
                            className="absolute top-1 right-1 text-gray-500 hover:text-red-500"
                            title="Remove"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                          <div className="flex flex-col items-center justify-center pt-7">
                            <FaFileUpload className="w-8 h-8 text-gray-400" />
                            <p className="pt-1 text-sm text-gray-600 font-medium">Click to upload or drag and drop</p>
                            <p className="text-xs text-gray-500">PNG, JPG or PDF (Max 2MB)</p>
                          </div>
                          <input 
                            type="file" 
                            className="hidden" 
                            onChange={handleIdFrontUpload} 
                            accept="image/png,image/jpeg,application/pdf"
                          />
                        </label>
                      )}
                    </div>
                    
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Upload ID Document (Back)</label>
                      <div className="flex items-center justify-center w-full">
                        {verificationData.idBackUrl ? (
                          <div className="relative w-full">
                            <div className="border rounded-lg p-2 bg-gray-50">
                              <div className="flex items-center">
                                <FaFileUpload className="text-green-600 mr-2" />
                                <span className="text-sm text-gray-700">Document uploaded</span>
                              </div>
                              <a 
                                href={verificationData.idBackUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:underline mt-1 inline-block"
                              >
                                View document
                              </a>
                            </div>
                            <button 
                              onClick={() => setVerificationData(prev => ({...prev, idBackUrl: ''}))}
                              className="absolute top-1 right-1 text-gray-500 hover:text-red-500"
                              title="Remove"
                            >
                              <FaTimes />
                            </button>
                          </div>
                        ) : (
                          <label className="flex flex-col w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                            <div className="flex flex-col items-center justify-center pt-7">
                              <FaFileUpload className="w-8 h-8 text-gray-400" />
                              <p className="pt-1 text-sm text-gray-600 font-medium">Click to upload or drag and drop</p>
                              <p className="text-xs text-gray-500">PNG, JPG or PDF (Max 2MB)</p>
                            </div>
                            <input 
                              type="file" 
                              className="hidden" 
                              onChange={handleIdBackUpload} 
                              accept="image/png,image/jpeg,application/pdf"
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Verification Requirements */}
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-6">
                <div className="flex">
                  <FaExclamationCircle className="text-blue-400 flex-shrink-0 mt-1" />
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-700">Verification Requirements</h3>
                    <div className="mt-2 text-sm text-blue-600">
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Upload a clear photo or scan of your ID (front and back)</li>
                        <li>Ensure all information is clearly visible</li>
                        <li>For organizations, include registration certificates</li>
                        <li>Verification is usually completed within 1-3 business days</li>
                        <li>You'll be notified by email once verification is complete</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              {verificationData.verificationStatus === 'approved' && (
                <div className="bg-green-50 border-l-4 border-green-400 p-4 mt-6">
                  <div className="flex">
                    <FaCheckCircle className="text-green-400 flex-shrink-0 mt-1" />
                    <div className="ml-3">
                      <p className="text-sm text-green-700">
                        Your account is fully verified! You can now create campaigns with increased trust indicators.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Admin Verification Section - Only for admin user */}
          {isAdmin && (
            <div className="bg-white rounded-lg shadow-md p-6 mt-10">
              <h2 className="text-xl font-bold mb-4">Pending Verifications ({pendingVerifications.length})</h2>
              
              {pendingVerifications.length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-lg">
                  <p className="text-gray-500">No pending verifications</p>
                </div>
              ) : (
                pendingVerifications.map(verification => (
                  <div key={verification.id} className="mb-6 p-4 border rounded-lg shadow-sm bg-gray-50">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{verification.profiles.full_name}</h3>
                        <p className="text-sm text-gray-600">{verification.profiles.email}</p>
                        {verification.profiles.is_organization && (
                          <p className="text-sm text-gray-600">Organization: {verification.profiles.organization_name}</p>
                        )}
                      </div>
                      
                      <div className="text-right">
                        <span className="text-xs rounded-full px-3 py-1 bg-yellow-100 text-yellow-800">
                          Pending Review
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">ID Type:</p>
                        <p className="text-sm text-gray-600">{verification.identity_type}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-700">ID Number:</p>
                        <p className="text-sm text-gray-600">{verification.identity_number}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-700">Submitted:</p>
                        <p className="text-sm text-gray-600">{new Date(verification.created_at).toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700">Documents:</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {verification.id_front_url && (
                          <a href={verification.id_front_url} target="_blank" rel="noopener noreferrer" className="block p-3 border rounded-lg bg-white shadow-sm hover:shadow-md transition">
                            <FaFileUpload className="text-purple-600 mb-2" />
                            <span className="text-sm font-medium text-gray-800">ID Front</span>
                          </a>
                        )}
                        
                        {verification.id_back_url && (
                          <a href={verification.id_back_url} target="_blank" rel="noopener noreferrer" className="block p-3 border rounded-lg bg-white shadow-sm hover:shadow-md transition">
                            <FaFileUpload className="text-purple-600 mb-2" />
                            <span className="text-sm font-medium text-gray-800">ID Back</span>
                          </a>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => approveVerification(verification.id)}
                        className="flex-1 px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => rejectVerification(verification.id, 'Documentation unclear or invalid')}
                        className="flex-1 px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}