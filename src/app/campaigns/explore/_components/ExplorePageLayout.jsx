"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ExplorePageLayout({ children }) {
  return (
    <div>
      <Header />
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
      <Footer />
    </div>
  );
}