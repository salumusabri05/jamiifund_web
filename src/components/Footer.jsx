"use client;"
import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

export default function Footer() {
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
                <Link href="/campaigns" className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400">
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
                <Link href="/faq" className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400">
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
            <div className="flex flex-col sm:flex-row gap-2">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-grow p-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
              <button className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition">
                Subscribe
              </button>
            </div>
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
