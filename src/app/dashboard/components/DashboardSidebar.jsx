import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  FaUser, 
  FaMoneyBillWave, 
  FaHome, 
  FaBriefcase, 
  FaChartBar, 
  FaCreditCard,
  FaIdCard
} from 'react-icons/fa';

export default function DashboardSidebar({ activeForm, setActiveForm, user, userProfile }) {
  const menuItems = [
    { id: 'stats', label: 'Dashboard Overview', icon: <FaChartBar /> },
    { id: 'general', label: 'General Information', icon: <FaUser /> },
    { id: 'lipaNamba', label: 'Lipa Namba Details', icon: <FaMoneyBillWave /> },
    { id: 'payment', label: 'Payment Details', icon: <FaIdCard /> },
    { id: 'residency', label: 'Residency Information', icon: <FaHome /> },
    { id: 'work', label: 'Work Information', icon: <FaBriefcase /> }
  ];
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* User Profile Summary */}
      <div className="text-center mb-8">
        <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto mb-4 relative overflow-hidden">
          {user?.photoURL ? (
            <Image 
              src={user.photoURL} 
              alt="Profile" 
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FaUser className="text-gray-400 text-4xl" />
            </div>
          )}
        </div>
        <h3 className="font-bold text-lg text-gray-800">
          {userProfile?.full_name || user?.displayName || 'User'}
        </h3>
        <p className="text-gray-500 text-sm mt-1">{user?.email}</p>
        
        <div className="mt-4">
          <Link 
            href="/campaigns/my-campaigns" 
            className="inline-block text-purple-600 text-sm font-medium hover:text-purple-800"
          >
            My Campaigns
          </Link>
        </div>
      </div>
      
      {/* Navigation */}
      <nav>
        <ul className="space-y-1">
          {menuItems.map(item => (
            <li key={item.id}>
              <button
                onClick={() => setActiveForm(item.id)}
                className={`w-full flex items-center px-4 py-2 rounded-md transition-colors ${
                  activeForm === item.id
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Create Campaign Link */}
      <div className="mt-8 pt-4 border-t border-gray-200">
        <Link
          href="/campaigns/create"
          className="block w-full bg-purple-600 text-white text-center py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
        >
          Create New Campaign
        </Link>
      </div>
    </div>
  );
}