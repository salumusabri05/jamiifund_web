"use client";

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';

const timelineSteps = [
  {
    title: "Create a Campaign",
    description: "Start by creating your fundraising campaign. Provide details about your cause, set a funding goal, and share your story.",
    icon: "/images/jamiifund1.png",
  },
  {
    title: "Share with Your Network",
    description: "Spread the word about your campaign through social media, email, and word of mouth to reach potential donors.",
    icon: "/images/jamiifund.png",
  },
  {
    title: "Collect Donations",
    description: "As supporters donate to your cause, you'll see your funding progress in real-time on your campaign dashboard.",
    icon: "/images/jamiifund.png",
  },
  {
    title: "Funds Verification",
    description: "Our team verifies campaign details to ensure transparency and authenticity before funds are released.",
    icon: "/images/jamiifund.png",
  },
  {
    title: "Receive Funds",
    description: "Once verified, funds are transferred to your designated account, typically within 3-5 business days.",
    icon: "/images/jamiifund.png",
  },
  {
    title: "Create Impact & Report",
    description: "Use the funds to make a difference and share updates with your donors to show the impact of their contributions.",
    icon: "/images/jamiifund1.png",
  },
];

export default function ProcessTimeline() {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-purple-200 transform -translate-x-1/2" />
      
      <div className="space-y-12 relative">
        {timelineSteps.map((step, index) => {
          const [ref, inView] = useInView({
            triggerOnce: true,
            threshold: 0.1,
          });
          
          return (
            <motion.div
              key={index}
              ref={ref}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center`}
            >
              <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:text-right md:pr-8' : 'md:text-left md:pl-8'}`}>
                <h3 className="text-xl font-bold mb-2 text-gray-800">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
              
              <div className="flex items-center justify-center my-4 md:my-0 relative">
                <div className="bg-purple-600 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold z-10">
                  {index + 1}
                </div>
              </div>
              
              <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:text-left md:pl-8' : 'md:text-right md:pr-8'}`}>
                <div className="bg-white p-4 rounded-lg shadow-md inline-block">
                  <Image 
                    src={step.icon} 
                    alt={step.title}
                    width={80}
                    height={80}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}