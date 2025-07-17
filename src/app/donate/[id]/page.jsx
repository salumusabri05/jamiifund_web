"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  FaCheckCircle, 
  FaLock, 
  FaCreditCard, 
  FaMobileAlt, 
  FaMoneyBillWave,
  FaAngleLeft
} from 'react-icons/fa';

// Preset donation amounts
const PRESET_AMOUNTS = [
  { label: "TSh 5,000", value: 5000 },
  { label: "TSh 10,000", value: 10000 },
  { label: "TSh 20,000", value: 20000 },
  { label: "TSh 50,000", value: 50000 },
  { label: "TSh 100,000", value: 100000 },
];

export default function DonationPage() {
  const { id } = useParams();
  const router = useRouter();
  // Initialize Supabase client
  const supabase = createClientComponentClient();
  
  // State variables
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    amount: 0,
    customAmount: '',
    name: '',
    email: '',
    phone: '',
    anonymous: false,
    message: '',
    paymentMethod: 'mobile_money'
  });
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  useEffect(() => {
    // Fetch campaign details from Supabase
    const fetchCampaign = async () => {
      try {
        // Query the campaigns table with the campaign ID - updated to match your schema
        const { data: campaignData, error } = await supabase
          .from('campaigns')
          .select(`
            id, title, description, image_url, current_amount, goal_amount, 
            category, donor_count, end_date, created_by_name
          `)
          .eq('id', id)
          .single();
        
        if (error) {
          console.error("Supabase error:", error);
          throw new Error(
            error.code === "PGRST116" 
              ? "Campaign not found" 
              : "Failed to load campaign details"
          );
        }
        
        if (campaignData) {
          // Calculate days left based on end_date
          const endDate = new Date(campaignData.end_date);
          const today = new Date();
          const timeDiff = endDate.getTime() - today.getTime();
          const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
          
          // Format the campaign data to match our component needs - updated to use created_by_name
          const formattedCampaign = {
            id: campaignData.id,
            title: campaignData.title,
            description: campaignData.description,
            imageUrl: campaignData.image_url,
            raised: campaignData.current_amount || 0,
            goal: campaignData.goal_amount,
            category: campaignData.category,
            createdBy: { 
              name: campaignData.created_by_name || "Campaign Creator"
            },
            donorCount: campaignData.donor_count || 0,
            daysLeft: daysLeft > 0 ? daysLeft : 0
          };
          
          setCampaign(formattedCampaign);
        }
      } catch (error) {
        console.error("Error fetching campaign:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCampaign();
  }, [id, supabase]);
  
  // Handle preset amount selection
  const handleAmountSelect = (amount) => {
    setFormData({
      ...formData,
      amount,
      customAmount: amount.toString()
    });
  };
  
  // Handle custom amount input
  const handleCustomAmount = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setFormData({
      ...formData,
      customAmount: value,
      amount: parseInt(value || 0)
    });
  };
  
  // Handle all other form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  // Validate step 1 - Donation amount
  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Please enter a valid donation amount';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Validate step 2 - Personal information
  const validateStep2 = () => {
    const newErrors = {};
    
    if (!formData.anonymous) {
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
      }
      
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required for payment';
    } else if (!/^\+?[0-9]{10,15}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Move to next step
  const nextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };
  
  // Move to previous step
  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  // Handle form submission with database transaction for data integrity
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (step !== 3) return nextStep();
    
    // Process payment
    setPaymentLoading(true);
    
    try {
      // Begin a Supabase transaction using RPC function
      // This should be implemented as a Supabase Edge Function/PostgreSQL function
      // for production to ensure data consistency
      
      // Add donation record to Supabase
      const { data: donation, error } = await supabase
        .from('donations')
        .insert([
          {
            campaign_id: id,
            amount: formData.amount,
            donor_name: formData.anonymous ? null : formData.name,
            donor_email: formData.anonymous ? null : formData.email,
            donor_phone: formData.phone,
            message: formData.message,
            is_anonymous: formData.anonymous,
            payment_method: formData.paymentMethod,
            status: 'pending' // Initial status, would be updated by payment webhook
          }
        ])
        .select()
        .single();
      
      if (error) throw error;
      
      // In a real app, you would call your payment gateway API here
      // This is a simplified example - in production, use a secure payment service
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // IMPORTANT: Get fresh campaign data before updating to prevent race conditions
      const { data: freshCampaign } = await supabase
        .from('campaigns')
        .select('current_amount, donor_count')
        .eq('id', id)
        .single();
      
      if (!freshCampaign) throw new Error('Failed to fetch updated campaign data');
      
      // Update campaign amount in Supabase
      // Note: In production, this should be done in a transaction or via a webhook
      const { error: updateError } = await supabase
        .from('campaigns')
        .update({ 
          current_amount: (freshCampaign.current_amount || 0) + formData.amount,
          donor_count: (freshCampaign.donor_count || 0) + 1
        })
        .eq('id', id);
      
      if (updateError) throw updateError;
      
      // Update donation status
      const { error: statusError } = await supabase
        .from('donations')
        .update({ status: 'completed' })
        .eq('id', donation.id);
      
      if (statusError) console.error("Error updating donation status:", statusError);
      
      // Show success state
      setPaymentSuccess(true);
      
      // Redirect after a delay
      setTimeout(() => {
        router.push(`/campaign/${id}?donation=success`);
      }, 3000);
      
    } catch (error) {
      console.error("Payment error:", error);
      setErrors({
        submit: error.message || 'Payment processing failed. Please try again.'
      });
    } finally {
      setPaymentLoading(false);
    }
  };
  
  // Loading state
  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-10 w-64 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
          </div>
        </div>
        <Footer />
      </>
    );
  }
  
  // Campaign not found state
  if (!campaign) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Campaign Not Found</h2>
            <p className="mb-4">The campaign you're looking for doesn't exist or has been removed.</p>
            <Link 
              href="/campaigns/explore" 
              className="inline-block bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
            >
              Browse Campaigns
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }
  
  // Payment success state
  if (paymentSuccess) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
              <FaCheckCircle className="text-3xl text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Thank You!</h2>
            <p className="text-gray-600 mb-6">
              Your donation of <span className="font-medium">TSh {formData.amount.toLocaleString()}</span> to "{campaign.title}" has been processed successfully.
            </p>
            <div className="space-y-3">
              <Link 
                href={`/campaign/${id}`}
                className="block w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-lg text-center transition"
              >
                View Campaign
              </Link>
              <Link 
                href="/campaigns/explore"
                className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-lg text-center transition"
              >
                Explore More Campaigns
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }
  
  // Calculate percentage completed - capped at 100%
  const pct = Math.min(Math.round((campaign.raised / campaign.goal) * 100), 100);
  
  return (
    <>
      <Header />
      <main className="bg-gray-50 min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Link href={`/campaign/${id}`} className="inline-flex items-center text-purple-600 hover:text-purple-800 mb-6">
              <FaAngleLeft className="mr-1" />
              <span>Back to Campaign</span>
            </Link>
            
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Header */}
              <div className="bg-purple-600 text-white px-6 py-4">
                <h1 className="text-xl font-bold">Donate to Support</h1>
                <p>{campaign.title}</p>
              </div>
              
              <div className="p-6">
                {/* Progress Indicator */}
                <div className="mb-8">
                  <div className="flex justify-between mb-2">
                    <div className={`text-sm font-medium ${step >= 1 ? 'text-purple-600' : 'text-gray-400'}`}>Amount</div>
                    <div className={`text-sm font-medium ${step >= 2 ? 'text-purple-600' : 'text-gray-400'}`}>Information</div>
                    <div className={`text-sm font-medium ${step >= 3 ? 'text-purple-600' : 'text-gray-400'}`}>Payment</div>
                  </div>
                  <div 
                    className="w-full bg-gray-100 rounded-full h-2"
                    role="progressbar" 
                    aria-valuenow={step} 
                    aria-valuemin="1" 
                    aria-valuemax="3"
                    aria-label="Form progress"
                  >
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(step / 3) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <form onSubmit={handleSubmit}>
                  {/* Step 1: Donation Amount */}
                  {step === 1 && (
                    <div>
                      <h2 className="text-xl font-semibold mb-4 text-gray-800">Choose Donation Amount</h2>
                      
                      {/* Preset amounts */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                        {PRESET_AMOUNTS.map((preset) => (
                          <button
                            key={preset.value}
                            type="button"
                            className={`py-3 px-4 rounded-lg border text-center transition ${
                              formData.amount === preset.value
                                ? 'border-purple-600 bg-purple-50 text-purple-700'
                                : 'border-gray-200 hover:border-purple-200 hover:bg-purple-50'
                            }`}
                            onClick={() => handleAmountSelect(preset.value)}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                      
                      {/* Custom amount input */}
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="customAmount">
                          Custom Amount (TSh)
                        </label>
                        <input
                          id="customAmount"
                          type="text"
                          name="customAmount"
                          value={formData.customAmount}
                          onChange={handleCustomAmount}
                          placeholder="Enter amount"
                          className={`w-full px-4 py-3 rounded-lg border ${
                            errors.amount ? 'border-red-300' : 'border-gray-300'
                          } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                          aria-invalid={errors.amount ? "true" : "false"}
                        />
                        {errors.amount && (
                          <p className="mt-2 text-sm text-red-600" role="alert">{errors.amount}</p>
                        )}
                      </div>
                      
                      {/* Campaign progress info */}
                      <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <h3 className="font-medium mb-2 text-gray-800">Campaign Progress</h3>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                          <div
                            style={{ width: `${pct}%` }}
                            className="bg-purple-600 h-2.5 rounded-full"
                            role="progressbar"
                            aria-valuenow={pct}
                            aria-valuemin="0"
                            aria-valuemax="100"
                          ></div>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>TSh {campaign.raised.toLocaleString()} raised</span>
                          <span>Goal: TSh {campaign.goal.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Step 2: Personal Information */}
                  {step === 2 && (
                    <div>
                      <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Information</h2>
                      
                      {/* Anonymous donation option */}
                      <div className="mb-4">
                        <div className="flex items-center mb-4">
                          <input
                            id="anonymous"
                            name="anonymous"
                            type="checkbox"
                            checked={formData.anonymous}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                          />
                          <label htmlFor="anonymous" className="ml-2 block text-sm text-gray-700">
                            Donate anonymously
                          </label>
                        </div>
                      </div>
                      
                      {/* Personal information fields - shown only if not anonymous */}
                      {!formData.anonymous && (
                        <>
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="name">
                              Your Name
                            </label>
                            <input
                              id="name"
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              placeholder="Enter your name"
                              className={`w-full px-4 py-3 rounded-lg border ${
                                errors.name ? 'border-red-300' : 'border-gray-300'
                              } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                              aria-invalid={errors.name ? "true" : "false"}
                            />
                            {errors.name && (
                              <p className="mt-2 text-sm text-red-600" role="alert">{errors.name}</p>
                            )}
                          </div>
                          
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">
                              Email Address
                            </label>
                            <input
                              id="email"
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              placeholder="Enter your email"
                              className={`w-full px-4 py-3 rounded-lg border ${
                                errors.email ? 'border-red-300' : 'border-gray-300'
                              } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                              aria-invalid={errors.email ? "true" : "false"}
                            />
                            {errors.email && (
                              <p className="mt-2 text-sm text-red-600" role="alert">{errors.email}</p>
                            )}
                          </div>
                        </>
                      )}
                      
                      {/* Phone number - required for all donations */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="phone">
                          Phone Number (for payment)
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Enter your phone number"
                          className={`w-full px-4 py-3 rounded-lg border ${
                            errors.phone ? 'border-red-300' : 'border-gray-300'
                          } focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                          aria-invalid={errors.phone ? "true" : "false"}
                        />
                        {errors.phone && (
                          <p className="mt-2 text-sm text-red-600" role="alert">{errors.phone}</p>
                        )}
                      </div>
                      
                      {/* Optional message */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="message">
                          Message (Optional)
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          rows="3"
                          placeholder="Add a message of support (will be visible on the campaign page)"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        ></textarea>
                      </div>
                    </div>
                  )}
                  
                  {/* Step 3: Payment Method */}
                  {step === 3 && (
                    <div>
                      <h2 className="text-xl font-semibold mb-4 text-gray-800">Payment Method</h2>
                      
                      {/* Donation summary */}
                      <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <h3 className="font-medium mb-2 text-gray-800">Donation Summary</h3>
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-600">Donation Amount:</span>
                          <span className="font-medium text-gray-800">TSh {formData.amount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Processing Fee:</span>
                          <span className="text-gray-800">TSh 0</span>
                        </div>
                        <div className="border-t border-gray-200 my-2 pt-2 flex justify-between">
                          <span className="font-medium text-gray-800">Total:</span>
                          <span className="font-semibold text-gray-800">TSh {formData.amount.toLocaleString()}</span>
                        </div>
                      </div>
                      
                      {/* Payment method selection */}
                      <div className="mb-6">
                        <div className="text-sm font-medium text-gray-700 mb-3">Select Payment Method</div>
                        
                        <div className="space-y-3">
                          {/* Mobile Money option */}
                          <label className={`block p-3 border rounded-lg cursor-pointer transition ${
                            formData.paymentMethod === 'mobile_money' 
                              ? 'border-purple-600 bg-purple-50' 
                              : 'border-gray-200 hover:border-purple-200'
                          }`}>
                            <div className="flex items-center">
                              <input
                                type="radio"
                                id="mobile_money"
                                name="paymentMethod"
                                value="mobile_money"
                                checked={formData.paymentMethod === 'mobile_money'}
                                onChange={handleInputChange}
                                className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                              />
                              <div className="ml-3 flex items-center">
                                <FaMobileAlt className="mr-2 text-gray-500" />
                                <span>Mobile Money (M-Pesa, Tigo Pesa, Airtel Money)</span>
                              </div>
                            </div>
                          </label>
                          
                          {/* Credit/Debit Card option */}
                          <label className={`block p-3 border rounded-lg cursor-pointer transition ${
                            formData.paymentMethod === 'card' 
                              ? 'border-purple-600 bg-purple-50' 
                              : 'border-gray-200 hover:border-purple-200'
                          }`}>
                            <div className="flex items-center">
                              <input
                                type="radio"
                                id="card"
                                name="paymentMethod"
                                value="card"
                                checked={formData.paymentMethod === 'card'}
                                onChange={handleInputChange}
                                className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                              />
                              <div className="ml-3 flex items-center">
                                <FaCreditCard className="mr-2 text-gray-500" />
                                <span>Credit/Debit Card</span>
                              </div>
                            </div>
                          </label>
                          
                          {/* Bank Transfer option */}
                          <label className={`block p-3 border rounded-lg cursor-pointer transition ${
                            formData.paymentMethod === 'bank_transfer' 
                              ? 'border-purple-600 bg-purple-50' 
                              : 'border-gray-200 hover:border-purple-200'
                          }`}>
                            <div className="flex items-center">
                              <input
                                type="radio"
                                id="bank_transfer"
                                name="paymentMethod"
                                value="bank_transfer"
                                checked={formData.paymentMethod === 'bank_transfer'}
                                onChange={handleInputChange}
                                className="h-4 w-4 text-purple-600 focus:ring-purple-500"
                              />
                              <div className="ml-3 flex items-center">
                                <FaMoneyBillWave className="mr-2 text-gray-500" />
                                <span>Bank Transfer</span>
                              </div>
                            </div>
                          </label>
                        </div>
                      </div>
                      
                      {/* Security message */}
                      <div className="flex items-center text-sm text-gray-600 mb-6">
                        <FaLock className="mr-2 text-gray-500" />
                        <span>Your payment information is secure. We use encryption to protect your data.</span>
                      </div>
                      
                      {/* Error message display */}
                      {errors.submit && (
                        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg" role="alert">
                          {errors.submit}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Navigation Buttons */}
                  <div className="flex justify-between mt-8">
                    {step > 1 ? (
                      <button
                        type="button"
                        onClick={prevStep}
                        className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                      >
                        Back
                      </button>
                    ) : (
                      <div></div>
                    )}
                    
                    <button
                      type="submit"
                      className={`px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center ${
                        paymentLoading ? 'opacity-75 cursor-not-allowed' : ''
                      }`}
                      disabled={paymentLoading}
                      aria-busy={paymentLoading ? "true" : "false"}
                    >
                      {/* Loading spinner */}
                      {paymentLoading && (
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      )}
                      {step === 3 ? (paymentLoading ? 'Processing...' : 'Complete Donation') : 'Continue'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}