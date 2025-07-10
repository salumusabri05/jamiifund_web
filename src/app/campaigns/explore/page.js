
// app/page.js - Main entry point for the JamiiFund application
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CampaignCard from "@/components/CampaignCard";
import ExploreCampaignsPage from "@/app/campaigns/explore/_components/Campaigns";

export default function HomePage() {
  return <>
    <Header />
  <ExploreCampaignsPage/>
  <Footer />
  </>;
}
