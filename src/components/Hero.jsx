"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaHandHoldingHeart, FaLightbulb, FaUsers } from 'react-icons/fa';

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  
  // Features to cycle through
  const features = [
    {
      title: "Empower Communities",
      description: "Support local initiatives that create lasting change",
      icon: <FaHandHoldingHeart className="h-10 w-10 text-purple-500" />
    },
    {
      title: "Start Fundraising",
      description: "Create your campaign in minutes and reach donors who care",
      icon: <FaLightbulb className="h-10 w-10 text-purple-500" />
    },
    {
      title: "Join The Movement",
      description: "Be part of a community dedicated to positive change",
      icon: <FaUsers className="h-10 w-10 text-purple-500" />
    }
  ];

  // Animate in on component mount
  useEffect(() => {
    setIsVisible(true);
    
    // Cycle through features
    const interval = setInterval(() => {
      setActiveFeature(current => (current + 1) % features.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 p-8 shadow-xl">
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 right-0 bottom-0 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full bg-purple-200/30"
              style={{
                width: `${Math.random() * 200 + 50}px`,
                height: `${Math.random() * 200 + 50}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 10 + 15}s linear infinite`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
        </div>
        
        <div className="relative z-10">
          {/* Main content */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800 animate-fade-in">
              JamiiFund
              <span className="block text-purple-600">Community charity Fundraising and organisation</span>
            </h1>
            
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Connect with causes that matter and make a difference in your community , raise the funds with transparency ,effectiveness and follow up
            </p>
          </div>
          
          {/* Feature showcase */}
          <div className="max-w-md mx-auto mb-8 min-h-[120px] flex items-center justify-center">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`absolute transition-all duration-700 flex flex-col items-center text-center ${
                  index === activeFeature 
                    ? 'opacity-100 transform-none' 
                    : 'opacity-0 translate-x-8'
                }`}
              >
                <div className="mb-3">{feature.icon}</div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h2>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
          
          {/* Call to action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/campaigns/create" 
              className="animate-pulse-slow bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-full transition-all hover:shadow-lg transform hover:-translate-y-1"
            >
              Start a Campaign
            </Link>
            <Link 
              href="/campaigns/explore" 
              className="bg-white text-purple-600 font-semibold py-3 px-6 rounded-full border border-purple-600 hover:bg-purple-50 transition-all hover:shadow-md transform hover:-translate-y-1"
            >
              Explore Campaigns
            </Link>
          </div>
          
          {/* Dot indicators */}
          <div className="flex justify-center space-x-2 mt-8">
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveFeature(index)}
                className={`h-2.5 rounded-full transition-all ${
                  index === activeFeature ? 'w-8 bg-purple-600' : 'w-2.5 bg-purple-300'
                }`}
                aria-label={`Feature ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Add custom animation keyframes */}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(30px, 20px) rotate(180deg); }
          100% { transform: translate(0, 0) rotate(360deg); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s infinite;
        }
        
        .animate-fade-in {
          animation: fadeIn 1s ease-in forwards;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
