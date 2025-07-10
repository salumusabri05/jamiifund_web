// Server Component for fetching all campaigns
import { supabase } from "@/lib/supabase";
import CampaignCard from '@/components/CampaignCard';

export default async function ExploreCampaignsPage() {
  // Fetch all active campaigns using regular Supabase client
  const { data: campaigns, error } = await supabase
    .from('campaigns')
    .select('*')
    .gt('end_date', new Date().toISOString())
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error("Error fetching campaigns:", error);
    return <div>Error loading campaigns</div>;
  }
  
  // Transform data to match CampaignCard component props
  const formattedCampaigns = campaigns.map(campaign => {
    // Calculate days left
    const endDate = new Date(campaign.end_date);
    const today = new Date();
    const daysLeft = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
    
    return {
      id: campaign.id,
      title: campaign.title,
      description: campaign.description,
      raised: campaign.current_amount,
      goal: campaign.goal_amount,
      category: campaign.category,
      createdBy: { name: campaign.created_by_name || "Campaign Creator" },
      donorCount: campaign.donor_count,
      daysLeft: daysLeft,
      imageUrl: campaign.image_url
    };
  });
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Explore Campaigns</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {formattedCampaigns.map(campaign => (
          <CampaignCard key={campaign.id} campaign={campaign} />
        ))}
      </div>
    </div>
  );
}