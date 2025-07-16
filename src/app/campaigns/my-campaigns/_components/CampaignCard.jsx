import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaUsers, FaCalendarAlt, FaMoneyBillWave, FaExclamationCircle } from 'react-icons/fa';

export default function CampaignCard({ campaign }) {
  // Calculate progress percentage
  const progressPercentage = Math.min(
    Math.round((campaign.totalDonations / campaign.goal_amount) * 100),
    100
  );
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Get status badge
  const getStatusBadge = () => {
    switch (campaign.status) {
      case 'active':
        return (
          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
            Active
          </span>
        );
      case 'funded':
        return (
          <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
            Fully Funded
          </span>
        );
      case 'completed':
        return (
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
            Completed
          </span>
        );
      default:
        return null;
    }
  };
  
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-lg shadow-sm overflow-hidden"
    >
      <div className="relative h-48">
        <Image
          src={campaign.image_url || '/images/campaign-placeholder.jpg'}
          alt={campaign.title}
          fill
          style={{ objectFit: 'cover' }}
        />
        <div className="absolute top-2 right-2">
          {getStatusBadge()}
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
          {campaign.title}
        </h3>
        
        <div className="mb-4">
          <div className="h-2 w-full bg-gray-200 rounded-full mb-1">
            <div
              className="h-full rounded-full"
              style={{
                width: `${progressPercentage}%`,
                backgroundColor: progressPercentage >= 100 ? '#8b5cf6' : '#10b981'
              }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>{formatCurrency(campaign.totalDonations)} raised</span>
            <span>{progressPercentage}% of {formatCurrency(campaign.goal_amount)}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <FaUsers className="mr-1 text-gray-400" />
            <span>{campaign.donorCount} donors</span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <FaCalendarAlt className="mr-1 text-gray-400" />
            <span>
              {campaign.status === 'completed'
                ? 'Campaign ended'
                : `${campaign.daysLeft} days left`}
            </span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <FaMoneyBillWave className="mr-1 text-gray-400" />
            <span>{formatCurrency(campaign.availableForWithdrawal)} available</span>
          </div>
          
          {campaign.pendingWithdrawals > 0 && (
            <div className="flex items-center text-sm text-yellow-600">
              <FaExclamationCircle className="mr-1 text-yellow-500" />
              <span>{formatCurrency(campaign.pendingWithdrawals)} pending</span>
            </div>
          )}
        </div>
        
        <Link
          href={`/campaigns/my-campaigns/${campaign.id}`}
          className="block w-full text-center bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-colors"
        >
          Manage Campaign
        </Link>
      </div>
    </motion.div>
  );
}