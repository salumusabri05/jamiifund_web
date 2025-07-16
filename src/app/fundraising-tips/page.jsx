"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FaLightbulb, FaUsers, FaCamera, FaChartLine, FaHandHoldingHeart, FaShareAlt, FaEnvelope, FaList } from 'react-icons/fa';

export default function FundraisingTipsPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("before");
  
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
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
                Fundraising <span className="text-purple-600">Tips</span>
              </motion.h1>
              
              <motion.p 
                className="text-lg text-gray-600 mb-10"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Expert advice to help you plan, launch, and manage a successful campaign
              </motion.p>
            </div>
          </div>
        </motion.div>
        
        {/* Campaign Journey Tabs */}
        <div className="container mx-auto px-4 mb-12">
          <div className="bg-white rounded-xl shadow-md p-2 flex justify-center max-w-xl mx-auto">
            <button
              className={`flex-1 py-3 px-4 rounded-lg transition-colors ${
                activeTab === "before" ? "bg-purple-600 text-white" : "text-gray-600 hover:bg-purple-50"
              }`}
              onClick={() => setActiveTab("before")}
            >
              Before Launch
            </button>
            <button
              className={`flex-1 py-3 px-4 rounded-lg transition-colors ${
                activeTab === "during" ? "bg-purple-600 text-white" : "text-gray-600 hover:bg-purple-50"
              }`}
              onClick={() => setActiveTab("during")}
            >
              During Campaign
            </button>
            <button
              className={`flex-1 py-3 px-4 rounded-lg transition-colors ${
                activeTab === "after" ? "bg-purple-600 text-white" : "text-gray-600 hover:bg-purple-50"
              }`}
              onClick={() => setActiveTab("after")}
            >
              After Funding
            </button>
          </div>
        </div>
        
        {/* Before Launch Content */}
        {activeTab === "before" && (
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-gray-800">Planning Your Campaign</h2>
              
              <div className="space-y-8">
                <TipCard 
                  icon={<FaLightbulb />}
                  title="Define Your Project Clearly"
                  description="Be specific about what you're raising funds for, why it matters, and how the funds will be used. Clarity builds trust and helps donors understand the impact of their contribution."
                />
                
                <TipCard 
                  icon={<FaUsers />}
                  title="Identify Your Audience"
                  description="Understanding who might be interested in supporting your cause will help you craft messaging that resonates with them and choose the right channels to reach them."
                />
                
                <TipCard 
                  icon={<FaCamera />}
                  title="Prepare Compelling Visuals"
                  description="High-quality photos and videos that showcase your project, team, and community are essential. Visual content helps donors connect emotionally with your cause."
                />
                
                <TipCard 
                  icon={<FaChartLine />}
                  title="Set a Realistic Funding Goal"
                  description="Research costs thoroughly and be transparent about your budget. Setting an achievable goal increases your chances of success and builds credibility."
                />
                
                <TipCard 
                  icon={<FaList />}
                  title="Create a Timeline"
                  description="Develop a detailed plan for before, during, and after your campaign. Include key milestones, content schedule, and follow-up activities."
                />
              </div>
              
              <div className="mt-12 bg-purple-50 rounded-xl p-8">
                <h3 className="text-2xl font-bold mb-4 text-gray-800">Campaign Planning Checklist</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2 mt-1">✓</span>
                    <span>Clear, compelling project description with specific goals</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2 mt-1">✓</span>
                    <span>Budget breakdown showing how funds will be used</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2 mt-1">✓</span>
                    <span>High-quality photos and videos of your project/community</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2 mt-1">✓</span>
                    <span>Compelling personal or community story that connects emotionally</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2 mt-1">✓</span>
                    <span>List of potential supporters to contact when you launch</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2 mt-1">✓</span>
                    <span>Timeline for campaign activities and communication</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2 mt-1">✓</span>
                    <span>Plan for campaign updates and donor recognition</span>
                  </li>
                </ul>
              </div>
              
              <div className="mt-12 grid md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h3 className="text-xl font-bold mb-4 text-gray-800">Resource Download</h3>
                  <p className="text-gray-600 mb-4">
                    Get our comprehensive Campaign Planning Worksheet to help you organize your fundraising strategy.
                  </p>
                  <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                    Download Worksheet
                  </button>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h3 className="text-xl font-bold mb-4 text-gray-800">Expert Consultation</h3>
                  <p className="text-gray-600 mb-4">
                    Schedule a 30-minute session with one of our campaign advisors for personalized guidance.
                  </p>
                  <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                    Book Consultation
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* During Campaign Content */}
        {activeTab === "during" && (
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-gray-800">Managing Your Active Campaign</h2>
              
              <div className="space-y-8">
                <TipCard 
                  icon={<FaShareAlt />}
                  title="Leverage Your Network"
                  description="Start by reaching out to your close contacts and immediate community. Their early support builds momentum and credibility for your campaign."
                />
                
                <TipCard 
                  icon={<FaEnvelope />}
                  title="Regular Updates"
                  description="Keep donors and potential supporters engaged with consistent updates about your progress, milestones, and impact stories."
                />
                
                <TipCard 
                  icon={<FaHandHoldingHeart />}
                  title="Personal Outreach"
                  description="Direct, personalized messages are more effective than general announcements. Take time to connect individually with potential major donors."
                />
                
                <TipCard 
                  icon={<FaChartLine />}
                  title="Monitor Analytics"
                  description="Use campaign analytics to understand which messages and channels are most effective, then adjust your strategy accordingly."
                />
                
                <TipCard 
                  icon={<FaUsers />}
                  title="Engage with Comments"
                  description="Respond promptly to questions and comments on your campaign page and social media. Engagement builds community and trust."
                />
              </div>
              
              <div className="mt-12 bg-indigo-50 rounded-xl p-8">
                <h3 className="text-2xl font-bold mb-4 text-gray-800">Overcoming Campaign Plateaus</h3>
                <p className="text-gray-600 mb-6">
                  Most campaigns experience a slowdown in the middle. Here are strategies to maintain momentum:
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="text-indigo-600 mr-2 mt-1 font-bold">1.</span>
                    <div>
                      <span className="font-semibold">Release new content</span>
                      <p className="text-gray-600 mt-1">Share a new video, testimonial, or impact story to renew interest.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-600 mr-2 mt-1 font-bold">2.</span>
                    <div>
                      <span className="font-semibold">Create a matching challenge</span>
                      <p className="text-gray-600 mt-1">Find a donor willing to match contributions for a limited time to create urgency.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-600 mr-2 mt-1 font-bold">3.</span>
                    <div>
                      <span className="font-semibold">Reach out to new networks</span>
                      <p className="text-gray-600 mt-1">Expand beyond your initial audience to find new supporters.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-indigo-600 mr-2 mt-1 font-bold">4.</span>
                    <div>
                      <span className="font-semibold">Host a virtual event</span>
                      <p className="text-gray-600 mt-1">Organize a webinar or live Q&A to engage directly with potential donors.</p>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="mt-12 border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 p-6">
                  <h3 className="text-xl font-bold text-gray-800">Sample Campaign Communication Timeline</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    <div className="flex">
                      <div className="w-24 font-semibold">Day 1</div>
                      <div>Launch announcement to close contacts and social media</div>
                    </div>
                    <div className="flex">
                      <div className="w-24 font-semibold">Day 3</div>
                      <div>First progress update and thank you to early supporters</div>
                    </div>
                    <div className="flex">
                      <div className="w-24 font-semibold">Day 7</div>
                      <div>Share an impact story or testimonial</div>
                    </div>
                    <div className="flex">
                      <div className="w-24 font-semibold">Day 10</div>
                      <div>Milestone celebration (e.g., "We're 25% funded!")</div>
                    </div>
                    <div className="flex">
                      <div className="w-24 font-semibold">Day 14</div>
                      <div>Behind-the-scenes content about your project or team</div>
                    </div>
                    <div className="flex">
                      <div className="w-24 font-semibold">Day 21</div>
                      <div>Announce matching gift challenge for final push</div>
                    </div>
                    <div className="flex">
                      <div className="w-24 font-semibold">Day 28</div>
                      <div>Final call to action before campaign closes</div>
                    </div>
                    <div className="flex">
                      <div className="w-24 font-semibold">Day 30</div>
                      <div>Thank you message and next steps</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* After Funding Content */}
        {activeTab === "after" && (
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-gray-800">After Your Campaign Succeeds</h2>
              
              <div className="space-y-8">
                <TipCard 
                  icon={<FaHandHoldingHeart />}
                  title="Express Gratitude"
                  description="Thank your donors individually and publicly. Personalized appreciation strengthens relationships and encourages future support."
                />
                
                <TipCard 
                  icon={<FaChartLine />}
                  title="Transparent Implementation"
                  description="Provide regular updates on how funds are being used and the progress of your project. Transparency builds trust for future initiatives."
                />
                
                <TipCard 
                  icon={<FaCamera />}
                  title="Document Impact"
                  description="Capture photos, videos, and testimonials that demonstrate the real-world impact of your campaign. This content is valuable for future fundraising."
                />
                
                <TipCard 
                  icon={<FaEnvelope />}
                  title="Keep Donors Engaged"
                  description="Continue communicating with supporters beyond the campaign. Building a community of engaged supporters is valuable for long-term sustainability."
                />
                
                <TipCard 
                  icon={<FaUsers />}
                  title="Gather Feedback"
                  description="Ask donors and team members for feedback on the campaign process. Their insights can help improve future fundraising efforts."
                />
              </div>
              
              <div className="mt-12 bg-green-50 rounded-xl p-8">
                <h3 className="text-2xl font-bold mb-4 text-gray-800">Impact Reporting Guide</h3>
                <p className="text-gray-600 mb-6">
                  Effective impact reporting keeps donors engaged and builds your reputation for accountability. 
                  Include these elements in your updates:
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white p-5 rounded-lg shadow-sm">
                    <h4 className="font-bold text-gray-800 mb-2">Quantitative Metrics</h4>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Number of people served/impacted</li>
                      <li>• Specific outcomes achieved (e.g., graduation rates)</li>
                      <li>• Timeline of project milestones completed</li>
                      <li>• Financial breakdown of fund utilization</li>
                    </ul>
                  </div>
                  <div className="bg-white p-5 rounded-lg shadow-sm">
                    <h4 className="font-bold text-gray-800 mb-2">Qualitative Elements</h4>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Personal stories from beneficiaries</li>
                      <li>• Photos showing before/after changes</li>
                      <li>• Videos of your project in action</li>
                      <li>• Testimonials from community members</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="mt-12">
                <h3 className="text-2xl font-bold mb-6 text-gray-800">Sample Donor Communication Schedule</h3>
                <div className="overflow-hidden border border-gray-200 rounded-xl">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="py-3 px-4 text-left font-semibold text-gray-800">Timeframe</th>
                        <th className="py-3 px-4 text-left font-semibold text-gray-800">Communication</th>
                        <th className="py-3 px-4 text-left font-semibold text-gray-800">Content Focus</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="py-3 px-4">Immediately</td>
                        <td className="py-3 px-4">Thank you email/letter</td>
                        <td className="py-3 px-4">Appreciation and confirmation of receipt</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4">1 Week</td>
                        <td className="py-3 px-4">Campaign wrap-up</td>
                        <td className="py-3 px-4">Final total, next steps, timeline</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4">1 Month</td>
                        <td className="py-3 px-4">Project kickoff update</td>
                        <td className="py-3 px-4">Initial activities, preparations, photos</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4">Quarterly</td>
                        <td className="py-3 px-4">Progress reports</td>
                        <td className="py-3 px-4">Milestones, challenges, successes</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4">Project completion</td>
                        <td className="py-3 px-4">Final impact report</td>
                        <td className="py-3 px-4">Outcomes, testimonials, financial summary</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4">1 Year anniversary</td>
                        <td className="py-3 px-4">Long-term impact update</td>
                        <td className="py-3 px-4">Sustained benefits, community feedback</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Expert Advice Section */}
        <div className="bg-purple-700 py-16 mt-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-white text-center">Expert Advice</h2>
              
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="grid md:grid-cols-3">
                  <div className="relative h-64 md:h-auto">
                    <Image 
                      src="/images/expert-advisor.jpg" 
                      alt="Fundraising Expert"
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div className="md:col-span-2 p-8">
                    <div className="text-sm font-semibold text-purple-600 mb-1">FUNDRAISING SPECIALIST</div>
                    <h3 className="text-2xl font-bold mb-4 text-gray-800">Rdhia Omari</h3>
                    <div className="text-gray-600 mb-6">
                      <p className="mb-4">
                        "The most successful campaigns combine clear, specific goals with an emotional connection 
                        to the cause. Donors need to understand both what their money will do and why it matters."
                      </p>
                      <p>
                        "Remember that fundraising is about relationship building, not just transactions. 
                        Focus on creating genuine connections with your supporters and treating them as partners 
                        in your mission, not just sources of funding."
                      </p>
                    </div>
                    <Link
                      href="/blog/fundraising-psychology"
                      className="text-purple-600 font-semibold hover:text-purple-800 inline-flex items-center"
                    >
                      Read Rdhia's full article on fundraising psychology
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Additional Resources */}
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">Additional Resources</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48 bg-purple-100 flex items-center justify-center">
                <FaList className="text-6xl text-purple-300" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-800">Campaign Templates</h3>
                <p className="text-gray-600 mb-4">
                  Downloadable templates for campaign planning, budgeting, and donor communications.
                </p>
                <Link 
                  href="/resources/templates"
                  className="text-purple-600 font-semibold hover:text-purple-800 inline-flex items-center"
                >
                  Download Templates
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48 bg-purple-100 flex items-center justify-center">
                <FaCamera className="text-6xl text-purple-300" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-800">Visual Storytelling Guide</h3>
                <p className="text-gray-600 mb-4">
                  Learn how to create compelling photos and videos for your campaign with minimal equipment.
                </p>
                <Link 
                  href="/resources/visual-storytelling"
                  className="text-purple-600 font-semibold hover:text-purple-800 inline-flex items-center"
                >
                  Read the Guide
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48 bg-purple-100 flex items-center justify-center">
                <FaUsers className="text-6xl text-purple-300" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-800">Community Webinars</h3>
                <p className="text-gray-600 mb-4">
                  Join our monthly live webinars featuring successful campaign creators and fundraising experts.
                </p>
                <Link 
                  href="/resources/webinars"
                  className="text-purple-600 font-semibold hover:text-purple-800 inline-flex items-center"
                >
                  View Schedule
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
        
      </main>
      <Footer />
    </>
  );
}

// Tip Card Component
function TipCard({ icon, title, description }) {
  return (
    <div className="flex gap-5">
      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xl">
        {icon}
      </div>
      <div>
        <h3 className="text-xl font-bold mb-2 text-gray-800">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}