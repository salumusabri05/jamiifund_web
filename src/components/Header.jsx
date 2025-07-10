"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaSearch, FaBars, FaTimes, FaUser, FaChevronDown, FaSignOutAlt } from "react-icons/fa";
import { auth } from "@/firebase/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [user, setUser] = useState(null);
  
  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setIsUserMenuOpen(false);
      router.push('/');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Main Navigation */}
        <nav className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            {/* You can replace this with your actual logo */}
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">J</div>
            <span className="text-2xl font-bold text-purple-600">JamiiFund</span>
          </Link>

          {/* Desktop Navigation - hidden on mobile */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/campaigns/explore" className="text-gray-600 hover:text-purple-600 transition">
              Explore
            </Link>
            <Link href="/how-it-works" className="text-gray-600 hover:text-purple-600 transition">
              How It Works
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-purple-600 transition">
              About Us
            </Link>
            
            <div className="relative group">
              <button 
                className="flex items-center text-gray-600 hover:text-purple-600 transition"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                Resources <FaChevronDown className="ml-1 text-xs" />
              </button>
              <div className={`absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden transition-all duration-300 ${isUserMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                <Link href="/blog" className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50">
                  Blog
                </Link>
                <Link href="/success-stories" className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50">
                  Success Stories
                </Link>
                <Link href="/fundraising-tips" className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50">
                  Fundraising Tips
                </Link>
              </div>
            </div>
          </div>

          {/* Search and User Actions */}
          <div className="flex items-center space-x-3">
            {/* Search Toggle */}
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-gray-500 hover:text-purple-600 rounded-full hover:bg-purple-50 transition"
              aria-label="Search"
            >
              <FaSearch />
            </button>
            
            {/* Auth Buttons - hidden on mobile */}
            {!user ? (
              <div className="hidden md:flex items-center space-x-3">
                <Link href="/login" className="text-gray-600 hover:text-purple-600 transition">
                  Login
                </Link>
                <Link
                  href="/register"
                  className="rounded-full bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 transition"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="hidden md:block relative">
                <button 
                  className="flex items-center space-x-2 text-gray-600 hover:text-purple-600"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    {user.photoURL ? (
                      <Image 
                        src={user.photoURL} 
                        alt="Profile" 
                        width={32} 
                        height={32} 
                        className="rounded-full" 
                      />
                    ) : (
                      <FaUser className="text-gray-500" />
                    )}
                  </div>
                  <span>{user.displayName || 'Account'}</span>
                </button>
                <div className={`absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden transition-all duration-300 ${isUserMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                  <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50">
                    Dashboard
                  </Link>
                  <Link href="/campaigns/my-campaigns" className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50">
                    My Campaigns
                  </Link>
                  <button 
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                  >
                    <FaSignOutAlt className="mr-2" /> Sign Out
                  </button>
                </div>
              </div>
            )}
            
            {/* Start Campaign button */}
            <Link 
              href={user ? "/campaigns/create" : "/login?redirect=/campaigns/create"} 
              className="hidden md:block rounded-full bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 transition"
            >
              Start Campaign
            </Link>
            
            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-gray-500 hover:text-purple-600 rounded-full hover:bg-purple-50 transition"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </nav>
        
        {/* Search Bar - only visible when search is open */}
        {isSearchOpen && (
          <div className="py-4 border-t border-gray-100 transition-all duration-300">
            <div className="relative">
              <input
                type="text"
                placeholder="Search campaigns..."
                className="w-full p-3 pl-10 rounded-full border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        )}
        
        {/* Mobile Menu - only visible on mobile when menu is open */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/campaigns" 
                className="text-gray-600 hover:text-purple-600 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Explore
              </Link>
              <Link 
                href="/how-it-works" 
                className="text-gray-600 hover:text-purple-600 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link 
                href="/about" 
                className="text-gray-600 hover:text-purple-600 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
              <Link 
                href="/blog" 
                className="text-gray-600 hover:text-purple-600 transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              
              {/* Auth Links for Mobile */}
              {!user ? (
                <div className="pt-4 border-t border-gray-100 flex flex-col space-y-3">
                  <Link 
                    href="/login" 
                    className="text-gray-600 hover:text-purple-600 transition"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-full bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 transition text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                  <Link
                    href="/campaigns/create"
                    className="rounded-full border border-purple-600 px-4 py-2 text-purple-600 hover:bg-purple-50 transition text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Start Campaign
                  </Link>
                </div>
              ) : (
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      {user.photoURL ? (
                        <Image 
                          src={user.photoURL} 
                          alt="Profile" 
                          width={32} 
                          height={32} 
                          className="rounded-full" 
                        />
                      ) : (
                        <FaUser className="text-gray-500" />
                      )}
                    </div>
                    <span className="font-medium">{user.displayName || user.email}</span>
                  </div>
                  <Link 
                    href="/dashboard" 
                    className="text-gray-600 hover:text-purple-600 transition block mb-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href="/campaigns/my-campaigns" 
                    className="text-gray-600 hover:text-purple-600 transition block mb-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Campaigns
                  </Link>
                  <Link 
                    href="/campaigns/create"
                    className="block mt-3 rounded-full bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 transition text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Start Campaign
                  </Link>
                  <button 
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full mt-3 rounded-full border border-red-500 px-4 py-2 text-red-500 hover:bg-red-50 transition text-center"
                  >
                    <FaSignOutAlt className="inline mr-2" /> Sign Out
                  </button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
