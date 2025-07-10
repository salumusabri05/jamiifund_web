// Home page with featured campaigns section

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Hero from '@/components/Hero';
import CampaignCard from '@/components/CampaignCard';
import Link from 'next/link';

export default async function FetchCampaings() {
  // Initialize Supabase client
  const supabase = createServerComponentClient({ cookies });
  
  // Fetch featured campaigns
  const { data: featuredCampaigns, error } = await supabase
    .from('campaigns')
    .select('*, profiles(name)') // Join using created_by which references profiles
    .eq('is_featured', true) 
    .gt('created_at', new Date(Date.now() - 30*24*60*60*1000).toISOString())
    .order('created_at', { ascending: false })
    .limit(3);
    
  if (error) {
    console.error("Error fetching featured campaigns:", error);
    // Continue rendering the page even if featured campaigns can't be loaded
  }
  
  // Transform data for CampaignCard component
  const formattedCampaigns = featuredCampaigns ? featuredCampaigns.map(campaign => {
    // Calculate days left
    const endDate = new Date(campaign.end_date);
    const today = new Date();
    const daysLeft = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
    
    return {
      id: campaign.id,
      title: campaign.title,
      description: campaign.description,
      // Use actual values from schema
      raised: campaign.current_amount || 0,
      goal: campaign.goal_amount,
      category: campaign.category,
      createdBy: { 
        // First try creator name from schema, then from profiles join, then fallback
        name: campaign.created_by_name || 
              (campaign.profiles ? campaign.profiles.name : "Campaign Creator") 
      },
      donorCount: campaign.donor_count || 0,
      daysLeft: daysLeft > 0 ? daysLeft : 0,
      imageUrl: campaign.image_url
    };
  }) : [];
  
  return (
    <div>
      <Hero />
      
      {/* Featured Campaigns Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-center">Featured Campaigns</h2>
          
          {formattedCampaigns.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {formattedCampaigns.map(campaign => (
                <CampaignCard 
                  key={campaign.id} 
                  campaign={campaign} 
                  featured={true} 
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No featured campaigns currently available.</p>
          )}
          
          <div className="mt-8 text-center">
            <Link 
              href="/campaigns/explore"
              className="inline-block bg-purple-600 text-white py-2 px-6 rounded-lg hover:bg-purple-700 transition"
            >
              Explore All Campaigns
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}