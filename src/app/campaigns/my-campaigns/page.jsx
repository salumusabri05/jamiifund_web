"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CampaignCard from './_components/CampaignCard';
import DashboardStats from './_components/DashboardStats';
import LoadingSpinner from '@/components/LoadingSpinner';
import { FaPlus, FaFilter, FaSort } from 'react-icons/fa';
import withAuth from '@/components/withAuth';
import { useAuth } from '@/context/AuthContext'; // Make sure this path is correct (singular)

function MyCampaignsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState([]);
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    totalRaised: 0,
    totalDonors: 0,
    activeCount: 0,
    completedCount: 0,
    pendingWithdrawals: 0
  });
  const [sortOption, setSortOption] = useState('newest');
  const [filterOption, setFilterOption] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // Check authentication and redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/campaigns/my-campaigns');
      return;
    }
    
    if (user) {
      fetchCampaigns(user.id);
    }
  }, [user, authLoading, router]);
  
  // Fetch user's campaigns
  const fetchCampaigns = async (userId) => {
    try {
      setLoading(true);
      
      // Get campaigns created by the user
      const { data: campaignsData, error } = await supabase
        .from('campaigns')
        .select(`
          *,
          donations(count, amount),
          withdrawals(*)
        `)
        .eq('created_by', userId);
      
      if (error) {
        console.error('Error fetching campaigns:', error);
        setLoading(false);
        return;
      }
      
      // Process campaigns data
      const today = new Date();
      const processedCampaigns = campaignsData.map(campaign => {
        // Calculate days left
        const endDate = new Date(campaign.end_date);
        const daysLeft = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
        
        // Calculate total donations
        let totalDonations = 0;
        let donorCount = 0;
        
        if (campaign.donations && campaign.donations.length > 0) {
          totalDonations = campaign.donations.reduce((sum, donation) => sum + (donation.amount || 0), 0);
          donorCount = campaign.donations.length;
        }
        
        // Calculate total withdrawals
        const totalWithdrawals = campaign.withdrawals 
          ? campaign.withdrawals
              .filter(w => w.status === 'completed')
              .reduce((sum, w) => sum + w.amount, 0)
          : 0;
        
        // Calculate pending withdrawals
        const pendingWithdrawals = campaign.withdrawals 
          ? campaign.withdrawals
              .filter(w => w.status === 'pending')
              .reduce((sum, w) => sum + w.amount, 0)
          : 0;
        
        // Calculate available for withdrawal
        const availableForWithdrawal = Math.max(0, totalDonations - totalWithdrawals - pendingWithdrawals);
        
        // Determine campaign status
        let status = 'active';
        if (daysLeft <= 0) {
          status = 'completed';
        } else if (totalDonations >= campaign.goal_amount) {
          status = 'funded';
        }
        
        return {
          ...campaign,
          daysLeft,
          totalDonations,
          donorCount,
          totalWithdrawals,
          pendingWithdrawals,
          availableForWithdrawal,
          status
        };
      });
      
      // Calculate overall stats
      const activeCount = processedCampaigns.filter(c => c.status === 'active').length;
      const fundedCount = processedCampaigns.filter(c => c.status === 'funded').length;
      const completedCount = processedCampaigns.filter(c => c.status === 'completed').length;
      const totalRaised = processedCampaigns.reduce((sum, c) => sum + c.totalDonations, 0);
      const totalDonors = processedCampaigns.reduce((sum, c) => sum + c.donorCount, 0);
      const pendingWithdrawals = processedCampaigns.reduce((sum, c) => sum + c.pendingWithdrawals, 0);
      
      // Update state
      setCampaigns(processedCampaigns);
      setStats({
        totalCampaigns: processedCampaigns.length,
        totalRaised,
        totalDonors,
        activeCount,
        fundedCount,
        completedCount,
        pendingWithdrawals
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error processing campaigns:', error);
      setLoading(false);
    }
  };
  
  // Filter and sort campaigns
  const getFilteredAndSortedCampaigns = () => {
    // Filter campaigns
    let filtered = [...campaigns];
    
    if (filterOption !== 'all') {
      filtered = filtered.filter(campaign => campaign.status === filterOption);
    }
    
    // Sort campaigns
    filtered.sort((a, b) => {
      switch (sortOption) {
        case 'newest':
          return new Date(b.created_at) - new Date(a.created_at);
        case 'oldest':
          return new Date(a.created_at) - new Date(b.created_at);
        case 'most-funded':
          return b.totalDonations - a.totalDonations;
        case 'ending-soon':
          // Only consider active campaigns for ending soon
          if (a.status === 'completed' && b.status !== 'completed') return 1;
          if (a.status !== 'completed' && b.status === 'completed') return -1;
          return a.daysLeft - b.daysLeft;
        default:
          return 0;
      }
    });
    
    return filtered;
  };
  
  const filteredCampaigns = getFilteredAndSortedCampaigns();
  
  // Show loading state during authentication or data fetching
  if (authLoading || loading) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Render content only when user is authenticated
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Page Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">My Campaigns</h1>
              <p className="text-gray-600 mt-1">
                Manage and track all your fundraising campaigns
              </p>
            </div>
            
            <Link
              href="/campaigns/create"
              className="mt-4 md:mt-0 flex items-center bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg transition-colors"
            >
              <FaPlus className="mr-2" /> Create Campaign
            </Link>
          </div>
          
          {/* Dashboard Stats */}
          <DashboardStats stats={stats} />
          
          {/* Campaign Filters */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="flex items-center mb-4 md:mb-0">
                <span className="text-gray-700 font-medium mr-4">
                  {filteredCampaigns.length} {filteredCampaigns.length === 1 ? 'Campaign' : 'Campaigns'}
                </span>
                
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center text-gray-600 hover:text-purple-600 bg-gray-100 hover:bg-gray-200 rounded-lg px-3 py-1.5 transition-colors"
                >
                  <FaFilter className="mr-2" /> Filter
                </button>
              </div>
              
              <div className="flex items-center">
                <span className="text-gray-600 mr-2">Sort by:</span>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="most-funded">Most Funded</option>
                  <option value="ending-soon">Ending Soon</option>
                </select>
              </div>
            </div>
            
            {/* Expanded Filters */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setFilterOption('all')}
                    className={`px-4 py-2 rounded-full text-sm ${
                      filterOption === 'all'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All Campaigns
                  </button>
                  <button
                    onClick={() => setFilterOption('active')}
                    className={`px-4 py-2 rounded-full text-sm ${
                      filterOption === 'active'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Active
                  </button>
                  <button
                    onClick={() => setFilterOption('funded')}
                    className={`px-4 py-2 rounded-full text-sm ${
                      filterOption === 'funded'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Fully Funded
                  </button>
                  <button
                    onClick={() => setFilterOption('completed')}
                    className={`px-4 py-2 rounded-full text-sm ${
                      filterOption === 'completed'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Completed
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Campaign List */}
          {filteredCampaigns.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCampaigns.map(campaign => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <h3 className="text-xl font-bold text-gray-700 mb-2">No campaigns found</h3>
              <p className="text-gray-600 mb-6">
                {filterOption !== 'all' 
                  ? `You don't have any ${filterOption} campaigns. Try a different filter.` 
                  : "You haven't created any campaigns yet."}
              </p>
              <Link
                href="/campaigns/create"
                className="inline-flex items-center bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg transition-colors"
              >
                <FaPlus className="mr-2" /> Create Your First Campaign
              </Link>
            </div>
          )}
        </motion.div>
      </main>
      <Footer />
    </>
  );
}

// Export the wrapped component
export default withAuth(MyCampaignsPage);