"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  FaCalendarAlt, 
  FaUsers, 
  FaTag, 
  FaHandHoldingHeart, 
  FaShare, 
  FaFacebook, 
  FaTwitter, 
  FaWhatsapp,
  FaRegClock,
  FaMapMarkerAlt,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';

export default function CampaignDetailsPage() {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [relatedCampaigns, setRelatedCampaigns] = useState([]);
  
  // Initialize Supabase client
  const supabase = createClientComponentClient();
  
  useEffect(() => {
    // Fetch campaign details from Supabase
    const fetchCampaign = async () => {
      try {
        // Query the campaigns table with the campaign ID
        const { data: campaignData, error } = await supabase
          .from('campaigns')
          .select(`
            id, title, description, image_url, current_amount, goal_amount, 
            category, donor_count, end_date, created_at, created_by_name
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
          
          // Format the campaign data to match our component needs
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
            daysLeft: daysLeft > 0 ? daysLeft : 0,
            startDate: new Date(campaignData.created_at).toLocaleDateString(),
            endDate: new Date(campaignData.end_date).toLocaleDateString()
          };
          
          setCampaign(formattedCampaign);
          
          // Fetch top donors for this campaign
          const { data: donors } = await supabase
            .from('donations')
            .select('donor_name, amount, message, is_anonymous')
            .eq('campaign_id', id)
            .eq('status', 'completed')
            .order('amount', { ascending: false })
            .limit(3);
          
          if (donors && donors.length > 0) {
            formattedCampaign.topDonors = donors.map(donor => ({
              name: donor.is_anonymous ? 'Anonymous' : (donor.donor_name || 'Anonymous'),
              amount: donor.amount,
              message: donor.message
            }));
          } else {
            formattedCampaign.topDonors = [];
          }
          
          // Fetch related campaigns in the same category
          const { data: related } = await supabase
            .from('campaigns')
            .select('id, title, image_url, category, current_amount, goal_amount')
            .eq('category', campaignData.category)
            .neq('id', id) // Exclude current campaign
            .limit(3);
          
          if (related && related.length > 0) {
            setRelatedCampaigns(related.map(c => ({
              id: c.id,
              title: c.title,
              imageUrl: c.image_url,
              category: c.category,
              raised: c.current_amount || 0,
              goal: c.goal_amount,
              pct: Math.min(Math.round((c.current_amount || 0) / c.goal_amount * 100), 100)
            })));
          }
        }
      } catch (error) {
        console.error("Error fetching campaign:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCampaign();
  }, [id, supabase]);
  
  // Show loading state while fetching data
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
  
  // Show not found message if campaign doesn't exist
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
  
  // Calculate percentage completed - capped at 100%
  const pct = Math.min(Math.round((campaign.raised / campaign.goal) * 100), 100);
  
  // Determine progress bar color based on funding percentage
  const getProgressColor = () => {
    if (pct < 30) return "bg-yellow-500";
    if (pct < 70) return "bg-blue-500";
    return "bg-green-500";
  };
  
  return (
    <>
      <Header />
      <main className="bg-gray-50 min-h-screen">
        {/* Hero Section */}
        <div className="w-full bg-white shadow-sm">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Left Column - Campaign Image */}
              <div className="w-full md:w-3/5">
                <div className="relative w-full h-96 rounded-xl overflow-hidden mb-4">
                  {campaign.imageUrl ? (
                    <Image 
                      src={campaign.imageUrl}
                      alt={campaign.title}
                      fill
                      priority
                      style={{ objectFit: 'cover' }}
                      className="rounded-xl"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/800x500?text=No+Image+Available';
                      }}
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gradient-to-r from-purple-100 to-indigo-100">
                      <FaHandHoldingHeart className="h-16 w-16 text-purple-600" />
                    </div>
                  )}
                </div>
              </div>
              
              {/* Right Column - Quick Info */}
              <div className="w-full md:w-2/5">
                <div className="bg-gray-50 rounded-xl p-6">
                  {/* Campaign Category */}
                  <div className="flex items-center mb-3">
                    <FaTag className="text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">{campaign.category}</span>
                  </div>
                  
                  {/* Campaign Title */}
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">{campaign.title}</h1>
                  
                  {/* Campaign Description */}
                  <p className="text-gray-600 mb-6">{campaign.description}</p>
                  
                  {/* Time Remaining */}
                  <div className="flex items-center mb-6">
                    <div className="flex items-center">
                      <FaRegClock className="text-gray-400 mr-1" />
                      <span className="text-sm text-gray-600">{campaign.daysLeft} days left</span>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-gray-700">
                        {pct}% Complete
                      </span>
                      <span className="text-sm text-gray-500">
                        Goal: TSh {campaign.goal.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-100 rounded-full h-3 mb-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-full rounded-full ${getProgressColor()}`}
                        role="progressbar"
                        aria-valuenow={pct}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      />
                    </div>
                    
                    <div className="flex justify-between items-center text-sm">
                      <div className="font-semibold text-gray-800">
                        TSh {campaign.raised.toLocaleString()}
                        <span className="text-gray-500 font-normal"> raised</span>
                      </div>
                      
                      <div className="flex items-center">
                        <FaUsers className="mr-1 text-gray-400" />
                        <span>{campaign.donorCount} donors</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="space-y-3 mb-6">
                    <Link 
                      href={`/donate/${campaign.id}`}
                      className="block w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-lg text-center transition"
                    >
                      Donate Now
                    </Link>
                    
                    {/* Social Sharing Buttons */}
                    <div className="flex space-x-2">
                      <button className="flex-1 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 rounded-lg transition">
                        <FaShare className="mr-2" />
                        Share
                      </button>
                      <a 
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        aria-label="Share on Facebook"
                      >
                        <FaFacebook />
                      </a>
                      <a 
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Support "${campaign.title}" on JamiiFund`)}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 flex items-center justify-center bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition"
                        aria-label="Share on Twitter"
                      >
                        <FaTwitter />
                      </a>
                      <a 
                        href={`https://wa.me/?text=${encodeURIComponent(`Support "${campaign.title}" on JamiiFund: ${typeof window !== 'undefined' ? window.location.href : ''}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 flex items-center justify-center bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                        aria-label="Share on WhatsApp"
                      >
                        <FaWhatsapp />
                      </a>
                    </div>
                  </div>
                  
                  {/* Campaign Creator */}
                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-3">Campaign Organizer</h3>
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full overflow-hidden mr-3 bg-gray-200 flex items-center justify-center">
                        {/* Default creator avatar */}
                        <FaUsers className="text-gray-400 h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{campaign.createdBy.name}</p>
                        <p className="text-sm text-gray-600">Campaign Creator</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Campaign Details */}
            <div className="w-full lg:w-2/3">
              {/* Campaign Story */}
              <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Campaign Story</h2>
                <div className="prose max-w-none text-gray-700">
                  <p>{campaign.description}</p>
                  
                  <p className="mt-4">
                    This campaign aims to raise TSh {campaign.goal.toLocaleString()} to support this cause. 
                    Your contribution can make a real difference in our community.
                  </p>
                  
                  <h3 className="text-xl font-semibold mt-6 mb-3">How Your Donation Helps</h3>
                  <p>
                    Every donation, regardless of size, brings us closer to our goal. 
                    By contributing to this campaign, you're directly supporting:
                  </p>
                  <ul className="list-disc pl-6 mt-2">
                    <li>Providing essential resources for those in need</li>
                    <li>Creating a sustainable impact in our community</li>
                    <li>Supporting local initiatives that make a difference</li>
                  </ul>
                  
                  <h3 className="text-xl font-semibold mt-6 mb-3">Join Our Mission</h3>
                  <p>
                    Together, we can achieve our goal and create meaningful change. 
                    If you can't donate today, please consider sharing this campaign with 
                    your friends and family. Every share helps us reach potential donors.
                  </p>
                </div>
              </div>
              
              {/* Timeline Section */}
              <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Campaign Timeline</h2>
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center">
                    <div className="md:w-1/3">
                      <div className="flex items-center">
                        <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                          <FaCalendarAlt className="text-purple-600" />
                        </div>
                        <span className="font-medium">Start Date</span>
                      </div>
                    </div>
                    <div className="md:w-2/3 mt-2 md:mt-0">
                      <p>{campaign.startDate}</p>
                      <p className="text-sm text-gray-600">Campaign launched</p>
                    </div>
                  </div>
                  
                  <div className="border-l-2 border-dashed border-gray-200 h-10 ml-6 md:hidden"></div>
                  
                  <div className="flex flex-col md:flex-row md:items-center">
                    <div className="md:w-1/3">
                      <div className="flex items-center">
                        <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                          <FaRegClock className="text-purple-600" />
                        </div>
                        <span className="font-medium">Current Status</span>
                      </div>
                    </div>
                    <div className="md:w-2/3 mt-2 md:mt-0">
                      <p>{pct}% Funded</p>
                      <p className="text-sm text-gray-600">TSh {campaign.raised.toLocaleString()} raised of TSh {campaign.goal.toLocaleString()} goal</p>
                    </div>
                  </div>
                  
                  <div className="border-l-2 border-dashed border-gray-200 h-10 ml-6 md:hidden"></div>
                  
                  <div className="flex flex-col md:flex-row md:items-center">
                    <div className="md:w-1/3">
                      <div className="flex items-center">
                        <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                          <FaCalendarAlt className="text-purple-600" />
                        </div>
                        <span className="font-medium">End Date</span>
                      </div>
                    </div>
                    <div className="md:w-2/3 mt-2 md:mt-0">
                      <p>{campaign.endDate}</p>
                      <p className="text-sm text-gray-600">Campaign ends</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* FAQs - Hardcoded since we don't have actual FAQs in the schema */}
              <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  {[
                    {
                      question: "How will the funds be used?",
                      answer: "All funds will be used directly for the campaign purpose as described. We maintain transparency in fund utilization."
                    },
                    {
                      question: "Is my donation tax-deductible?",
                      answer: "Please consult with a tax professional about the tax implications of your donation in your region."
                    },
                    {
                      question: "Can I donate offline?",
                      answer: "Yes, please contact the campaign organizer directly for information on offline donation methods."
                    }
                  ].map((faq, index) => (
                    <div 
                      key={index} 
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <button 
                        className="w-full flex justify-between items-center p-4 text-left bg-gray-50 hover:bg-gray-100 transition"
                        onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                        aria-expanded={expandedFaq === index}
                      >
                        <span className="font-medium text-gray-800">{faq.question}</span>
                        {expandedFaq === index ? <FaChevronUp className="text-gray-500" /> : <FaChevronDown className="text-gray-500" />}
                      </button>
                      {expandedFaq === index && (
                        <div className="p-4 bg-white border-t border-gray-200">
                          <p className="text-gray-700">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Right Column - Sidebar */}
            <div className="w-full lg:w-1/3">
              {/* Top Donors - Only show if we have donors */}
              {campaign.topDonors && campaign.topDonors.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                  <h3 className="text-lg font-bold mb-4 text-gray-800">Top Donors</h3>
                  <div className="space-y-4">
                    {campaign.topDonors.map((donor, index) => (
                      <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-gray-800">{donor.name}</span>
                          <span className="text-purple-600 font-medium">TSh {donor.amount.toLocaleString()}</span>
                        </div>
                        {donor.message && (
                          <p className="text-sm text-gray-600">{donor.message}</p>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                    <Link 
                      href={`/donate/${campaign.id}`}
                      className="text-purple-600 hover:text-purple-800 font-medium transition"
                    >
                      Become a donor
                    </Link>
                  </div>
                </div>
              )}
              
              {/* Campaign Stats */}
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h3 className="text-lg font-bold mb-4 text-gray-800">Campaign Stats</h3>
                <div className="space-y-4">
                  <div className="flex">
                    <div className="w-1/2 text-gray-500 text-sm">Raised so far</div>
                    <div className="w-1/2 font-medium text-gray-800 text-right">TSh {campaign.raised.toLocaleString()}</div>
                  </div>
                  <div className="flex">
                    <div className="w-1/2 text-gray-500 text-sm">Goal amount</div>
                    <div className="w-1/2 font-medium text-gray-800 text-right">TSh {campaign.goal.toLocaleString()}</div>
                  </div>
                  <div className="flex">
                    <div className="w-1/2 text-gray-500 text-sm">Total donors</div>
                    <div className="w-1/2 font-medium text-gray-800 text-right">{campaign.donorCount}</div>
                  </div>
                  <div className="flex">
                    <div className="w-1/2 text-gray-500 text-sm">Days remaining</div>
                    <div className="w-1/2 font-medium text-gray-800 text-right">{campaign.daysLeft}</div>
                  </div>
                </div>
              </div>
              
              {/* Share Campaign */}
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h3 className="text-lg font-bold mb-4 text-gray-800">Spread the Word</h3>
                <p className="text-gray-600 mb-4">Help this campaign reach more people by sharing it with your friends and family.</p>
                <div className="grid grid-cols-3 gap-3">
                  <a 
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 text-blue-600 p-3 rounded-lg transition"
                    aria-label="Share on Facebook"
                  >
                    <FaFacebook className="text-xl mb-1" />
                    <span className="text-xs text-gray-700">Facebook</span>
                  </a>
                  <a 
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Support "${campaign.title}" on JamiiFund`)}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 text-sky-500 p-3 rounded-lg transition"
                    aria-label="Share on Twitter"
                  >
                    <FaTwitter className="text-xl mb-1" />
                    <span className="text-xs text-gray-700">Twitter</span>
                  </a>
                  <a 
                    href={`https://wa.me/?text=${encodeURIComponent(`Support "${campaign.title}" on JamiiFund: ${typeof window !== 'undefined' ? window.location.href : ''}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 text-green-600 p-3 rounded-lg transition"
                    aria-label="Share on WhatsApp"
                  >
                    <FaWhatsapp className="text-xl mb-1" />
                    <span className="text-xs text-gray-700">WhatsApp</span>
                  </a>
                </div>
              </div>
              
              {/* Related Campaigns */}
              {relatedCampaigns.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-bold mb-4 text-gray-800">Similar Campaigns</h3>
                  <div className="space-y-4">
                    {relatedCampaigns.map((relCampaign) => (
                      <Link 
                        key={relCampaign.id} 
                        href={`/campaign/${relCampaign.id}`}
                        className="block group"
                      >
                        <div className="flex items-center">
                          <div className="w-16 h-16 rounded-lg overflow-hidden mr-3 bg-gray-100">
                            {relCampaign.imageUrl ? (
                              <Image 
                                src={relCampaign.imageUrl}
                                alt={relCampaign.title}
                                width={64}
                                height={64}
                                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center bg-gray-100">
                                <FaHandHoldingHeart className="text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-800 group-hover:text-purple-600 transition line-clamp-1">{relCampaign.title}</h4>
                            <div className="flex items-center mt-1">
                              <div className="w-24 h-1.5 bg-gray-100 rounded-full mr-2">
                                <div 
                                  className="h-full rounded-full bg-purple-600" 
                                  style={{ width: `${relCampaign.pct}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-500">{relCampaign.pct}%</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}