"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FaGavel, FaShieldAlt, FaFileContract, FaUserShield, FaMoneyBillWave, FaBan, FaExclamationTriangle, FaBalanceScale, FaSyncAlt, FaPhoneAlt } from 'react-icons/fa';

export default function TermsOfService() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState("introduction");
  
  useEffect(() => {
    setIsVisible(true);
    // Scroll to top when page loads
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    { id: "introduction", name: "Introduction" },
    { id: "definitions", name: "Definitions" },
    { id: "account", name: "Account" },
    { id: "campaigns", name: "Campaigns" },
    { id: "fees", name: "Fees" },
    { id: "prohibited", name: "Prohibited Activities" },
    { id: "termination", name: "Termination" },
    { id: "liability", name: "Liability" },
    { id: "governing", name: "Governing Law" },
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
                <FaGavel className="h-12 w-12 text-purple-600 mr-4" />
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
                  Terms of <span className="text-purple-600">Service</span>
                </h1>
              </motion.div>
              
              <motion.p 
                className="text-lg text-gray-600 mb-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Our commitment to creating a transparent and secure fundraising platform
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
                  icon={<FaFileContract />}
                  title="1. Introduction"
                  content={
                    <p>
                      Welcome to JamiiFund. These Terms of Service govern your use of our website and services. 
                      By accessing or using JamiiFund, you agree to be bound by these Terms. If you disagree 
                      with any part of these terms, you may not access our service.
                    </p>
                  }
                />
              </div>
              
              {/* Definitions */}
              <div id="definitions">
                <LegalSection 
                  icon={<FaShieldAlt />}
                  title="2. Definitions"
                  content={
                    <>
                      <p className="mb-4">
                        Throughout these Terms, we use specific terminology to refer to different aspects of our service:
                      </p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Service</strong>: The JamiiFund website and platform operated by Sabri Salumu.</li>
                        <li><strong>User</strong>: Any individual who accesses or uses the Service.</li>
                        <li><strong>Campaign</strong>: A fundraising project created on JamiiFund.</li>
                        <li><strong>Campaign Creator</strong>: A User who creates and manages a fundraising Campaign.</li>
                        <li><strong>Donor</strong>: A User who contributes funds to a Campaign.</li>
                      </ul>
                    </>
                  }
                />
              </div>
              
              {/* Account */}
              <div id="account">
                <LegalSection 
                  icon={<FaUserShield />}
                  title="3. Account Registration"
                  content={
                    <>
                      <p className="mb-4">
                        To use certain features of the Service, you must register for an account. When registering, you agree to:
                      </p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Provide accurate, current, and complete information</li>
                        <li>Maintain and update your information to keep it accurate</li>
                        <li>Keep your account credentials secure and confidential</li>
                        <li>Take responsibility for all activities that occur under your account</li>
                        <li>Notify us immediately of any unauthorized use of your account</li>
                      </ul>
                      <p className="mt-4">
                        Users must be at least 18 years old to create an account. By creating an account,
                        you confirm that you meet this age requirement.
                      </p>
                    </>
                  }
                />
              </div>
              
              {/* Campaigns */}
              <div id="campaigns">
                <LegalSection 
                  icon={<FaHandHoldingHeart />}
                  title="4. Campaigns and Donations"
                  content={
                    <>
                      <p className="mb-4">
                        Campaign Creators are responsible for fulfilling the promises made in their Campaign. 
                        JamiiFund does not guarantee that Campaigns will achieve their goals or that Campaign 
                        funds will be used as described. Donors make contributions at their own risk.
                      </p>
                      <p className="mb-4">
                        By creating a Campaign, Campaign Creators agree to:
                      </p>
                      <ul className="list-disc pl-6 space-y-2 mb-4">
                        <li>Provide accurate information about their Campaign and its purpose</li>
                        <li>Use funds only for the stated purpose of the Campaign</li>
                        <li>Provide regular updates to Donors on the progress of the Campaign</li>
                        <li>Comply with all applicable laws and regulations</li>
                      </ul>
                      <p>
                        By making a donation, Donors acknowledge that JamiiFund is not responsible for 
                        the fulfillment of Campaign promises or the use of funds by Campaign Creators.
                      </p>
                    </>
                  }
                />
              </div>
              
              {/* Fees */}
              <div id="fees">
                <LegalSection 
                  icon={<FaMoneyBillWave />}
                  title="5. Fees and Payments"
                  content={
                    <>
                      <p className="mb-4">
                        JamiiFund charges a platform fee on funds raised through the Service. Additional payment 
                        processing fees may apply. These fees will be clearly displayed before any transaction is completed.
                      </p>
                      <div className="bg-purple-50 p-6 rounded-lg mb-4">
                        <h4 className="font-semibold text-gray-800 mb-2">Current Fee Structure:</h4>
                        <ul className="space-y-2">
                          <li>• JamiiFund platform fee: 5% of each donation</li>
                          <li>• Payment processing: 2.9% + $0.30 per transaction</li>
                        </ul>
                      </div>
                      <p>
                        All fees are subject to change. Any changes to our fee structure will be communicated 
                        in advance through our website and via email to registered users.
                      </p>
                    </>
                  }
                />
              </div>
              
              {/* Prohibited Activities */}
              <div id="prohibited">
                <LegalSection 
                  icon={<FaBan />}
                  title="6. Prohibited Activities"
                  content={
                    <>
                      <p className="mb-4">
                        Users shall not engage in any activity that:
                      </p>
                      <ul className="list-disc pl-6 space-y-2 mb-4">
                        <li>Violates any law or regulation of Tanzania or international law</li>
                        <li>Creates fraudulent or misleading Campaigns</li>
                        <li>Infringes on the intellectual property rights of others</li>
                        <li>Harasses, abuses, or harms another person</li>
                        <li>Involves the transmission of "junk mail" or "spam"</li>
                      </ul>
                      <p>
                        Violation of these prohibitions may result in the termination of your account and legal action.
                      </p>
                    </>
                  }
                />
              </div>
              
              {/* Termination */}
              <div id="termination">
                <LegalSection 
                  icon={<FaExclamationTriangle />}
                  title="7. Termination"
                  content={
                    <>
                      <p className="mb-4">
                        We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including if you breach these Terms.
                      </p>
                      <p>
                        Upon termination, your right to use the Service will immediately cease. You may cancel your account at any time by contacting us.
                      </p>
                    </>
                  }
                />
              </div>
              
              {/* Liability */}
              <div id="liability">
                <LegalSection 
                  icon={<FaBalanceScale />}
                  title="8. Limitation of Liability"
                  content={
                    <>
                      <p className="mb-4">
                        To the maximum extent permitted by law, JamiiFund shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the Service.
                      </p>
                      <p>
                        In no event shall JamiiFund's total liability to you for all damages, losses, and causes of action exceed the amount paid by you, if any, for accessing the Service.
                      </p>
                    </>
                  }
                />
              </div>
              
              {/* Governing Law */}
              <div id="governing">
                <LegalSection 
                  icon={<FaSyncAlt />}
                  title="9. Governing Law"
                  content={
                    <>
                      <p className="mb-4">
                        These Terms shall be governed by the laws of Tanzania, without regard to its conflict of law provisions.
                      </p>
                      <p>
                        Any disputes arising out of or related to these Terms or the Service shall be subject to the exclusive jurisdiction of the courts located in Dar es Salaam, Tanzania.
                      </p>
                    </>
                  }
                />
              </div>
              
              {/* Changes */}
              <div id="changes">
                <LegalSection 
                  icon={<FaSyncAlt />}
                  title="10. Changes to Terms"
                  content={
                    <>
                      <p className="mb-4">
                        We reserve the right to modify these Terms at any time. We will provide notice of significant changes by posting the new Terms on the Service and updating the "Last Updated" date.
                      </p>
                      <p>
                        Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.
                      </p>
                    </>
                  }
                />
              </div>
              
              {/* Contact Information */}
              <div>
                <LegalSection 
                  icon={<FaPhoneAlt />}
                  title="11. Contact Information"
                  content={
                    <>
                      <p className="mb-4">
                        If you have any questions about these Terms, please contact us at:
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

// Additional component
function FaHandHoldingHeart() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="currentColor" className="w-6 h-6">
      <path d="M275.3 250.5c7 7.4 18.4 7.4 25.5 0l108.9-114.2c31.6-33.2 29.8-88.2-5.6-118.8-30.8-26.7-76.7-21.9-104.9 7.7L288 36.9l-11.1-11.6C248.7-4.4 202.8-9.2 172 17.5c-35.3 30.6-37.2 85.6-5.6 118.8l108.9 114.2zm290 77.6c-11.8-10.7-30.2-10-42.6 0L430.3 402c-11.3 9.1-25.4 14-40 14H272c-8.8 0-16-7.2-16-16s7.2-16 16-16h78.3c15.9 0 30.7-10.9 33.3-26.6 3.3-20-12.1-37.4-31.6-37.4H192c-27 0-53.1 9.3-74.1 26.3L71.4 384H16c-8.8 0-16 7.2-16 16v96c0 8.8 7.2 16 16 16h356.8c14.5 0 28.6-4.9 40-14L564 377c15.2-12.1 16.4-35.3 1.3-48.9z"/>
    </svg>
  );
}