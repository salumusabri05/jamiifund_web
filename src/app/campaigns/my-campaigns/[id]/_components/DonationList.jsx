import { useState } from 'react';
import { FaUser, FaEnvelope, FaCalendarAlt, FaDollarSign, FaComment, FaSearch, FaFileExport } from 'react-icons/fa';

export default function DonationList({ donations, campaign }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  
  // Filter donations
  const filteredDonations = donations.filter(donation => {
    const searchLower = searchTerm.toLowerCase();
    return (
      donation.donor_name?.toLowerCase().includes(searchLower) ||
      donation.donor_email?.toLowerCase().includes(searchLower) ||
      donation.message?.toLowerCase().includes(searchLower)
    );
  });
  
  // Sort donations
  const sortedDonations = [...filteredDonations].sort((a, b) => {
    switch (sortOption) {
      case 'oldest':
        return new Date(a.created_at) - new Date(b.created_at);
      case 'highest':
        return b.amount - a.amount;
      case 'lowest':
        return a.amount - b.amount;
      case 'newest':
      default:
        return new Date(b.created_at) - new Date(a.created_at);
    }
  });
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleString(undefined, options);
  };
  
  // Export donations as CSV
  const exportCSV = () => {
    // Create CSV header
    let csv = 'Donor Name,Email,Amount,Date,Message,Status\n';
    
    // Add each donation as a row
    donations.forEach(donation => {
      // Format each field and handle commas by wrapping in quotes
      const row = [
        `"${donation.donor_name || 'Anonymous'}"`,
        `"${donation.donor_email || 'N/A'}"`,
        donation.amount,
        new Date(donation.created_at).toLocaleString(),
        `"${donation.message?.replace(/"/g, '""') || ''}"`,
        donation.status
      ];
      
      csv += row.join(',') + '\n';
    });
    
    // Create download link
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `${campaign.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_donations.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  
  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 md:mb-0">
          Donations ({donations.length})
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search donations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Amount</option>
            <option value="lowest">Lowest Amount</option>
          </select>
          
          <button
            onClick={exportCSV}
            className="flex items-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
          >
            <FaFileExport className="mr-2" /> Export
          </button>
        </div>
      </div>
      
      {sortedDonations.length > 0 ? (
        <div className="space-y-4">
          {sortedDonations.map(donation => (
            <div 
              key={donation.id} 
              className="bg-gray-50 rounded-lg p-4 border border-gray-200"
            >
              <div className="flex flex-wrap justify-between">
                <div className="mb-3">
                  <div className="flex items-center">
                    <FaUser className="text-gray-400 mr-2" />
                    <span className="font-medium">{donation.donor_name || 'Anonymous'}</span>
                  </div>
                  
                  {donation.donor_email && (
                    <div className="flex items-center mt-1 text-sm text-gray-600">
                      <FaEnvelope className="text-gray-400 mr-2" />
                      <span>{donation.donor_email}</span>
                    </div>
                  )}
                </div>
                
                <div className="mb-3">
                  <div className="flex items-center justify-end">
                    <FaDollarSign className="text-green-500 mr-1" />
                    <span className="font-bold text-lg">{donation.amount.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex items-center mt-1 text-sm text-gray-600 justify-end">
                    <FaCalendarAlt className="text-gray-400 mr-2" />
                    <span>{formatDate(donation.created_at)}</span>
                  </div>
                </div>
              </div>
              
              {donation.message && (
                <div className="mt-2 bg-white p-3 rounded border border-gray-200">
                  <div className="flex items-start">
                    <FaComment className="text-gray-400 mr-2 mt-1" />
                    <p className="text-gray-700">{donation.message}</p>
                  </div>
                </div>
              )}
              
              <div className="mt-2 flex justify-between items-center">
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  donation.status === 'completed' ? 'bg-green-100 text-green-800' :
                  donation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                </span>
                
                <button
                  className="text-sm text-purple-600 hover:text-purple-800"
                  onClick={() => alert(`Thank you email sent to ${donation.donor_email || 'donor'}.`)}
                  disabled={!donation.donor_email}
                >
                  Send Thank You
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-600">
            {searchTerm 
              ? "No donations match your search." 
              : "No donations have been received yet."}
          </p>
        </div>
      )}
    </div>
  );
}