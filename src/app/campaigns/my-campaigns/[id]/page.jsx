"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { supabaseClient } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LoadingSpinner from '@/components/LoadingSpinner';
import CampaignStats from './_components/CampaignStats';
import DonationList from './_components/DonationList';
import WithdrawalSection from './_components/WithdrawalSection';
import { 
  FaArrowLeft, 
  FaEdit, 
  FaShareAlt, 
  FaExternalLinkAlt,
  FaBullhorn,
  FaMoneyBillWave
} from 'react-icons/fa';

export default function CampaignDetailPage({ params }) {
  const router = useRouter();
  const { id } = params;
  
  const [user, setUser] = useState(null);
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Check authentication and redirect if not logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabaseClient.auth.getSession();
      
      if (!session) {
        router.push('/login?redirect=/campaigns/my-campaigns');
        return;
      }
      
      setUser(session.user);
      fetchCampaignDetails(session.user.id, id);
    };
    
    checkUser();
  }, [router, id]);
  
  // Fetch campaign details
  const fetchCampaignDetails = async (userId, campaignId) => {
    try {
      setLoading(true);
      
      // Get campaign details
      const { data: campaign, error: campaignError } = await supabaseClient
        .from('campaigns')
        .select(`
          *,
          donations(
            id,
            amount,
            donor_name,
            donor_email,
            message,
            created_at,
            status
          ),
          withdrawals(
            id,
            amount,
            status,
            created_at,
            updated_at,
            reason,
            notes,
            payment_reference
          )
        `)
        .eq('id', campaignId)
        .eq('created_by', userId)
        .single();
      
      if (campaignError) {
        if (campaignError.code === 'PGRST116') {
          setError('Campaign not found or you do not have permission to view it.');
        } else {
          setError(campaignError.message);
        }
        setLoading(false);
        return;
      }
      
      // Process campaign data
      const today = new Date();
      const endDate = new Date(campaign.end_date);
      const daysLeft = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
      const isActive = daysLeft > 0;
      
      const totalDonations = campaign.donations.reduce((sum, donation) => 
        donation.status === 'completed' ? sum + donation.amount : sum, 0);
      
      const totalWithdrawals = campaign.withdrawals.reduce((sum, withdrawal) => 
        withdrawal.status === 'completed' ? sum + withdrawal.amount : sum, 0);
      
      const pendingWithdrawals = campaign.withdrawals.reduce((sum, withdrawal) => 
        withdrawal.status === 'pending' ? sum + withdrawal.amount : sum, 0);
      
      const formattedCampaign = {
        ...campaign,
        daysLeft,
        isActive,
        totalDonations,
        totalWithdrawals,
        pendingWithdrawals,
        availableForWithdrawal: totalDonations - totalWithdrawals - pendingWithdrawals,
        progress: (totalDonations / campaign.goal_amount) * 100,
        donorCount: campaign.donations.filter(d => d.status === 'completed').length,
        status: isActive ? 'active' : (totalDonations >= campaign.goal_amount ? 'completed' : 'ended')
      };
      
      setCampaign(formattedCampaign);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching campaign details:', error);
      setError('Failed to load campaign details. Please try again later.');
      setLoading(false);
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Copy campaign link
  const shareCampaign = () => {
    const campaignUrl = `${window.location.origin}/campaigns/${id}`;
    navigator.clipboard.writeText(campaignUrl);
    alert('Campaign link copied to clipboard!');
  };
  
  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <LoadingSpinner />
          </div>
        </main>
        <Footer />
      </>
    );
  }
  
  if (error) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 py-12">
          <div className="container mx-auto px-4 text-center">
            <div className="bg-white p-8 rounded-xl shadow-sm max-w-2xl mx-auto">
              <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
              <p className="text-gray-700 mb-6">{error}</p>
              <Link 
                href="/campaigns/my-campaigns"
                className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Back to My Campaigns
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }
  
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          {/* Back button and actions */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <Link
              href="/campaigns/my-campaigns"
              className="flex items-center text-purple-600 hover:text-purple-800 transition-colors mb-4 md:mb-0"
            >
              <FaArrowLeft className="mr-2" /> Back to My Campaigns
            </Link>
            
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/campaigns/${campaign.id}`}
                target="_blank"
                className="flex items-center bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded-lg transition-colors"
              >
                <FaExternalLinkAlt className="mr-2" /> View Public Page
              </Link>
              
              <button
                onClick={shareCampaign}
                className="flex items-center bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg transition-colors"
              >
                <FaShareAlt className="mr-2" /> Share
              </button>
              
              {campaign.isActive && (
                <Link
                  href={`/campaigns/edit/${campaign.id}`}
                  className="flex items-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                >
                  <FaEdit className="mr-2" /> Edit
                </Link>
              )}
            </div>
          </div>
          
          {/* Campaign header */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
            <div className="relative h-64 md:h-80">
              <Image
                src={campaign.image_url || '/images/placeholder-campaign.jpg'}
                alt={campaign.title}
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
            </div>
            
            <div className="p-6">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className={`text-xs font-semibold px-2 py-1 rounded-full 
                  ${campaign.status === 'active' ? 'bg-green-100 text-green-800' :
                    campaign.status === 'completed' ? 'bg-blue-100 text-blue-800' : 
                    'bg-gray-100 text-gray-800'}`}
                >
                  {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                </span>
                
                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-purple-100 text-purple-800">
                  {campaign.category}
                </span>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{campaign.title}</h1>
              
              <div className="flex flex-wrap gap-4 text-gray-600 mb-4">
                <div>Created: {formatDate(campaign.created_at)}</div>
                <div>End Date: {formatDate(campaign.end_date)}</div>
                {campaign.isActive && (
                  <div className="font-semibold text-green-600">
                    {campaign.daysLeft} {campaign.daysLeft === 1 ? 'day' : 'days'} left
                  </div>
                )}
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <div 
                  className="bg-purple-600 h-3 rounded-full"
                  style={{ width: `${Math.min(campaign.progress, 100)}%` }}
                ></div>
              </div>
              
              <div className="flex flex-wrap justify-between items-center mb-4">
                <div>
                  <span className="text-2xl font-bold text-gray-800">
                    ${campaign.totalDonations.toLocaleString()}
                  </span>
                  <span className="text-gray-600 ml-2">
                    raised of ${campaign.goal_amount.toLocaleString()} goal
                  </span>
                </div>
                
                <div className="flex items-center">
                  <span className="font-semibold text-purple-600 mr-2">
                    {campaign.progress.toFixed(0)}%
                  </span>
                  <span className="text-gray-600">
                    from {campaign.donorCount} {campaign.donorCount === 1 ? 'donor' : 'donors'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tab navigation */}
          <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex-1 py-4 px-6 font-medium text-sm focus:outline-none ${
                  activeTab === 'overview' 
                    ? 'text-purple-600 border-b-2 border-purple-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Overview
              </button>
              
              <button
                onClick={() => setActiveTab('donations')}
                className={`flex-1 py-4 px-6 font-medium text-sm focus:outline-none ${
                  activeTab === 'donations' 
                    ? 'text-purple-600 border-b-2 border-purple-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Donations
              </button>
              
              <button
                onClick={() => setActiveTab('withdrawals')}
                className={`flex-1 py-4 px-6 font-medium text-sm focus:outline-none ${
                  activeTab === 'withdrawals' 
                    ? 'text-purple-600 border-b-2 border-purple-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Withdrawals
              </button>
            </nav>
          </div>
          
          {/* Tab content */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Campaign Details</h2>
                
                <div className="mb-6 text-gray-700">
                  <p>{campaign.description}</p>
                </div>
                
                <CampaignStats campaign={campaign} />
                
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-purple-50 p-6 rounded-xl">
                    <div className="flex items-center mb-4">
                      <FaBullhorn className="text-purple-600 mr-3" />
                      <h3 className="text-lg font-semibold text-gray-800">Promote Your Campaign</h3>
                    </div>
                    <p className="text-gray-600 mb-4">
                      Share your campaign with friends, family, and social networks to increase visibility 
                      and attract more donors.
                    </p>
                    <button
                      onClick={shareCampaign}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Copy Campaign Link
                    </button>
                  </div>
                  
                  <div className="bg-green-50 p-6 rounded-xl">
                    <div className="flex items-center mb-4">
                      <FaMoneyBillWave className="text-green-600 mr-3" />
                      <h3 className="text-lg font-semibold text-gray-800">Withdrawal Options</h3>
                    </div>
                    <p className="text-gray-600 mb-4">
                      You currently have ${campaign.availableForWithdrawal.toLocaleString()} available for withdrawal.
                    </p>
                    <button
                      onClick={() => setActiveTab('withdrawals')}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                      disabled={campaign.availableForWithdrawal <= 0}
                    >
                      Manage Withdrawals
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'donations' && (
              <DonationList donations={campaign.donations} campaign={campaign} />
            )}
            
            {activeTab === 'withdrawals' && (
              <WithdrawalSection 
                campaign={campaign} 
                onWithdrawalCreated={() => fetchCampaignDetails(user.id, id)} 
              />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}