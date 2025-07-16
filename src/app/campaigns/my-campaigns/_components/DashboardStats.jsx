import { FaDollarSign, FaUsers, FaChartLine, FaClock, FaCheckCircle, FaMoneyBillWave } from 'react-icons/fa';

export default function DashboardStats({ stats }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'TZSH',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {/* Total Raised */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center">
          <div className="rounded-full p-3 bg-green-100 mr-4">
            <FaDollarSign className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Raised</p>
            <h3 className="text-2xl font-bold text-gray-800">{formatCurrency(stats.totalRaised)}</h3>
          </div>
        </div>
      </div>
      
      {/* Total Donors */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center">
          <div className="rounded-full p-3 bg-blue-100 mr-4">
            <FaUsers className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Donors</p>
            <h3 className="text-2xl font-bold text-gray-800">{stats.totalDonors}</h3>
          </div>
        </div>
      </div>
      
      {/* Pending Withdrawals */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center">
          <div className="rounded-full p-3 bg-yellow-100 mr-4">
            <FaMoneyBillWave className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Pending Withdrawals</p>
            <h3 className="text-2xl font-bold text-gray-800">{formatCurrency(stats.pendingWithdrawals)}</h3>
          </div>
        </div>
      </div>
      
      {/* Campaign Stats */}
      <div className="bg-white rounded-lg shadow-sm p-6 lg:col-span-3">
        <h3 className="font-medium text-gray-700 mb-4">Campaign Status</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 mb-2">
              <FaChartLine className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-xl font-bold text-gray-800">{stats.totalCampaigns}</p>
            </div>
          </div>
          
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-100 mb-2">
              <FaClock className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active</p>
              <p className="text-xl font-bold text-gray-800">{stats.activeCount}</p>
            </div>
          </div>
          
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 mb-2">
              <FaCheckCircle className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-xl font-bold text-gray-800">{stats.completedCount}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}