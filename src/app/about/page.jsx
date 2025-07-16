"use client";
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FaHandHoldingHeart, FaUsers, FaGlobe, FaLeaf, FaChartLine, FaLightbulb } from 'react-icons/fa';

export default function AboutPage() {
  const [isVisible, setIsVisible] = useState(false);
  
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
                About <span className="text-purple-600">JamiiFund</span>
              </motion.h1>
              
              <motion.p 
                className="text-lg text-gray-600 mb-10"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Building bridges between compassionate donors and impactful community projects.
              </motion.p>
            </div>
          </div>
        </motion.div>
        
        {/* Our Story Section */}
        <AnimatedSection>
          <div className="container mx-auto px-4 py-12">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-6 text-gray-800">Our Story</h2>
                  <p className="text-gray-600 mb-4">
                    JamiiFund was born out of a simple but powerful idea: community-driven change can transform lives. 
                    Founded in 2022 by a group of tech enthusiasts and social impact advocates, we recognized the need 
                    for a transparent, efficient platform that connects community projects with donors who care.
                  </p>
                  <p className="text-gray-600">
                    The name "Jamii" comes from the Swahili word for "community," reflecting our commitment to 
                    fostering community connection and collective action. Today, we're proud to have facilitated 
                    hundreds of successful campaigns that have made tangible differences in communities worldwide.
                  </p>
                </div>
                <div className="relative h-64 md:h-80">
                  <Image 
                    src="/images/jamiifund1.png" 
                    alt="JamiiFund Story"
                    fill
                    style={{ objectFit: 'contain' }}
                    className="p-4"
                  />
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
        
        {/* Mission & Vision Section */}
        <AnimatedSection>
          <div className="container mx-auto px-4 py-12">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold mb-6 text-gray-800">Our Mission & Vision</h2>
              <p className="text-gray-600">
                We believe in the power of community-driven change and the potential of every individual 
                to make a difference. Our platform is designed to remove barriers and create connections 
                that enable positive impact.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div 
                className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-purple-600"
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h3 className="text-2xl font-bold mb-4 text-gray-800">Our Mission</h3>
                <p className="text-gray-600 mb-4">
                  To empower communities by providing a transparent, accessible platform that connects 
                  passionate changemakers with donors who want to make a tangible difference in the world.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-gray-600">
                    <span className="text-purple-600 mr-2">✓</span> 
                    Enable grassroots initiatives to secure vital funding
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="text-purple-600 mr-2">✓</span> 
                    Ensure complete transparency in the donation process
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="text-purple-600 mr-2">✓</span> 
                    Build trust through accountability and verification
                  </li>
                </ul>
              </motion.div>
              
              <motion.div 
                className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-indigo-600"
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h3 className="text-2xl font-bold mb-4 text-gray-800">Our Vision</h3>
                <p className="text-gray-600 mb-4">
                  A world where every community has the resources and support to address their unique 
                  challenges and realize their aspirations for positive change.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-gray-600">
                    <span className="text-indigo-600 mr-2">✓</span> 
                    Create a global network of community-focused changemakers
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="text-indigo-600 mr-2">✓</span> 
                    Foster local solutions to local problems
                  </li>
                  <li className="flex items-center text-gray-600">
                    <span className="text-indigo-600 mr-2">✓</span> 
                    Democratize access to funding for social impact initiatives
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </AnimatedSection>
        
        {/* Our Values Section */}
        <AnimatedSection>
          <div className="bg-purple-50 py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">Our Core Values</h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                <ValueCard 
                  icon={<FaHandHoldingHeart className="h-10 w-10 text-purple-500" />}
                  title="Compassion"
                  description="We believe in the power of empathy and kindness to drive meaningful change in communities."
                />
                
                <ValueCard 
                  icon={<FaUsers className="h-10 w-10 text-purple-500" />}
                  title="Community"
                  description="We foster connections between people and causes, building networks of support and action."
                />
                
                <ValueCard 
                  icon={<FaGlobe className="h-10 w-10 text-purple-500" />}
                  title="Inclusivity"
                  description="We create space for diverse voices, perspectives, and initiatives on our platform."
                />
                
                <ValueCard 
                  icon={<FaLeaf className="h-10 w-10 text-purple-500" />}
                  title="Sustainability"
                  description="We promote initiatives that create lasting impact and address root causes."
                />
                
                <ValueCard 
                  icon={<FaChartLine className="h-10 w-10 text-purple-500" />}
                  title="Transparency"
                  description="We ensure clear communication and accountability throughout the donation process."
                />
                
                <ValueCard 
                  icon={<FaLightbulb className="h-10 w-10 text-purple-500" />}
                  title="Innovation"
                  description="We continuously improve our platform to better serve communities and donors."
                />
              </div>
            </div>
          </div>
        </AnimatedSection>
        
        {/* Impact Section */}
        <AnimatedSection>
          <div className="container mx-auto px-4 py-16">
            <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">Our Impact</h2>
            
            <div className="grid md:grid-cols-4 gap-6 mb-12">
              <ImpactCard number="450+" label="Campaigns Funded" />
              <ImpactCard number="$2.8M+" label="Total Raised" />
              <ImpactCard number="18,000+" label="Donors" />
              <ImpactCard number="32" label="Countries Reached" />
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="grid md:grid-cols-2">
                <div className="p-8 md:p-12">
                  <h3 className="text-2xl font-bold mb-4 text-gray-800">Success Stories</h3>
                  <p className="text-gray-600 mb-6">
                    We're proud of the incredible impact our community has made through JamiiFund. 
                    From educational initiatives to healthcare projects, environmental conservation 
                    to cultural preservation, our platform has enabled meaningful change in diverse communities.
                  </p>
                  <Link 
                    href="/success-stories" 
                    className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-full transition-all hover:shadow-lg"
                  >
                    Explore Success Stories
                  </Link>
                </div>
                <div className="bg-purple-600 p-8 md:p-12 text-white">
                  <h3 className="text-2xl font-bold mb-4">Featured Project</h3>
                  <h4 className="text-xl mb-2">Clean Water Initiative, Nairobi</h4>
                  <p className="mb-4">
                    This project provided clean water access to over 5,000 residents in an underserved 
                    Nairobi neighborhood, reducing waterborne diseases by 65% and cutting water 
                    collection time for families by 3 hours daily.
                  </p>
                  <div className="mb-4">
                    <span className="font-bold">Raised:</span> $42,850
                  </div>
                  <Link 
                    href="/campaigns/clean-water-nairobi" 
                    className="inline-block bg-white text-purple-600 font-semibold py-2 px-6 rounded-full transition-all hover:shadow-lg hover:bg-gray-100"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
        
        {/* Team Section */}
        <AnimatedSection>
          <div className="container mx-auto px-4 py-16">
            <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">Meet Our Team</h2>
            <p className="text-gray-600 text-center max-w-3xl mx-auto mb-12">
              We're a diverse group of passionate individuals committed to creating positive change 
              through technology, community engagement, and social innovation.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              <TeamMember 
                name="Sabri Salumu"
                role="Founder & CEO"
                image="/images/team/sabri.jpg"
                bio="Visionary leader with expertise in social entrepreneurship and community development initiatives."
              />
              <TeamMember 
                name="Rdhia Omari"
                role="Chief Operations Officer"
                image="/images/team/rdhia.jpg"
                bio="Strategic operations expert with a passion for scaling social impact solutions."
              />
              <TeamMember 
                name="Ally Yakubu"
                role="Technology Director"
                image="/images/team/ally.jpg"
                bio="Tech innovator focused on developing accessible platforms that connect communities with resources."
              />
            </div>
          </div>
        </AnimatedSection>
        
        {/* Partners Section */}
        <AnimatedSection>
          <div className="bg-purple-50 py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">Our Partners</h2>
              <p className="text-gray-600 text-center max-w-3xl mx-auto mb-12">
                We collaborate with organizations that share our commitment to community empowerment and social impact.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <PartnerLogo name="Tech For Good" logo="/images/partners/tech-for-good.svg" />
                <PartnerLogo name="Community Foundation" logo="/images/partners/community-foundation.svg" />
                <PartnerLogo name="Global Impact Initiative" logo="/images/partners/global-impact.svg" />
                <PartnerLogo name="Innovation Hub" logo="/images/partners/innovation-hub.svg" />
                <PartnerLogo name="Changemakers Alliance" logo="/images/partners/changemakers.svg" />
                <PartnerLogo name="Digital Inclusion Network" logo="/images/partners/digital-inclusion.svg" />
                <PartnerLogo name="Sustainable Future" logo="/images/partners/sustainable-future.svg" />
                <PartnerLogo name="Grassroots Collective" logo="/images/partners/grassroots.svg" />
              </div>
            </div>
          </div>
        </AnimatedSection>
        
        {/* Join Us CTA */}
        <AnimatedSection>
          <div className="container mx-auto px-4 py-16">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-8 md:p-12 text-center text-white">
              <h2 className="text-3xl font-bold mb-6">Join Our Mission</h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto">
                Whether you're looking to start a campaign, support an existing cause, or join our team, 
                there are many ways to be part of the JamiiFund community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/campaigns/create" 
                  className="bg-white text-purple-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-full transition-all hover:shadow-lg"
                >
                  Start a Campaign
                </Link>
                <Link 
                  href="/contact" 
                  className="bg-transparent hover:bg-purple-700 border-2 border-white text-white font-semibold py-3 px-8 rounded-full transition-all hover:shadow-lg"
                >
                  Contact Us
                </Link>
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
      </main>
      <Footer />
    </>
  );
}

// Helper Components
function AnimatedSection({ children, delay = 0 }) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.8, delay }}
      className="overflow-hidden"
    >
      {children}
    </motion.div>
  );
}

function ValueCard({ icon, title, description }) {
  return (
    <motion.div 
      className="bg-white p-6 rounded-xl shadow-md"
      whileHover={{ y: -10 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
}

function ImpactCard({ number, label }) {
  return (
    <motion.div 
      className="bg-white p-6 rounded-xl shadow-md text-center"
      whileHover={{ y: -10 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">{number}</div>
      <div className="text-gray-600">{label}</div>
    </motion.div>
  );
}

function TeamMember({ name, role, image, bio }) {
  return (
    <motion.div 
      className="bg-white rounded-xl shadow-md overflow-hidden"
      whileHover={{ y: -10 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="relative h-64">
        <Image 
          src={image} 
          alt={name}
          fill
          style={{ objectFit: 'cover' }}
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-1 text-gray-800">{name}</h3>
        <div className="text-purple-600 font-medium mb-3">{role}</div>
        <p className="text-gray-600">{bio}</p>
      </div>
    </motion.div>
  );
}

function PartnerLogo({ name, logo }) {
  return (
    <motion.div 
      className="bg-white p-6 rounded-xl shadow-md flex items-center justify-center h-32"
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Image 
        src={logo} 
        alt={name}
        width={120}
        height={60}
        style={{ objectFit: 'contain' }}
      />
    </motion.div>
  );
}

// Don't forget to install needed dependencies:
// npm install framer-motion react-intersection-observer