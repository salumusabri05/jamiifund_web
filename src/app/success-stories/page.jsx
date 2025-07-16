"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import useSWR from 'swr';

// Fetch function for SWR
const fetcher = async (url) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
};

export default function SuccessStoriesPage() {
  const [isVisible, setIsVisible] = useState(false);
  
  // Categories for filtering
  const categories = ["All", "Healthcare", "Education", "Environment", "Infrastructure", "Economic Empowerment", "Youth Development"];
  const [activeCategory, setActiveCategory] = useState("All");
  
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  // Fetch success stories using SWR
  const { data, error, isLoading } = useSWR('/api/success-stories', fetcher);
  
  // Filter stories based on selected category
  const filteredStories = !data ? [] : activeCategory === "All" 
    ? data.stories 
    : data.stories.filter(story => story.category === activeCategory);
  
  // Featured story
  const featuredStory = data?.featuredStory;
  
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-white to-purple-50">
        {/* Hero Section */}
        <motion.div 
          className="relative py-16 md:py-24 px-4 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="container mx-auto relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <motion.h1 
                className="text-4xl md:text-5xl font-bold mb-6 text-gray-800"
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Success <span className="text-purple-600">Stories</span>
              </motion.h1>
              
              <motion.p 
                className="text-lg text-gray-600 mb-10"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Real impact made possible by the JamiiFund community
              </motion.p>
            </div>
          </div>
        </motion.div>
        
        {/* Category Filter */}
        <div className="container mx-auto px-4 mb-12">
          <div className="flex flex-wrap justify-center gap-2 md:gap-4">
            {categories.map(category => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm md:text-base transition-all ${
                  activeCategory === category 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-white text-gray-600 hover:bg-purple-100'
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        
        {/* Loading and Error States */}
        {isLoading && (
          <div className="container mx-auto px-4 py-12 text-center">
            <div className="animate-pulse">
              <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto"></div>
            </div>
          </div>
        )}
        
        {error && (
          <div className="container mx-auto px-4 py-12 text-center">
            <p className="text-red-600">Failed to load success stories. Please try again later.</p>
          </div>
        )}
        
        {/* Featured Success Story */}
        {featuredStory && (
          <div className="container mx-auto px-4 mb-16">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="grid md:grid-cols-2">
                <div className="relative h-64 md:h-auto">
                  <Image 
                    src={featuredStory.image} 
                    alt={featuredStory.title}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="p-8 md:p-12">
                  <div className="text-sm font-semibold text-purple-600 mb-2">FEATURED STORY</div>
                  <h2 className="text-3xl font-bold mb-4 text-gray-800">{featuredStory.title}</h2>
                  <p className="text-gray-600 mb-6">{featuredStory.excerpt}</p>
                  <div className="flex flex-wrap gap-6 mb-8">
                    <div>
                      <div className="text-sm text-gray-500">Location</div>
                      <div className="font-semibold">{featuredStory.location}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Funds Raised</div>
                      <div className="font-semibold">${featuredStory.raised.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Category</div>
                      <div className="font-semibold">{featuredStory.category}</div>
                    </div>
                  </div>
                  <Link 
                    href={`/success-stories/${featuredStory.slug}`}
                    className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-full transition-all hover:shadow-lg"
                  >
                    Read Full Story
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Success Stories Grid */}
        {!isLoading && filteredStories && (
          <div className="container mx-auto px-4 py-8">
            {filteredStories.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredStories.map(story => (
                  <motion.div 
                    key={story.id}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                    whileHover={{ y: -5 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="relative h-48">
                      <Image 
                        src={story.image} 
                        alt={story.title}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                      <div className="absolute top-4 right-4 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                        {story.category}
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-500">{story.location}</span>
                        <span className="text-sm font-semibold">${story.raised.toLocaleString()}</span>
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-gray-800">{story.title}</h3>
                      <p className="text-gray-600 mb-4">{story.excerpt}</p>
                      <div className="bg-purple-50 p-3 rounded-lg mb-4">
                        <div className="text-sm font-semibold text-purple-800 mb-1">Impact:</div>
                        <div className="text-sm text-gray-700">{story.impact}</div>
                      </div>
                      <Link 
                        href={`/success-stories/${story.slug}`}
                        className="text-purple-600 font-semibold hover:text-purple-800 inline-flex items-center"
                      >
                        Read Full Story
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">No success stories found in this category.</p>
              </div>
            )}
          </div>
        )}
        
        {/* Start Your Campaign CTA */}
        <div className="bg-purple-600 py-16 mt-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4 text-white">Ready to Make a Difference?</h2>
            <p className="text-purple-100 mb-8 max-w-2xl mx-auto">
              Join our community of changemakers and start your own impactful campaign today.
              Your project could be the next success story featured here!
            </p>
            <Link 
              href="/campaigns/create"
              className="inline-block bg-white text-purple-600 font-bold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors shadow-lg"
            >
              Start Your Campaign
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}