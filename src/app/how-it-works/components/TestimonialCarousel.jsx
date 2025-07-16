"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { FaQuoteLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Campaign Creator",
    image: "/images/testimonials/sarah.jpg",
    campaign: "Community Garden Project",
    quote: "JamiiFund made it easy to raise funds for our community garden. The transparent process gave our donors confidence, and the regular updates feature helped us keep everyone engaged with our progress.",
    raised: "$12,500"
  },
  {
    name: "Michael Omondi",
    role: "Non-profit Director",
    image: "/images/testimonials/michael.jpg",
    campaign: "Clean Water Initiative",
    quote: "As a small non-profit, we struggled with fundraising infrastructure. JamiiFund provided all the tools we needed to run a successful campaign and reach donors beyond our usual network.",
    raised: "$28,750"
  },
  {
    name: "Amina Wanjiku",
    role: "School Teacher",
    image: "/images/testimonials/amina.jpg",
    campaign: "School Library Fund",
    quote: "The step-by-step process made fundraising approachable even for someone with no prior experience. We exceeded our goal and now have a fully stocked library for our students!",
    raised: "$8,900"
  }
];

export default function TestimonialCarousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for right, -1 for left
  
  const nextTestimonial = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % testimonials.length);
  };
  
  const prevTestimonial = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };
  
  // Auto-advance the carousel
  useEffect(() => {
    const timer = setTimeout(() => {
      nextTestimonial();
    }, 8000);
    
    return () => clearTimeout(timer);
  }, [current]);
  
  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0
    })
  };
  
  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 overflow-hidden">
        <FaQuoteLeft className="text-purple-200 text-4xl mb-6" />
        
        <div className="h-[400px] md:h-[300px] relative">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={current}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5 }}
              className="absolute inset-0"
            >
              <div className="flex flex-col md:flex-row gap-8 h-full">
                <div className="md:w-1/3 flex flex-col items-center justify-center">
                  <div className="relative w-32 h-32 mb-4 rounded-full overflow-hidden border-4 border-purple-100">
                    <Image
                      src={testimonials[current].image}
                      alt={testimonials[current].name}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">{testimonials[current].name}</h3>
                  <p className="text-purple-600">{testimonials[current].role}</p>
                  <div className="mt-2 px-4 py-1 bg-purple-100 rounded-full text-sm font-medium text-purple-800">
                    Raised: {testimonials[current].raised}
                  </div>
                </div>
                
                <div className="md:w-2/3 flex flex-col justify-center">
                  <h4 className="text-lg font-semibold mb-3 text-gray-700">{testimonials[current].campaign}</h4>
                  <p className="text-gray-600 italic">{testimonials[current].quote}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        
        <div className="flex justify-center mt-6 space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > current ? 1 : -1);
                setCurrent(index);
              }}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                index === current ? 'bg-purple-600 w-8' : 'bg-purple-200'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
      
      <button
        onClick={prevTestimonial}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 bg-white w-10 h-10 rounded-full shadow-lg flex items-center justify-center text-purple-600 hover:bg-purple-50 transition-colors z-10"
        aria-label="Previous testimonial"
      >
        <FaChevronLeft />
      </button>
      
      <button
        onClick={nextTestimonial}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 bg-white w-10 h-10 rounded-full shadow-lg flex items-center justify-center text-purple-600 hover:bg-purple-50 transition-colors z-10"
        aria-label="Next testimonial"
      >
        <FaChevronRight />
      </button>
    </div>
  );
}