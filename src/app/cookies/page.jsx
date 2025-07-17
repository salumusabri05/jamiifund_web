//UND\jamiifund\src\app\cookies\page.jsx
"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FaCookieBite, FaInfoCircle, FaClipboardList, FaSliders, FaShieldAlt, FaSyncAlt } from 'react-icons/fa';

export default function CookiePolicy() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState("what");
  
  useEffect(() => {
    setIsVisible(true);
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    { id: "what", name: "What Are Cookies" },
    { id: "how", name: "How We Use Cookies" },
    { id: "types", name: "Types of Cookies" },
    { id: "control", name: "Cookie Control" },
    { id: "specific", name: "Specific Cookies" },
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
                <FaCookieBite className="h-12 w-12 text-purple-600 mr-4" />
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
                  Cookie <span className="text-purple-600">Policy</span>
                </h1>
              </motion.div>
              
              <motion.p 
                className="text-lg text-gray-600 mb-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Understanding how we use cookies to improve your experience
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
              {/* What Are Cookies */}
              <div id="what">
                <LegalSection 
                  icon={<FaInfoCircle />}
                  title="1. What Are Cookies"
                  content={
                    <>
                      <p className="mb-4">
                        Cookies are small text files that are placed on your device when you visit a website. 
                        They are widely used to make websites work more efficiently and provide information to 
                        the website owners.
                      </p>
                      <motion.div 
                        className="bg-purple-50 p-6 rounded-lg mt-4"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <h4 className="font-semibold text-gray-800 mb-2">Did You Know?</h4>
                        <p className="text-gray-600">
                          The term "cookie" comes from "magic cookie," which is a packet of data a program receives 
                          and sends back unchanged. Web cookies were invented in 1994 by Lou Montulli, a web browser 
                          programmer.
                        </p>
                      </motion.div>
                    </>
                  }
                />
              </div>
              
              {/* How We Use Cookies */}
              <div id="how">
                <LegalSection 
                  icon={<FaClipboardList />}
                  title="2. How We Use Cookies"
                  content={
                    <>
                      <p className="mb-4">
                        JamiiFund uses cookies for the following purposes:
                      </p>
                      <div className="grid md:grid-cols-2 gap-6">
                        <motion.div 
                          className="bg-purple-50 p-5 rounded-lg"
                          whileHover={{ y: -5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <h4 className="font-bold text-gray-800 mb-2">Essential Cookies</h4>
                          <p className="text-gray-600">
                            Required for the basic functionality of the website, such as session 
                            management and security.
                          </p>
                        </motion.div>
                        <motion.div 
                          className="bg-purple-50 p-5 rounded-lg"
                          whileHover={{ y: -5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <h4 className="font-bold text-gray-800 mb-2">Preference Cookies</h4>
                          <p className="text-gray-600">
                            Remember your settings and preferences to enhance your experience.
                          </p>
                        </motion.div>
                        <motion.div 
                          className="bg-purple-50 p-5 rounded-lg"
                          whileHover={{ y: -5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <h4 className="font-bold text-gray-800 mb-2">Analytics Cookies</h4>
                          <p className="text-gray-600">
                            Help us understand how visitors interact with our website, allowing 
                            us to improve our service.
                          </p>
                        </motion.div>
                        <motion.div 
                          className="bg-purple-50 p-5 rounded-lg"
                          whileHover={{ y: -5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <h4 className="font-bold text-gray-800 mb-2">Marketing Cookies</h4>
                          <p className="text-gray-600">
                            Used to track visitors across websites to display relevant advertisements.
                          </p>
                        </motion.div>
                      </div>
                    </>
                  }
                />
              </div>
              
              {/* Specific Cookies Used */}
              <div id="specific">
                <LegalSection 
                  icon={<FaList />}
                  title="5. Specific Cookies Used"
                  content={
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                        <thead>
                          <tr className="bg-purple-50">
                            <th className="px-4 py-2 text-left text-gray-800">Cookie Name</th>
                            <th className="px-4 py-2 text-left text-gray-800">Purpose</th>
                            <th className="px-4 py-2 text-left text-gray-800">Duration</th>
                            <th className="px-4 py-2 text-left text-gray-800">Type</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          <tr>
                            <td className="px-4 py-2 text-gray-600">_session</td>
                            <td className="px-4 py-2 text-gray-600">Maintains session state</td>
                            <td className="px-4 py-2 text-gray-600">Session</td>
                            <td className="px-4 py-2 text-gray-600">Essential</td>
                          </tr>
                          <tr className="bg-purple-50/30">
                            <td className="px-4 py-2 text-gray-600">_jamii_pref</td>
                            <td className="px-4 py-2 text-gray-600">Stores user preferences</td>
                            <td className="px-4 py-2 text-gray-600">1 year</td>
                            <td className="px-4 py-2 text-gray-600">Preference</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 text-gray-600">_ga</td>
                            <td className="px-4 py-2 text-gray-600">Google Analytics tracking</td>
                            <td className="px-4 py-2 text-gray-600">2 years</td>
                            <td className="px-4 py-2 text-gray-600">Analytics</td>
                          </tr>
                          <tr className="bg-purple-50/30">
                            <td className="px-4 py-2 text-gray-600">_fbp</td>
                            <td className="px-4 py-2 text-gray-600">Facebook pixel tracking</td>
                            <td className="px-4 py-2 text-gray-600">3 months</td>
                            <td className="px-4 py-2 text-gray-600">Marketing</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  }
                />
              </div>
              
              {/* Continue with other sections... */}
              
              {/* Contact Information */}
              <div>
                <LegalSection 
                  icon={<FaPhoneAlt />}
                  title="7. Contact Information"
                  content={
                    <>
                      <p className="mb-4">
                        If you have any questions about our Cookie Policy, please contact us at:
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

// Additional icon components
function FaList() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" className="w-6 h-6">
      <path d="M80 368H16a16 16 0 0 0-16 16v64a16 16 0 0 0 16 16h64a16 16 0 0 0 16-16v-64a16 16 0 0 0-16-16zm0-320H16A16 16 0 0 0 0 64v64a16 16 0 0 0 16 16h64a16 16 0 0 0 16-16V64a16 16 0 0 0-16-16zm0 160H16a16 16 0 0 0-16 16v64a16 16 0 0 0 16 16h64a16 16 0 0 0 16-16v-64a16 16 0 0 0-16-16zm416 176H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zm0-320H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16V64a16 16 0 0 0-16-16zm0 160H176a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h320a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16z"/>
    </svg>
  );
}

function FaPhoneAlt() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" className="w-5 h-5">
      <path d="M497.39 361.8l-112-48a24 24 0 0 0-28 6.9l-49.6 60.6A370.66 370.66 0 0 1 130.6 204.11l60.6-49.6a23.94 23.94 0 0 0 6.9-28l-48-112A24.16 24.16 0 0 0 122.6.61l-104 24A24 24 0 0 0 0 48c0 256.5 207.9 464 464 464a24 24 0 0 0 23.4-18.6l24-104a24.29 24.29 0 0 0-14.01-27.6z"/>
    </svg>
  );
}