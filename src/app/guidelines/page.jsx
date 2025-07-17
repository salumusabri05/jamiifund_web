//JAMIIFUND\jamiifund\src\app\guidelines\page.jsx
"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FaUsers, FaUserFriends, FaHandsHelping, FaBan, FaComments, FaImage, FaExclamationTriangle, FaSyncAlt } from 'react-icons/fa';

export default function CommunityGuidelines() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState("values");
  
  useEffect(() => {
    setIsVisible(true);
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    { id: "values", name: "Our Values" },
    { id: "responsibilities", name: "Creator Responsibilities" },
    { id: "prohibited", name: "Prohibited Campaigns" },
    { id: "interaction", name: "Community Interaction" },
    { id: "content", name: "Content Guidelines" },
    { id: "reporting", name: "Reporting Violations" },
  ];

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
              <motion.div 
                className="inline-flex items-center justify-center mb-6"
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <FaUsers className="h-12 w-12 text-purple-600 mr-4" />
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
                  Community <span className="text-purple-600">Guidelines</span>
                </h1>
              </motion.div>
              
              <motion.p 
                className="text-lg text-gray-600 mb-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Building a trusted and supportive fundraising community together
              </motion.p>
              
              <motion.p
                className="text-sm text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                Last Updated: July 17, 2025
              </motion.p>
            </div>
          </div>
        </motion.div>
        
        {/* Section Navigation */}
        <div className="container mx-auto px-4 mb-12">
          <div className="bg-white rounded-xl shadow-md p-4 overflow-x-auto">
            <div className="flex space-x-4 min-w-max">
              {sections.map((section) => (
                <button
                  key={section.id}
                  className={`py-2 px-4 rounded-lg transition-colors whitespace-nowrap ${
                    activeSection === section.id 
                      ? "bg-purple-600 text-white" 
                      : "text-gray-600 hover:bg-purple-50"
                  }`}
                  onClick={() => {
                    setActiveSection(section.id);
                    document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {section.name}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-8 mb-12">
            <div className="space-y-12">
              {/* Our Values */}
              <div id="values">
                <LegalSection 
                  icon={<FaHandsHelping />}
                  title="1. Our Community Values"
                  content={
                    <>
                      <p className="mb-4">
                        JamiiFund is built on trust, transparency, and a shared commitment to helping others. 
                        These guidelines outline the expectations for all users of our platform to ensure a 
                        positive and supportive community.
                      </p>
                      <div className="grid md:grid-cols-3 gap-4 mt-6">
                        <motion.div 
                          className="bg-purple-50 p-4 rounded-lg text-center"
                          whileHover={{ y: -5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <h4 className="font-bold text-gray-800 mb-2">Trust</h4>
                          <p className="text-sm text-gray-600">
                            Being honest and reliable in all interactions
                          </p>
                        </motion.div>
                        <motion.div 
                          className="bg-purple-50 p-4 rounded-lg text-center"
                          whileHover={{ y: -5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <h4 className="font-bold text-gray-800 mb-2">Transparency</h4>
                          <p className="text-sm text-gray-600">
                            Being open about how funds are used
                          </p>
                        </motion.div>
                        <motion.div 
                          className="bg-purple-50 p-4 rounded-lg text-center"
                          whileHover={{ y: -5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <h4 className="font-bold text-gray-800 mb-2">Respect</h4>
                          <p className="text-sm text-gray-600">
                            Treating all community members with dignity
                          </p>
                        </motion.div>
                      </div>
                    </>
                  }
                />
              </div>
              
              {/* Creator Responsibilities */}
              <div id="responsibilities">
                <LegalSection 
                  icon={<FaUserFriends />}
                  title="2. Campaign Creator Responsibilities"
                  content={
                    <>
                      <p className="mb-4">
                        As a Campaign Creator, you must:
                      </p>
                      <div className="bg-purple-50 p-6 rounded-lg">
                        <ul className="space-y-3">
                          <li className="flex items-start">
                            <span className="text-purple-600 mr-2 mt-1">✓</span>
                            <span>Provide honest and accurate information about your campaign</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-purple-600 mr-2 mt-1">✓</span>
                            <span>Be transparent about how funds will be used</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-purple-600 mr-2 mt-1">✓</span>
                            <span>Provide regular updates to your donors</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-purple-600 mr-2 mt-1">✓</span>
                            <span>Fulfill the promises made in your campaign description</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-purple-600 mr-2 mt-1">✓</span>
                            <span>Respond promptly to questions from donors and JamiiFund</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-purple-600 mr-2 mt-1">✓</span>
                            <span>Use funds only for the stated purpose</span>
                          </li>
                        </ul>
                      </div>
                    </>
                  }
                />
              </div>
              
              {/* Prohibited Campaigns */}
              <div id="prohibited">
                <LegalSection 
                  icon={<FaBan />}
                  title="3. Prohibited Campaigns"
                  content={
                    <>
                      <p className="mb-4">
                        The following types of campaigns are not allowed on JamiiFund:
                      </p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Campaigns that violate Tanzanian or international laws</li>
                        <li>Campaigns promoting hate speech, discrimination, or violence</li>
                        <li>Campaigns for illegal activities or products</li>
                        <li>Campaigns that involve harassment or privacy violations</li>
                        <li>Campaigns that are fraudulent or misleading</li>
                        <li>Campaigns for political candidates or lobbying</li>
                      </ul>
                    </>
                  }
                />
              </div>
              
              {/* Continue with other sections... */}
              
              {/* Contact Information */}
              <div>
                <LegalSection 
                  icon={<FaPhoneAlt />}
                  title="8. Contact Information"
                  content={
                    <>
                      <p className="mb-4">
                        If you have any questions about these Community Guidelines, please contact us at:
                      </p>
                      <div className="bg-purple-50 p-6 rounded-lg text-gray-600">
                        <p className="mb-1">Sabri Salumu</p>
                        <p className="mb-1">MUHAS</p>
                        <p className="mb-1">Dar es Salaam, Tanzania</p>
                        <p className="mb-1">Email: fundjamii@gmail.com</p>
                        <p>Phone: +255 698959522</p>
                      </div>
                    </>
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

// Legal Section Component
function LegalSection({ icon, title, content }) {
  return (
    <motion.div 
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center">
        <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xl mr-4">
          {icon}
        </div>
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      </div>
      <div className="pl-16 text-gray-600">
        {content}
      </div>
    </motion.div>
  );
}

// Phone icon component
function FaPhoneAlt() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" className="w-5 h-5">
      <path d="M497.39 361.8l-112-48a24 24 0 0 0-28 6.9l-49.6 60.6A370.66 370.66 0 0 1 130.6 204.11l60.6-49.6a23.94 23.94 0 0 0 6.9-28l-48-112A24.16 24.16 0 0 0 122.6.61l-104 24A24 24 0 0 0 0 48c0 256.5 207.9 464 464 464a24 24 0 0 0 23.4-18.6l24-104a24.29 24.29 0 0 0-14.01-27.6z"/>
    </svg>
  );
}