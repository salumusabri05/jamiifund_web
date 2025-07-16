import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Fetch successful/completed campaigns
    const { data: successStories, error } = await supabase
      .from('campaigns')
      .select('*')
      // Conditions for success stories - completed campaigns that reached their goal
      .lt('end_date', new Date().toISOString()) // Past end date
      .gte('current_amount', supabase.raw('goal_amount')) // Met or exceeded goal
      .order('end_date', { ascending: false }); // Most recently completed first
      
    if (error) throw error;
    
    // Transform data to match the expected format for success stories
    const formattedStories = successStories.map(campaign => {
      return {
        id: campaign.id,
        title: campaign.title,
        excerpt: campaign.description.substring(0, 150) + '...',
        impact: campaign.impact || `Raised ${campaign.current_amount.toLocaleString()} to support this initiative.`,
        image: campaign.image_url || "/images/default-success.jpg",
        raised: campaign.current_amount,
        category: campaign.category,
        location: campaign.location,
        slug: campaign.slug || campaign.id.toString()
      };
    });
    
    // Determine featured story (e.g., highest funded completed campaign)
    let featuredStory = null;
    if (formattedStories.length > 0) {
      featuredStory = formattedStories.reduce((max, story) => 
        story.raised > max.raised ? story : max, formattedStories[0]);
    }
    
    return NextResponse.json({ stories: formattedStories, featuredStory });
  } catch (error) {
    console.error("Error fetching success stories:", error);
    return NextResponse.json(
      { error: "Failed to fetch success stories" },
      { status: 500 }
    );
  }
}