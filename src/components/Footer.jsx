"use client"
import { useState } from 'react';
import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null); // null, 'success', 'error'
  const [errorMessage, setErrorMessage] = useState('');

  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    // Reset previous status
    setSubscriptionStatus(null);
    setErrorMessage('');
    
    // Validate email
    if (!email) {
      setSubscriptionStatus('error');
      setErrorMessage('Please enter your email address');
      return;
    }
    
    if (!validateEmail(email)) {
      setSubscriptionStatus('error');
      setErrorMessage('Please enter a valid email address');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to subscribe');
      }
      
      // Success
      setSubscriptionStatus('success');
      setEmail('');
    } catch (error) {
      console.error('Subscription error:', error);
      setSubscriptionStatus('error');
      setErrorMessage(error.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 pt-12 pb-6 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">About JamiiFund</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Empowering communities through collective fundraising. 
              JamiiFund connects local causes with donors who care.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300" aria-label="Facebook">
                <FaFacebook size={20} />
              </a>
              <a href="https://twitter.com" className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300" aria-label="Twitter">
                <FaTwitter size={20} />
              </a>
              <a href="https://instagram.com/jamii_fund" className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300" aria-label="Instagram">
                <FaInstagram size={20} />
              </a>
              <a href="https://linkedin.com" className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300" aria-label="LinkedIn">
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/campaigns/explore" className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400">
                  Browse Campaigns
                </Link>
              </li>
              <li>
                <Link href="/campaigns/create" className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400">
                  Start a Campaign
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/guidelines" className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400">
                  Community Guidelines
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <FaEnvelope className="mt-1 mr-3 text-purple-600 dark:text-purple-400" />
                <span className="text-gray-600 dark:text-gray-300">fundjamii@gmail.com</span>
              </li>
              <li className="flex items-start">
                <FaPhone className="mt-1 mr-3 text-purple-600 dark:text-purple-400" />
                <span className="text-gray-600 dark:text-gray-300">+255 698959522</span>
              </li>
              <li className="flex items-start">
                <FaMapMarkerAlt className="mt-1 mr-3 text-purple-600 dark:text-purple-400" />
                <span className="text-gray-600 dark:text-gray-300">
                  MUHAS, <br />
                  Dar es Salaam, Tanzania
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-8 pb-6 mb-4">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Subscribe to our newsletter</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">Stay updated with the latest campaigns and community news</p>
            
            <form onSubmit={handleSubscribe} className="mb-2">
              <div className="flex flex-col sm:flex-row gap-2">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address" 
                  className={`flex-grow p-2 rounded-lg border ${
                    subscriptionStatus === 'error' 
                      ? 'border-red-400 dark:border-red-500' 
                      : 'border-gray-300 dark:border-gray-700'
                  } dark:bg-gray-800 dark:text-white`}
                  disabled={isSubmitting}
                />
                <button 
                  type="submit"
                  className={`${
                    isSubmitting 
                      ? 'bg-purple-500 cursor-not-allowed' 
                      : 'bg-purple-600 hover:bg-purple-700'
                  } text-white font-medium py-2 px-4 rounded-lg transition flex items-center justify-center`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                </button>
              </div>
            </form>
            
            {/* Status Messages */}
            {subscriptionStatus === 'success' && (
              <div className="flex items-center justify-center text-green-600 dark:text-green-400 text-sm mt-2">
                <FaCheckCircle className="mr-2" />
                <span>Thank you for subscribing to our newsletter!</span>
              </div>
            )}
            
            {subscriptionStatus === 'error' && (
              <div className="flex items-center justify-center text-red-600 dark:text-red-400 text-sm mt-2">
                <FaExclamationCircle className="mr-2" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} JamiiFund · Made with ❤️ in Tanzania
          </p>
          <div className="flex space-x-4">
            <Link href="/accessibility" className="text-gray-600 dark:text-gray-400 text-sm hover:text-purple-600 dark:hover:text-purple-400">
              Accessibility
            </Link>
            <Link href="/sitemap" className="text-gray-600 dark:text-gray-400 text-sm hover:text-purple-600 dark:hover:text-purple-400">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
