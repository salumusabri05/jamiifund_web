// components/CampaignCard.js
"use client"; // client component so we can use hooks/events

import Link from "next/link";
import { useState } from "react";
import { FaCalendarAlt, FaUsers, FaTag, FaHandHoldingHeart } from "react-icons/fa";

/**
 * Displays a single campaign summary.
 * @param {Object} campaign - Campaign data object from database
 * @param {boolean} featured - Whether this is a featured campaign
 */
export default function CampaignCard({ campaign = {}, featured = false }) {
  // Destructure campaign object with defaults for missing properties
  // This makes the component more resilient when connecting to a database
  const { 
    id = "default-id", 
    title = "Campaign Title", 
    description = "Campaign description goes here", 
    raised = 0, 
    goal = 1000, 
    category = "Community",
    createdBy = { name: "Campaign Creator" },
    donorCount = 0,
    daysLeft = 30
  } = campaign || {};
  
  // State for hover effects
  const [isHovered, setIsHovered] = useState(false);
  
  // Calculate percentage completed - capped at 100%
  const pct = Math.min(Math.round((raised / goal) * 100), 100);
  
  // Determine progress bar color based on funding percentage
  const getProgressColor = () => {
    if (pct < 30) return "bg-yellow-500";
    if (pct < 70) return "bg-blue-500";
    return "bg-green-500";
  };

  return (
    <div 
      className={`relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 ${
        featured ? "border-2 border-purple-400" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Featured badge */}
      {featured && (
        <div className="absolute top-3 right-3 z-10 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full">
          Featured
        </div>
      )}
      
      {/* Campaign icon placeholder */}
      <div className="h-48 w-full bg-gradient-to-r from-purple-100 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <FaHandHoldingHeart className="mx-auto h-12 w-12 text-purple-600 mb-2" />
          <h3 className="text-lg font-semibold text-gray-800">{category}</h3>
        </div>
      </div>
      
      <div className="p-5 bg-white">
        {/* Category tag */}
        <div className="flex items-center mb-2">
          <FaTag className="text-gray-400 mr-1" size={12} />
          <span className="text-xs text-gray-500">{category}</span>
        </div>
        
        {/* Title and Description */}
        <Link href={`/campaign/${id}`}>
          <h3 className="text-lg font-semibold mb-2 line-clamp-1 hover:text-purple-600 transition">{title}</h3>
        </Link>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{description}</p>

        {/* Progress section */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700">
              {pct}% Complete
            </span>
            <span className="text-xs text-gray-500">
              Goal: TSh {goal.toLocaleString()}
            </span>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-100 rounded-full h-2.5 mb-2">
            <div
              style={{ width: `${pct}%` }}
              className={`h-full rounded-full ${getProgressColor()} transition-all duration-500`}
            />
          </div>
          
          {/* Amount raised and time remaining */}
          <div className="flex justify-between items-center text-xs text-gray-600">
            <div className="font-semibold">
              TSh {raised.toLocaleString()}
              <span className="text-gray-500 font-normal"> raised</span>
            </div>
            
            <div className="flex items-center">
              <FaCalendarAlt className="mr-1 text-gray-400" size={12} />
              <span>{daysLeft} days left</span>
            </div>
          </div>
        </div>
        
        {/* Campaign creator and donor count */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center">
            <span className="text-xs text-gray-600">by {createdBy.name}</span>
          </div>
          
          <div className="flex items-center text-xs text-gray-500">
            <FaUsers className="mr-1" size={12} />
            <span>{donorCount} donors</span>
          </div>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="flex border-t border-gray-100">
        <Link 
          href={`/campaign/${id}`} 
          className="py-3 flex-1 text-center text-sm text-purple-600 font-medium hover:bg-purple-50 transition"
        >
          View Details
        </Link>
        <Link 
          href={`/donate/${id}`} 
          className="py-3 flex-1 text-center text-sm text-white font-medium bg-purple-600 hover:bg-purple-700 transition"
        >
          Donate Now
        </Link>
      </div>
    </div>
  );
}
