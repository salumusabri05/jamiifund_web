
"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FaLock, FaUserSecret, FaDatabase, FaUserShield, FaShare, FaChild, FaSyncAlt, FaInfoCircle } from 'react-icons/fa';

export default function PrivacyPolicy() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState("introduction");
  
  useEffect(() => {
    setIsVisible(true);
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    { id: "introduction", name: "Introduction" },
    { id: "information", name: "Information We Collect" },
    { id: "use", name: "How We Use Information" },
    { id: "storage", name: "Data Storage" },
    { id: "sharing", name: "Data Sharing" },
    { id: "rights", name: "Your Rights" },
    { id: "cookies", name: "Cookies" },
    { id: "children", name: "Children's Privacy" },
    { id: "changes", name: "Changes" },
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
                <FaLock className="h-12 w-12 text-purple-600 mr-4" />
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
                  Privacy <span className="text-purple-600">Policy</span>
                </h1>
              </motion.div>
              
              <motion.p 
                className="text-lg text-gray-600 mb-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                How we collect, use, and protect your personal information
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
              {/* Introduction */}
              <div id="introduction">
                <LegalSection 
                  icon={<FaUserSecret />}
                  title="1. Introduction"
                  content={
                    <p>
                      At JamiiFund, we respect your privacy and are committed to protecting your personal data. 
                      This Privacy Policy explains how we collect, use, and safeguard your information when you 
                      use our platform. We are dedicated to being transparent about our data practices and ensuring 
                      you understand your rights regarding your personal information.
                    </p>
                  }
                />
              </div>
              
              {/* Information We Collect */}
              <div id="information">
                <LegalSection 
                  icon={<FaDatabase />}
                  title="2. Information We Collect"
                  content={
                    <>
                      <p className="mb-4">
                        We collect the following types of information:
                      </p>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-purple-50 p-5 rounded-lg">
                          <h4 className="font-bold text-gray-800 mb-2">Personal Information</h4>
                          <ul className="space-y-2">
                            <li className="flex items-start">
                              <span className="text-purple-600 mr-2">•</span>
                              <span>Name and email address</span>
                            </li>
                            <li className="flex items-start">
                              <span className="text-purple-600 mr-2">•</span>
                              <span>Phone number (optional)</span>
                            </li>
                            <li className="flex items-start">
                              <span className="text-purple-600 mr-2">•</span>
                              <span>Payment information</span>
                            </li>
                            <li className="flex items-start">
                              <span className="text-purple-600 mr-2">•</span>
                              <span>Profile information</span>
                            </li>
                          </ul>
                        </div>
                        <div className="bg-purple-50 p-5 rounded-lg">
                          <h4 className="font-bold text-gray-800 mb-2">Technical Data</h4>
                          <ul className="space-y-2">
                            <li className="flex items-start">
                              <span className="text-purple-600 mr-2">•</span>
                              <span>IP address</span>
                            </li>
                            <li className="flex items-start">
                              <span className="text-purple-600 mr-2">•</span>
                              <span>Browser type and version</span>
                            </li>
                            <li className="flex items-start">
                              <span className="text-purple-600 mr-2">•</span>
                              <span>Device information</span>
                            </li>
                            <li className="flex items-start">
                              <span className="text-purple-600 mr-2">•</span>
                              <span>Usage data and timestamps</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </>
                  }
                />
              </div>
              
              {/* How We Use Information */}
              <div id="use">
                <LegalSection 
                  icon={<FaChartLine />}
                  title="3. How We Use Your Information"
                  content={
                    <>
                      <p className="mb-4">
                        We use your information for the following purposes:
                      </p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>To provide and maintain our service</li>
                        <li>To process transactions and send related information</li>
                        <li>To improve and personalize your experience</li>
                        <li>To communicate with you about campaigns, donations, and updates</li>
                        <li>To comply with legal obligations</li>
                        <li>To detect, prevent, and address technical issues or fraud</li>
                      </ul>
                    </>
                  }
                />
              </div>
              
              {/* Continue with other sections... */}
              
              {/* Contact Information */}
              <div>
                <LegalSection 
                  icon={<FaInfoCircle />}
                  title="10. Contact Information"
                  content={
                    <>
                      <p className="mb-4">
                        If you have any questions about this Privacy Policy, please contact us at:
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

// Additional component for chart line icon
function FaChartLine() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" className="w-6 h-6">
      <path d="M496 384H64V80c0-8.84-7.16-16-16-16H16C7.16 64 0 71.16 0 80v336c0 17.67 14.33 32 32 32h464c8.84 0 16-7.16 16-16v-32c0-8.84-7.16-16-16-16zM464 96H345.94c-21.38 0-32.09 25.85-16.97 40.97l32.4 32.4L288 242.75l-73.37-73.37c-12.5-12.5-32.76-12.5-45.25 0l-68.69 68.69c-6.25 6.25-6.25 16.38 0 22.63l22.62 22.62c6.25 6.25 16.38 6.25 22.63 0L192 237.25l73.37 73.37c12.5 12.5 32.76 12.5 45.25 0l96-96 32.4 32.4c15.12 15.12 40.97 4.41 40.97-16.97V112c.01-8.84-7.15-16-15.99-16z"/>
    </svg>
  );
}