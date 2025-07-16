import { useState, useEffect } from 'react';
import { supabaseClient } from '@/lib/supabase';
import { FaMoneyBillWave, FaHistory, FaExclamationCircle, FaCheckCircle, FaClock, FaTimes, FaInfoCircle } from 'react-icons/fa';

export default function WithdrawalSection({ campaign, onWithdrawalCreated }) {
  const [isRequestingWithdrawal, setIsRequestingWithdrawal] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [lipaNamba, setLipaNamba] = useState('');
  const [withdrawalReason, setWithdrawalReason] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('mobile_money');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [withdrawals, setWithdrawals] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  
  useEffect(() => {
    // Fetch user profile for saved payment methods
    const fetchUserProfile = async () => {
      try {
        const { data: { user } } = await supabaseClient.auth.getUser();
        
        if (user) {
          const { data, error } = await supabaseClient
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          if (data && !error) {
            setUserProfile(data);
            // Pre-fill Lipa Namba if available
            if (data.lipa_namba) {
              setLipaNamba(data.lipa_namba);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    
    // Load withdrawals if they weren't passed in the campaign object
    const loadWithdrawals = async () => {
      if (!campaign.withdrawals) {
        try {
          const { data, error } = await supabaseClient
            .from('withdrawals')
            .select('*')
            .eq('campaign_id', campaign.id)
            .order('created_at', { ascending: false });
          
          if (!error) {
            setWithdrawals(data || []);
          }
        } catch (error) {
          console.error('Error loading withdrawals:', error);
        }
      } else {
        setWithdrawals(campaign.withdrawals);
      }
    };
    
    fetchUserProfile();
    loadWithdrawals();
  }, [campaign]);
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'TSH',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  // Handle withdrawal request
  const handleWithdrawalRequest = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!withdrawalAmount || isNaN(withdrawalAmount) || parseFloat(withdrawalAmount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    
    if (parseFloat(withdrawalAmount) > campaign.availableForWithdrawal) {
      setError(`You can only withdraw up to ${formatCurrency(campaign.availableForWithdrawal)}`);
      return;
    }
    
    if (parseFloat(withdrawalAmount) < 10) {
      setError('Minimum withdrawal amount is $10');
      return;
    }
    
    if (paymentMethod === 'mobile_money' && (!lipaNamba || lipaNamba.length < 5)) {
      setError('Please enter a valid Lipa Namba');
      return;
    }
    
    if (!withdrawalReason) {
      setError('Please provide a reason for withdrawal');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Create withdrawal request
      const { data, error } = await supabaseClient
        .from('withdrawals')
        .insert({
          campaign_id: campaign.id,
          amount: parseFloat(withdrawalAmount),
          payment_method: paymentMethod,
          payment_details: paymentMethod === 'mobile_money' ? lipaNamba : null,
          reason: withdrawalReason,
          status: 'pending'
        });
      
      if (error) throw error;
      
      // Save Lipa Namba to user profile if user opts in
      if (paymentMethod === 'mobile_money' && document.getElementById('save-lipa-namba').checked) {
        await supabaseClient
          .from('profiles')
          .update({ lipa_namba: lipaNamba })
          .eq('id', campaign.created_by);
      }
      
      // Reset form and fetch updated data
      setIsRequestingWithdrawal(false);
      setWithdrawalAmount('');
      setLipaNamba('');
      setWithdrawalReason('');
      setLoading(false);
      
      // Notify parent component to refresh data
      if (onWithdrawalCreated) onWithdrawalCreated();
      
    } catch (error) {
      console.error('Error creating withdrawal request:', error);
      setError('Failed to create withdrawal request. Please try again.');
      setLoading(false);
    }
  };
  
  // Get withdrawal status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <FaCheckCircle className="text-green-500" />;
      case 'pending':
        return <FaClock className="text-yellow-500" />;
      case 'rejected':
        return <FaTimes className="text-red-500" />;
      default:
        return <FaExclamationCircle className="text-gray-500" />;
    }
  };
  
  // Get status text with color
  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return <span className="text-green-600 font-medium">Completed</span>;
      case 'pending':
        return <span className="text-yellow-600 font-medium">Pending</span>;
      case 'rejected':
        return <span className="text-red-600 font-medium">Rejected</span>;
      default:
        return <span className="text-gray-600 font-medium">Unknown</span>;
    }
  };
  
  // Sort withdrawals by date
  const sortedWithdrawals = [...withdrawals].sort((a, b) => 
    new Date(b.created_at) - new Date(a.created_at)
  );
  
  // Get pending withdrawals
  const pendingWithdrawals = sortedWithdrawals.filter(w => w.status === 'pending');
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="mb-4 md:mb-0">
          <h2 className="text-xl font-bold text-gray-800 mb-1">
            Withdrawals
          </h2>
          <p className="text-gray-600 text-sm">
            Available balance: <span className="font-semibold">{formatCurrency(campaign.availableForWithdrawal)}</span>
          </p>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors"
          >
            <FaHistory className="inline mr-2" /> {showHistory ? 'Hide History' : 'View History'}
          </button>
          
          {!isRequestingWithdrawal && (
            <button
              onClick={() => setIsRequestingWithdrawal(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              disabled={campaign.availableForWithdrawal < 10}
            >
              <FaMoneyBillWave className="inline mr-2" /> Request Withdrawal
            </button>
          )}
        </div>
      </div>
      
      {/* Pending withdrawals notification */}
      {pendingWithdrawals.length > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <FaInfoCircle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                You have {pendingWithdrawals.length} pending withdrawal {pendingWithdrawals.length === 1 ? 'request' : 'requests'} totaling {formatCurrency(pendingWithdrawals.reduce((sum, w) => sum + w.amount, 0))}.
                Pending withdrawals are typically processed within 1-3 business days.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Withdrawal form */}
      {isRequestingWithdrawal && (
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Request Withdrawal</h3>
          
          <form onSubmit={handleWithdrawalRequest}>
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg flex items-start">
                <FaExclamationCircle className="mr-2 mt-1 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2" htmlFor="amount">
                  Withdrawal Amount*
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">$</span>
                  </div>
                  <input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="10"
                    max={campaign.availableForWithdrawal}
                    value={withdrawalAmount}
                    onChange={(e) => setWithdrawalAmount(e.target.value)}
                    className="pl-7 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="0.00"
                    required
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Available: {formatCurrency(campaign.availableForWithdrawal)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Minimum withdrawal: $10
                </p>
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Payment Method*
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="mobile_money"
                      checked={paymentMethod === 'mobile_money'}
                      onChange={() => setPaymentMethod('mobile_money')}
                      className="mr-2 h-4 w-4 border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span>Mobile Money (Lipa Namba)</span>
                  </label>
                  
                  <label className="flex items-center opacity-50 cursor-not-allowed">
                    <input
                      type="radio"
                      name="paymentMethod"
                      disabled
                      className="mr-2 h-4 w-4 border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span>Bank Transfer (Coming soon)</span>
                  </label>
                </div>
              </div>
              
              {paymentMethod === 'mobile_money' && (
                <div>
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="lipaNamba">
                    Lipa Namba (Mobile Money)*
                  </label>
                  <input
                    id="lipaNamba"
                    type="text"
                    value={lipaNamba}
                    onChange={(e) => setLipaNamba(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter your mobile money number"
                    required
                  />
                  <div className="mt-2">
                    <label className="flex items-center">
                      <input
                        id="save-lipa-namba"
                        type="checkbox"
                        className="mr-2 h-4 w-4 border-gray-300 rounded text-green-600 focus:ring-green-500"
                        defaultChecked
                      />
                      <span className="text-sm text-gray-600">Save this Lipa Namba for future withdrawals</span>
                    </label>
                  </div>
                </div>
              )}
              
              <div className={paymentMethod === 'mobile_money' ? 'md:col-span-1' : 'md:col-span-2'}>
                <label className="block text-gray-700 font-medium mb-2" htmlFor="reason">
                  Withdrawal Reason*
                </label>
                <textarea
                  id="reason"
                  value={withdrawalReason}
                  onChange={(e) => setWithdrawalReason(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  rows="3"
                  placeholder="Explain how you will use the funds"
                  required
                ></textarea>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsRequestingWithdrawal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Withdrawal guidelines */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-200">
        <div className="flex items-start">
          <FaInfoCircle className="text-blue-500 mr-3 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-blue-800">Withdrawal Guidelines</h4>
            <ul className="mt-2 text-sm text-blue-800 space-y-1">
              <li>• Withdrawals are typically processed within 1-3 business days</li>
              <li>• A valid Lipa Namba is required for mobile money withdrawals</li>
              <li>• Minimum withdrawal amount is $10</li>
              <li>• Provide a clear explanation of how funds will be used</li>
              <li>• For assistance, contact support@jamiifund.com</li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Withdrawal history */}
      {showHistory && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Withdrawal History</h3>
          
          {sortedWithdrawals.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Method
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedWithdrawals.map((withdrawal) => (
                    <tr key={withdrawal.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(withdrawal.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(withdrawal.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {withdrawal.payment_method === 'mobile_money' ? 'Mobile Money' : withdrawal.payment_method}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center">
                          {getStatusIcon(withdrawal.status)}
                          <span className="ml-2">{getStatusText(withdrawal.status)}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600 text-center py-4">
              No withdrawal history found
            </p>
          )}
        </div>
      )}
    </div>
  );
}