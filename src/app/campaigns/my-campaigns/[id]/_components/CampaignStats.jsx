import { useState, useEffect } from 'react';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { FaChartBar, FaChartPie, FaChartLine } from 'react-icons/fa';

// Register Chart.js components
Chart.register(...registerables);

export default function CampaignStats({ campaign }) {
  const [activeChart, setActiveChart] = useState('donations');
  
  // Process donation data for charts
  const processDonationsData = () => {
    const donations = campaign.donations.filter(d => d.status === 'completed');
    
    // Group donations by date
    const donationsByDate = donations.reduce((acc, donation) => {
      const date = new Date(donation.created_at).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = {
          total: 0,
          count: 0
        };
      }
      acc[date].total += donation.amount;
      acc[date].count += 1;
      return acc;
    }, {});
    
    // Sort dates
    const sortedDates = Object.keys(donationsByDate).sort((a, b) => new Date(a) - new Date(b));
    
    // Create datasets
    const amountData = sortedDates.map(date => donationsByDate[date].total);
    const countData = sortedDates.map(date => donationsByDate[date].count);
    
    return {
      labels: sortedDates,
      amountData,
      countData
    };
  };
  
  const { labels, amountData, countData } = processDonationsData();
  
  // Donation trend chart data
  const donationTrendData = {
    labels,
    datasets: [
      {
        label: 'Donation Amount ($)',
        data: amountData,
        borderColor: 'rgb(124, 58, 237)',
        backgroundColor: 'rgba(124, 58, 237, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };
  
  // Donor count chart data
  const donorCountData = {
    labels,
    datasets: [
      {
        label: 'Number of Donations',
        data: countData,
        backgroundColor: 'rgba(124, 58, 237, 0.8)'
      }
    ]
  };
  
  // Funding progress chart data
  const fundingProgressData = {
    labels: ['Raised', 'Remaining'],
    datasets: [
      {
        data: [
          campaign.totalDonations,
          Math.max(0, campaign.goal_amount - campaign.totalDonations)
        ],
        backgroundColor: [
          'rgba(124, 58, 237, 0.8)',
          'rgba(229, 231, 235, 0.8)'
        ],
        borderWidth: 0
      }
    ]
  };
  
  // Chart options
  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'Donation Trend Over Time'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };
  
  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'Donations Per Day'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };
  
  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'Funding Progress'
      }
    },
    cutout: '70%'
  };
  
  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Campaign Analytics</h2>
      
      {/* Chart selector */}
      <div className="flex mb-4 bg-gray-100 p-1 rounded-lg">
        <button
          className={`px-4 py-2 rounded-md flex items-center ${
            activeChart === 'donations' ? 'bg-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'
          }`}
          onClick={() => setActiveChart('donations')}
        >
          <FaChartLine className="mr-2" /> Donation Trend
        </button>
        <button
          className={`px-4 py-2 rounded-md flex items-center ${
            activeChart === 'donors' ? 'bg-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'
          }`}
          onClick={() => setActiveChart('donors')}
        >
          <FaChartBar className="mr-2" /> Donor Activity
        </button>
        <button
          className={`px-4 py-2 rounded-md flex items-center ${
            activeChart === 'progress' ? 'bg-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'
          }`}
          onClick={() => setActiveChart('progress')}
        >
          <FaChartPie className="mr-2" /> Funding Progress
        </button>
      </div>
      
      {/* Chart display */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        {activeChart === 'donations' && (
          <div className="h-80">
            <Line data={donationTrendData} options={lineOptions} />
          </div>
        )}
        
        {activeChart === 'donors' && (
          <div className="h-80">
            <Bar data={donorCountData} options={barOptions} />
          </div>
        )}
        
        {activeChart === 'progress' && (
          <div className="h-80 flex items-center justify-center">
            <div className="w-full max-w-xs">
              <Doughnut data={fundingProgressData} options={doughnutOptions} />
              <div className="text-center mt-4">
                <p className="text-gray-600">
                  <span className="font-semibold text-purple-600">
                    ${campaign.totalDonations.toLocaleString()}
                  </span> raised of ${campaign.goal_amount.toLocaleString()} goal ({campaign.progress.toFixed(0)}%)
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Stats summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Average Donation</h3>
          <p className="text-2xl font-bold text-gray-800">
            ${campaign.donations.length > 0 
              ? (campaign.totalDonations / campaign.donorCount).toFixed(2) 
              : '0.00'}
          </p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Largest Donation</h3>
          <p className="text-2xl font-bold text-gray-800">
            ${campaign.donations.length > 0 
              ? Math.max(...campaign.donations.map(d => d.amount)).toLocaleString() 
              : '0.00'}
          </p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Daily Average</h3>
          <p className="text-2xl font-bold text-gray-800">
            ${campaign.donations.length > 0 
              ? (campaign.totalDonations / Math.max(1, labels.length)).toFixed(2) 
              : '0.00'}
          </p>
        </div>
      </div>
    </div>
  );
}