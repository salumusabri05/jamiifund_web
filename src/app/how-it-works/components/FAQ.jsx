"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';

const faqs = [
  {
    question: "How much of my donation goes to the cause?",
    answer: "At JamiiFund, we strive to maximize the impact of your generosity. Approximately 92.1% of your donation goes directly to the cause you support. We take a 5% platform fee to maintain our operations, and payment processors charge about 2.9% + $0.30 per transaction."
  },
  {
    question: "How do you verify campaigns?",
    answer: "We use a multi-step verification process including identity verification, documentation review, and community validation. For larger campaigns, we may require additional documentation such as organizational registration papers, project plans, or references."
  },
  {
    question: "When will campaign creators receive the funds?",
    answer: "Funds are typically released 3-5 business days after a campaign ends or reaches its goal. For ongoing campaigns, funds may be released at specified milestones or on a regular schedule, depending on the campaign settings chosen by the creator."
  },
  {
    question: "What happens if a campaign doesn't reach its goal?",
    answer: "Campaign creators can choose between two funding models: 'All-or-Nothing' where funds are only released if the goal is met (otherwise donors are refunded), or 'Keep-What-You-Raise' where all donations are provided regardless of whether the goal is reached."
  },
  {
    question: "How do you prevent fraudulent campaigns?",
    answer: "We employ both automated systems and manual reviews to detect potentially fraudulent campaigns. This includes identity verification, review of campaign materials, and monitoring of campaign activity. We also have a community reporting system where users can flag suspicious campaigns for review."
  },
  {
    question: "Can I get a tax receipt for my donation?",
    answer: "Yes, for eligible campaigns run by registered non-profit organizations, you can receive an official tax receipt. For personal campaigns, donations are typically considered personal gifts and are not tax-deductible. The tax status of each campaign is clearly indicated on the campaign page."
  }
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);
  
  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-gray-100 last:border-b-0">
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-purple-50 transition-colors"
            >
              <span className="text-lg font-medium text-gray-800">{faq.question}</span>
              <motion.div
                animate={{ rotate: activeIndex === index ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <FaChevronDown className="text-purple-600" />
              </motion.div>
            </button>
            
            <AnimatePresence>
              {activeIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 py-4 bg-purple-50 text-gray-600">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}