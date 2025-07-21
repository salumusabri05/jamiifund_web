"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { FaUsers, FaExclamationCircle, FaCheckCircle, 
         FaList, FaMoneyBill, FaTimesCircle, FaSearch,
         FaChartLine, FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import Link from 'next/link';

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    totalCampaigns: 0,
    totalRaised: 0,
    pendingWithdrawals: 0
  });
  const [campaigns, setCampaigns] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const supabase = createClientComponentClient();
  
  // Add these new state variables
  const [userRole, setUserRole] = useState(null);
  const [userPermissions, setUserPermissions] = useState(null);
  
  useEffect(() => {
    async function checkAdminStatus() {
      if (!user) return;
      
      try {
        // Query the admin_roles table instead of admins
        const { data, error } = await supabase
          .from('admin_roles')
          .select('role, permissions')
          .eq('user_id', user.uid)
          .single();
          
        if (error) {
          console.error('Not an admin or error checking status:', error);
          setIsAdmin(false);
          setIsLoading(false);
          return;
        }
        
        // You can now store the role and permissions for role-based access control
        setIsAdmin(true);
        // Optionally store role information
        setUserRole(data.role);
        setUserPermissions(data.permissions);
        
        fetchAdminData();
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        setIsLoading(false);
      }
    }
    
    async function fetchAdminData() {
      try {
        // Fetch stats
        const { data: statsData, error: statsError } = await supabase.rpc('get_admin_statistics');
        
        if (statsError) throw statsError;
        
        setDashboardStats({
          totalUsers: statsData.total_users || 0,
          totalCampaigns: statsData.total_campaigns || 0,
          totalRaised: statsData.total_raised || 0,
          pendingWithdrawals: statsData.pending_withdrawals || 0
        });
        
        // Fetch campaigns
        const { data: campaignsData, error: campaignsError } = await supabase
          .from('campaigns')
          .select('*, profiles(name)')
          .order('created_at', { ascending: false })
          .limit(100);
          
        if (campaignsError) throw campaignsError;
        
        setCampaigns(campaignsData);
        
        // Fetch users
        const { data: usersData, error: usersError } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100);
          
        if (usersError) throw usersError;
        
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    if (!loading) {
      checkAdminStatus();
    }
  }, [user, loading, supabase]);
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };
  
  const filteredCampaigns = campaigns.filter(campaign => 
    campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    campaign.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredUsers = users.filter(user => 
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const totalPages = activeTab === 'campaigns' 
    ? Math.ceil(filteredCampaigns.length / itemsPerPage) 
    : Math.ceil(filteredUsers.length / itemsPerPage);
    
  const paginatedItems = activeTab === 'campaigns'
    ? filteredCampaigns.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  
  const handleApprove = async (id) => {
    try {
      const { error } = await supabase
        .from('campaigns')
        .update({ status: 'approved', moderated_at: new Date().toISOString() })
        .eq('id', id);
        
      if (error) throw error;
      
      setCampaigns(prev => 
        prev.map(campaign => 
          campaign.id === id ? { ...campaign, status: 'approved' } : campaign
        )
      );
    } catch (error) {
      console.error('Error approving campaign:', error);
    }
  };
  
  const handleReject = async (id) => {
    try {
      const { error } = await supabase
        .from('campaigns')
        .update({ status: 'rejected', moderated_at: new Date().toISOString() })
        .eq('id', id);
        
      if (error) throw error;
      
      setCampaigns(prev => 
        prev.map(campaign => 
          campaign.id === id ? { ...campaign, status: 'rejected' } : campaign
        )
      );
    } catch (error) {
      console.error('Error rejecting campaign:', error);
    }
  };
  
  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto text-center">
            <FaExclamationCircle className="text-5xl text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
            <p className="text-gray-600 mb-6">You do not have permission to access the admin dashboard.</p>
            <Link 
              href="/" 
              className="rounded-full bg-purple-600 px-6 py-3 text-white hover:bg-purple-700 transition"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-purple-800 text-white hidden md:block">
          <div className="p-6">
            <h1 className="text-xl font-bold">JamiiFund Admin</h1>
          </div>
          <nav className="mt-6">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`flex items-center w-full px-6 py-3 ${activeTab === 'overview' ? 'bg-purple-900' : 'hover:bg-purple-700'}`}
            >
              <FaChartLine className="mr-3" /> Overview
            </button>
            <button 
              onClick={() => setActiveTab('campaigns')}
              className={`flex items-center w-full px-6 py-3 ${activeTab === 'campaigns' ? 'bg-purple-900' : 'hover:bg-purple-700'}`}
            >
              <FaList className="mr-3" /> Campaigns
            </button>
            <button 
              onClick={() => setActiveTab('users')}
              className={`flex items-center w-full px-6 py-3 ${activeTab === 'users' ? 'bg-purple-900' : 'hover:bg-purple-700'}`}
            >
              <FaUsers className="mr-3" /> Users
            </button>
          </nav>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="py-6 px-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <div className="md:hidden">
                <select 
                  value={activeTab}
                  onChange={(e) => setActiveTab(e.target.value)}
                  className="p-2 border border-gray-300 rounded"
                >
                  <option value="overview">Overview</option>
                  <option value="campaigns">Campaigns</option>
                  <option value="users">Users</option>
                </select>
              </div>
            </div>
            
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                        <FaUsers className="text-purple-600" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-700">Total Users</h3>
                    </div>
                    <p className="text-3xl font-bold text-purple-600">{dashboardStats.totalUsers}</p>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <FaList className="text-blue-600" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-700">Total Campaigns</h3>
                    </div>
                    <p className="text-3xl font-bold text-blue-600">{dashboardStats.totalCampaigns}</p>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                        <FaMoneyBill className="text-green-600" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-700">Total Raised</h3>
                    </div>
                    <p className="text-3xl font-bold text-green-600">Tsh {dashboardStats.totalRaised.toLocaleString()}</p>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                        <FaMoneyBill className="text-yellow-600" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-700">Pending Withdrawals</h3>
                    </div>
                    <p className="text-3xl font-bold text-yellow-600">Tsh {dashboardStats.pendingWithdrawals.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4">Recent Campaigns</h2>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="py-3 text-left text-gray-700">Campaign</th>
                            <th className="py-3 text-left text-gray-700">Status</th>
                            <th className="py-3 text-left text-gray-700">Created</th>
                          </tr>
                        </thead>
                        <tbody>
                          {campaigns.slice(0, 5).map(campaign => (
                            <tr key={campaign.id} className="border-b border-gray-200 hover:bg-gray-50">
                              <td className="py-3">
                                <Link href={`/campaigns/${campaign.id}`} className="text-purple-600 hover:underline">
                                  {campaign.title}
                                </Link>
                              </td>
                              <td className="py-3">
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  campaign.status === 'approved' ? 'bg-green-100 text-green-800' :
                                  campaign.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {campaign.status || 'pending'}
                                </span>
                              </td>
                              <td className="py-3 text-gray-500">
                                {new Date(campaign.created_at).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4">Recent Users</h2>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="py-3 text-left text-gray-700">User</th>
                            <th className="py-3 text-left text-gray-700">Email</th>
                            <th className="py-3 text-left text-gray-700">Joined</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.slice(0, 5).map(user => (
                            <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                              <td className="py-3 font-medium">
                                {user.full_name || 'Unnamed User'}
                              </td>
                              <td className="py-3 text-gray-500">
                                {user.email}
                              </td>
                              <td className="py-3 text-gray-500">
                                {new Date(user.created_at).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Campaigns Tab */}
            {activeTab === 'campaigns' && (
              <div>
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                    <h2 className="text-xl font-bold mb-4 md:mb-0">Manage Campaigns</h2>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search campaigns..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                      />
                      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="py-3 text-left text-gray-700">Campaign</th>
                          <th className="py-3 text-left text-gray-700">Creator</th>
                          <th className="py-3 text-left text-gray-700">Status</th>
                          <th className="py-3 text-left text-gray-700">Date</th>
                          <th className="py-3 text-left text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedItems.map(campaign => (
                          <tr key={campaign.id} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="py-3">
                              <div className="font-medium">{campaign.title}</div>
                              <div className="text-sm text-gray-500">{campaign.category}</div>
                            </td>
                            <td className="py-3 text-gray-700">
                              {campaign.profiles?.name || campaign.created_by_name || 'Unknown User'}
                            </td>
                            <td className="py-3">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                campaign.status === 'approved' ? 'bg-green-100 text-green-800' :
                                campaign.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {campaign.status || 'pending'}
                              </span>
                            </td>
                            <td className="py-3 text-gray-500">
                              {new Date(campaign.created_at).toLocaleDateString()}
                            </td>
                            <td className="py-3">
                              <div className="flex space-x-2">
                                <Link 
                                  href={`/campaigns/${campaign.id}`}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                                  title="View"
                                >
                                  View
                                </Link>
                                
                                {campaign.status !== 'approved' && (
                                  <button
                                    onClick={() => handleApprove(campaign.id)}
                                    className="p-2 text-green-600 hover:bg-green-50 rounded transition"
                                    title="Approve"
                                  >
                                    <FaCheckCircle />
                                  </button>
                                )}
                                
                                {campaign.status !== 'rejected' && (
                                  <button
                                    onClick={() => handleReject(campaign.id)}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                                    title="Reject"
                                  >
                                    <FaTimesCircle />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-between items-center mt-6">
                      <div className="text-sm text-gray-500">
                        Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredCampaigns.length)} of {filteredCampaigns.length} campaigns
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className={`p-2 rounded-md ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-purple-600 hover:bg-purple-50'}`}
                        >
                          <FaChevronLeft />
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-8 h-8 rounded-md ${currentPage === page ? 'bg-purple-600 text-white' : 'text-gray-700 hover:bg-purple-50'}`}
                          >
                            {page}
                          </button>
                        ))}
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className={`p-2 rounded-md ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-purple-600 hover:bg-purple-50'}`}
                        >
                          <FaChevronRight />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Users Tab */}
            {activeTab === 'users' && (
              <div>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                    <h2 className="text-xl font-bold mb-4 md:mb-0">Manage Users</h2>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500"
                      />
                      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="py-3 text-left text-gray-700">Name</th>
                          <th className="py-3 text-left text-gray-700">Email</th>
                          <th className="py-3 text-left text-gray-700">Location</th>
                          <th className="py-3 text-left text-gray-700">Joined</th>
                          <th className="py-3 text-left text-gray-700">Campaigns</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedItems.map(user => (
                          <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="py-3 font-medium">{user.full_name || 'Unnamed User'}</td>
                            <td className="py-3 text-gray-700">{user.email}</td>
                            <td className="py-3 text-gray-500">{user.location || 'Not specified'}</td>
                            <td className="py-3 text-gray-500">{new Date(user.created_at).toLocaleDateString()}</td>
                            <td className="py-3 text-gray-700">
                              {campaigns.filter(c => c.created_by === user.id).length}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-between items-center mt-6">
                      <div className="text-sm text-gray-500">
                        Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className={`p-2 rounded-md ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-purple-600 hover:bg-purple-50'}`}
                        >
                          <FaChevronLeft />
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-8 h-8 rounded-md ${currentPage === page ? 'bg-purple-600 text-white' : 'text-gray-700 hover:bg-purple-50'}`}
                          >
                            {page}
                          </button>
                        ))}
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className={`p-2 rounded-md ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-purple-600 hover:bg-purple-50'}`}
                        >
                          <FaChevronRight />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}