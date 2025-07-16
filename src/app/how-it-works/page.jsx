"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import ProcessTimeline from './components/ProcessTimeline';
import AnimatedSection from './components/AnimatedSection';
import FAQ from './components/FAQ';
import TestimonialCarousel from './components/TestimonialCarousel';
import Footer from './components/Footer';
import Header from './/components/Header';

export default function HowItWorksPage() {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50">
      <Header />
      {/* Hero Section */}
      <motion.div 
        className="relative py-16 md:py-24 px-4 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full bg-purple-200/30"
              style={{
                width: `${Math.random() * 300 + 100}px`,
                height: `${Math.random() * 300 + 100}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 20 + 20}s linear infinite`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
        </div>
        
        <div className="container mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-6 text-gray-800"
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              How <span className="text-purple-600">JamiiFund</span> Works
            </motion.h1>
            
            <motion.p 
              className="text-lg text-gray-600 mb-10"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              A transparent, secure, and effective platform connecting donors with meaningful causes. 
              See how we're changing charitable giving for the better.
            </motion.p>
          </div>
        </div>
      </motion.div>
      
      {/* Overview Section */}
      <AnimatedSection>
        <div className="container mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6 text-gray-800">Our Mission</h2>
                <p className="text-gray-600 mb-4">
                  JamiiFund connects compassionate donors with impactful community projects. 
                  We believe in transparent fundraising where every contribution makes a real difference.
                </p>
                <p className="text-gray-600">
                  Through our platform, we ensure that funds are collected securely and distributed 
                  effectively to the causes that need them most.
                </p>
              </div>
              <div className="relative h-64 md:h-80">
                <Image 
                  src="/images/jamiifund.png" 
                  alt="JamiiFund Mission"
                  fill
                  style={{ objectFit: 'contain' }}
                  className="p-4"
                />
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>
      
      {/* Process Timeline */}
      <AnimatedSection>
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">The JamiiFund Process</h2>
          <ProcessTimeline />
        </div>
      </AnimatedSection>
      
      {/* Fund Collection Section */}
      <AnimatedSection>
        <div className="container mx-auto px-4 py-12 bg-purple-50 rounded-3xl my-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-10 text-center text-gray-800">
              How Funds Are <span className="text-purple-600">Collected</span>
            </h2>
            
            <div className="space-y-12">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <motion.div 
                  className="w-full md:w-1/3 flex justify-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="bg-white p-6 rounded-full shadow-lg h-48 w-48 flex items-center justify-center">
                    <Image 
                      src="/images/jamiifund1.png" 
                      alt="Secure Payment Processing" 
                      width={120} 
                      height={120} 
                    />
                  </div>
                </motion.div>
                <div className="w-full md:w-2/3">
                  <h3 className="text-2xl font-semibold mb-3 text-gray-800">Secure Payment Processing</h3>
                  <p className="text-gray-600">
                    All donations are processed through our secure payment gateway that supports 
                    multiple payment methods including credit cards, mobile money, and bank transfers. 
                    Your financial information is protected with industry-standard encryption.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-full md:w-2/3 md:order-1 order-2">
                  <h3 className="text-2xl font-semibold mb-3 text-gray-800">Transparent Fee Structure</h3>
                  <p className="text-gray-600">
                    We believe in complete transparency. JamiiFund takes a small platform fee of 5% 
                    to maintain our operations and improve our services. Payment processors may charge 
                    an additional 2.9% + $0.30 per transaction. The remaining funds go directly to the 
                    campaigns you support.
                  </p>
                </div>
                <motion.div 
                  className="w-full md:w-1/3 flex justify-center md:order-2 order-1"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="bg-white p-6 rounded-full shadow-lg h-48 w-48 flex items-center justify-center">
                    <Image 
                      src="/images/jamiifund1.png" 
                      alt="Transparent Fee Structure" 
                      width={120} 
                      height={120} 
                    />
                  </div>
                </motion.div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <motion.div 
                  className="w-full md:w-1/3 flex justify-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="bg-white p-6 rounded-full shadow-lg h-48 w-48 flex items-center justify-center">
                    <Image 
                      src="/images/jamiifund.png" 
                      alt="Real-time Tracking" 
                      width={120} 
                      height={120} 
                    />
                  </div>
                </motion.div>
                <div className="w-full md:w-2/3">
                  <h3 className="text-2xl font-semibold mb-3 text-gray-800">Real-time Tracking</h3>
                  <p className="text-gray-600">
                    Campaign creators and donors can track fundraising progress in real-time. 
                    Our dashboard provides detailed insights into donation amounts, donor information 
                    (if not anonymous), and campaign milestones.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>
      
      {/* Fund Distribution Section */}
      <AnimatedSection>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-10 text-center text-gray-800">
              How Funds Are <span className="text-purple-600">Distributed</span>
            </h2>
            
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
              <div className="grid md:grid-cols-3 gap-6">
                <motion.div 
                  className="p-6 border border-purple-100 rounded-xl bg-gradient-to-b from-white to-purple-50"
                  whileHover={{ y: -10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <span className="text-purple-600 font-bold text-xl">1</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">Verification</h3>
                  <p className="text-gray-600">
                    Before funds are released, our team verifies the campaign's authenticity and the 
                    legitimacy of the organization or individual behind it.
                  </p>
                </motion.div>
                
                <motion.div 
                  className="p-6 border border-purple-100 rounded-xl bg-gradient-to-b from-white to-purple-50"
                  whileHover={{ y: -10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <span className="text-purple-600 font-bold text-xl">2</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">Fund Release</h3>
                  <p className="text-gray-600">
                    Once verified, funds are transferred to the campaign creator's designated account, 
                    typically within 3-5 business days after the campaign ends or milestones are reached.
                  </p>
                </motion.div>
                
                <motion.div 
                  className="p-6 border border-purple-100 rounded-xl bg-gradient-to-b from-white to-purple-50"
                  whileHover={{ y: -10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <span className="text-purple-600 font-bold text-xl">3</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">Impact Reporting</h3>
                  <p className="text-gray-600">
                    Campaign creators provide regular updates on how funds are being used, including 
                    photos, stories, and progress reports that are shared with donors.
                  </p>
                </motion.div>
              </div>
            </div>
            
            <div className="bg-purple-600 text-white rounded-2xl p-8">
              <h3 className="text-2xl font-semibold mb-4">Our Commitment to Transparency</h3>
              <p className="mb-4">
                JamiiFund is committed to ensuring that funds reach their intended recipients and are 
                used for their stated purpose. We take the following measures:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Regular audits of campaign finances</li>
                <li>Requirement for documentation of expenses</li>
                <li>Follow-up reviews of completed projects</li>
                <li>Direct community feedback mechanisms</li>
                <li>Optional escrow services for phased fund releases</li>
              </ul>
            </div>
          </div>
        </div>
      </AnimatedSection>
      
      {/* FAQ Section */}
      <AnimatedSection>
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold mb-10 text-center text-gray-800">Frequently Asked Questions</h2>
          <FAQ />
        </div>
      </AnimatedSection>
      
      {/* Testimonial Section */}
      <AnimatedSection>
        <div className="bg-purple-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-10 text-center text-gray-800">Success Stories</h2>
            <TestimonialCarousel />
          </div>
        </div>
      </AnimatedSection>
      
      {/* Call to Action */}
      <AnimatedSection>
        <div className="container mx-auto px-4 py-16">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-8 md:p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-6">Ready to Make a Difference?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Whether you want to start a campaign or support an existing one, JamiiFund makes it 
              easy to create positive change in your community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/campaigns/create" 
                className="bg-white text-purple-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-full transition-all hover:shadow-lg"
              >
                Start a Campaign
              </a>
              <a 
                href="/campaigns/explore" 
                className="bg-transparent hover:bg-purple-700 border-2 border-white text-white font-semibold py-3 px-8 rounded-full transition-all hover:shadow-lg"
              >
                Explore Campaigns
              </a>
            </div>
          </div>
        </div>
      </AnimatedSection>
      
      {/* Animation keyframes */}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(20px, 15px) rotate(10deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
      `}</style>
      <Footer />
    </div>
  );
}