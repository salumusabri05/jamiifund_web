"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from "@/lib/supabase";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BlogClient from './_components/BlogClient';

// Categories for filtering
const categories = ["All", "Fundraising", "Marketing", "Impact", "Donor Relations", "Community", "Sustainability"];

export default function BlogPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [blogPosts, setBlogPosts] = useState([]);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchBlogPosts = async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*, authors(name)')
        .eq('published', true)
        .order('publish_date', { ascending: false });
        
      if (error) {
        console.error("Error fetching blog posts:", error);
        setError("Error loading blog posts. Please try again later.");
      } else {
        setBlogPosts(data);
      }
      
      setIsVisible(true);
    };
    
    fetchBlogPosts();
  }, []);
  
  // Transform data to match the expected format for blog posts
  const formattedPosts = blogPosts.map(post => {
    return {
      id: post.id,
      title: post.title,
      excerpt: post.excerpt || post.content.substring(0, 150) + '...',
      image: post.featured_image || "/images/blog/default.jpg",
      date: new Date(post.publish_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      author: post.authors?.name || "JamiiFund Team",
      category: post.category,
      slug: post.slug || post.id.toString()
    };
  });
  
  // Filter posts based on selected category
  const [activeCategory, setActiveCategory] = useState("All");
  const filteredPosts = activeCategory === "All" 
    ? formattedPosts 
    : formattedPosts.filter(post => post.category === activeCategory);
  
  if (error) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-to-b from-white to-purple-50 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
                JamiiFund <span className="text-purple-600">Blog</span>
              </h1>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }
  
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
                JamiiFund <span className="text-purple-600">Blog</span>
              </motion.h1>
              
              <motion.p 
                className="text-lg text-gray-600 mb-10"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Insights, tips, and stories to help you create impactful community campaigns
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
        
        {/* Blog Posts Grid */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map(post => (
              <motion.div 
                key={post.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="relative h-48">
                  <Image 
                    src={post.image} 
                    alt={post.title}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="absolute top-4 right-4 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {post.category}
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-sm text-gray-500 mb-2">{post.date} • By {post.author}</div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">{post.title}</h3>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <Link 
                    href={`/blog/${post.slug}`}
                    className="text-purple-600 font-semibold hover:text-purple-800 inline-flex items-center"
                  >
                    Read More
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Newsletter Subscription */}
        <div className="bg-purple-100 py-16 mt-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4 text-gray-800">Stay Updated</h2>
              <p className="text-gray-600 mb-8">
                Subscribe to our newsletter to receive the latest fundraising tips, success stories, 
                and platform updates straight to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="px-4 py-3 rounded-full flex-grow max-w-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
                <button className="bg-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-purple-700 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}