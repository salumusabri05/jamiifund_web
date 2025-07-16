"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  FaDollarSign, 
  FaUsers, 
  FaChartLine, 
  FaClock, 
  FaCheckCircle, 
  FaMoneyBillWave,
  FaHandHoldingHeart
} from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function DashboardStats({ userId }) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    totalRaised: 0,
    totalDonors: 0,
    recentDonations: [],
    successRate: 0
  });
  
  const [donationsChartData, setDonationsChartData] = useState({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Fetch user's campaigns
        const { data: campaigns, error: campaignsError } = await supabase
          .from('campaigns')
          .select('id, title, current_amount, goal_amount, donor_count, created_at, end_date')
          .eq('created_by', userId);
          
        if (campaignsError) throw campaignsError;
        
        // Calculate total campaigns
        const totalCampaigns = campaigns.length;
        
        // Calculate total raised across all campaigns
        const totalRaised = campaigns.reduce((sum, campaign) => sum + (campaign.current_amount || 0), 0);
        
        // Calculate total donors (note: this might count some donors multiple times if they donated to multiple campaigns)
        const totalDonors = campaigns.reduce((sum, campaign) => sum + (campaign.donor_count || 0), 0);
        
        // Calculate success rate (campaigns that reached their goal)
        const successfulCampaigns = campaigns.filter(campaign => 
          campaign.current_amount >= campaign.goal_amount
        ).length;
        
        const successRate = totalCampaigns > 0 
          ? (successfulCampaigns / totalCampaigns) * 100 
          : 0;
        
        // Fetch recent donations across all user campaigns
        const campaignIds = campaigns.map(campaign => campaign.id);
        
        let recentDonations = [];
        
        if (campaignIds.length > 0) {
          const { data: donations, error: donationsError } = await supabase
            .from('donations')
            .select('id, amount, donor_name, created_at, campaign_id, campaigns(title)')
            .in('campaign_id', campaignIds)
            .order('created_at', { ascending: false })
            .limit(5);
            
          if (donationsError) throw donationsError;
          
          recentDonations = donations;
          
          // Prepare donations chart data
          // Get last 7 days
          const labels = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          });
          
          // Aggregate donations by day
          const donationsByDay = Array(7).fill(0);
          
          // Get all donations for chart
          const { data: chartDonations, error: chartError } = await supabase
            .from('donations')
            .select('amount, created_at')
            .in('campaign_id', campaignIds)
            .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());
            
          if (chartError) throw chartError;
          
          // Populate the donations by day
          chartDonations.forEach(donation => {
            const donationDate = new Date(donation.created_at);
            const daysAgo = Math.floor((new Date() - donationDate) / (24 * 60 * 60 * 1000));
            
            if (daysAgo >= 0 && daysAgo < 7) {
              donationsByDay[6 - daysAgo] += donation.amount;
            }
          });
          
          setDonationsChartData({
            labels,
            datasets: [
              {
                label: 'Donations',
                data: donationsByDay,
                borderColor: 'rgb(124, 58, 237)',
                backgroundColor: 'rgba(124, 58, 237, 0.5)',
                tension: 0.4
              }
            ]
          });
        }
        
        setStats({
          totalCampaigns,
          totalRaised,
          totalDonors,
          recentDonations,
          successRate
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (userId) {
      fetchStats();
    }
  }, [userId]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }
  
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard 
          title="Total Campaigns"
          value={stats.totalCampaigns}
          icon={<FaHandHoldingHeart className="text-purple-500" />}
          trend={stats.totalCampaigns > 0 ? 'up' : 'neutral'}
        />
        
        <StatCard 
          title="Total Raised"
          value={`$${stats.totalRaised.toLocaleString()}`}
          icon={<FaMoneyBillWave className="text-green-500" />}
          trend="up"
        />
        
        <StatCard 
          title="Total Donors"
          value={stats.totalDonors}
          icon={<FaUsers className="text-blue-500" />}
          trend="up"
        />
      </div>
      
      {/* Campaign Success Rate */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-medium text-gray-700">Campaign Success Rate</h3>
          <div className="text-sm text-gray-500">Based on goal achievement</div>
        </div>
        
        <div className="h-4 bg-gray-200 rounded-full mb-2">
          <div 
            className="h-4 bg-purple-600 rounded-full" 
            style={{ width: `${Math.min(stats.successRate, 100)}%` }}
          ></div>
        </div>
        
        <div className="text-right text-sm font-medium text-gray-700">
          {stats.successRate.toFixed(0)}%
        </div>
      </div>
      
      {/* Donations Chart */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Recent Donations</h3>
        
        {stats.totalCampaigns > 0 ? (
          <div className="h-64">
            <Line 
              data={donationsChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: (value) => `$${value}`
                    }
                  }
                },
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: (context) => `$${context.parsed.y.toFixed(2)}`
                    }
                  }
                }
              }}
            />
          </div>
        ) : (
          <div className="flex justify-center items-center h-40 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-500">No donation data available yet</p>
          </div>
        )}
      </div>
      
      {/* Recent Donations List */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Latest Donations</h3>
        
        {stats.recentDonations.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Donor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Campaign
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.recentDonations.map(donation => (
                  <tr key={donation.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {donation.donor_name || 'Anonymous'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {donation.campaigns?.title || 'Unknown Campaign'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">
                        ${donation.amount?.toLocaleString() || '0'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(donation.created_at).toLocaleDateString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex justify-center items-center h-32 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-500">No donations received yet</p>
          </div>
        )}
        
        {stats.recentDonations.length > 0 && (
          <div className="mt-4 text-right">
            <Link 
              href="/campaigns/my-campaigns"
              className="text-purple-600 text-sm font-medium hover:text-purple-800"
            >
              View All Campaigns
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, icon, trend }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className="p-2 rounded-full bg-gray-100">
          {icon}
        </div>
      </div>
      
      {trend && (
        <div className="mt-4 flex items-center">
          {trend === 'up' ? (
            <FaArrowUp className="text-green-500 mr-1" />
          ) : trend === 'down' ? (
            <FaArrowDown className="text-red-500 mr-1" />
          ) : null}
          
          <span className={`text-xs font-medium ${
            trend === 'up' 
              ? 'text-green-500' 
              : trend === 'down' 
                ? 'text-red-500' 
                : 'text-gray-500'
          }`}>
            {trend === 'up' 
              ? 'Growing' 
              : trend === 'down' 
                ? 'Decreasing' 
                : 'Stable'}
          </span>
        </div>
      )}
    </div>
  );
}