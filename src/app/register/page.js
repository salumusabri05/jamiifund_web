// app/register/page.js
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaUser, FaEnvelope, FaLock, FaSpinner, FaCheck, FaTimes } from "react-icons/fa";
import { auth } from "@/firebase/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { supabase } from "@/lib/supabase";
// Import the admin client
import { supabaseAdmin } from '@/lib/supabase-admin';

const getAuthErrorMessage = (error) => {
  switch (error.code) {
    case 'auth/email-already-in-use':
      return 'This email is already registered. Please log in or use a different email.';
    case 'auth/weak-password':
      return 'Password is too weak. Please choose a stronger password.';
    case 'auth/invalid-email':
      return 'Invalid email address format.';
    default:
      return error.message || 'An error occurred during registration.';
  }
};

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    
    if (!form.name.trim()) {
      newErrors.name = "Full name is required";
    }
    
    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Calculate password strength
  const getPasswordStrength = () => {
    const { password = "" } = form;
    if (!password) return 0;
    
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 1;
    
    // Character type checks
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    return Math.min(strength, 4);
  };

  const getStrengthLabel = () => {
    const strength = getPasswordStrength();
    if (strength === 0) return "";
    if (strength === 1) return "Weak";
    if (strength === 2) return "Fair";
    if (strength === 3) return "Good";
    return "Strong";
  };

  const getStrengthColor = () => {
    const strength = getPasswordStrength();
    if (strength === 0) return "bg-gray-200";
    if (strength === 1) return "bg-red-500";
    if (strength === 2) return "bg-yellow-500";
    if (strength === 3) return "bg-blue-500";
    return "bg-green-500";
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    
    try {
      // 1. Create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth, form.email, form.password
      );
      
      // Set display name in Firebase
      await updateProfile(userCredential.user, {
        displayName: form.name
      });
      
      // 2. Call server API to create user in Supabase
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firebase_uid: userCredential.user.uid,
          email: form.email,
          full_name: form.name,
          password: form.password
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create user profile');
      }
      
      // Registration successful
      setIsSubmitted(true);
      
      // Redirect after delay
      setTimeout(() => {
        router.push('/');
      }, 3000);
      
    } catch (error) {
      console.error("Registration error:", error);
      setErrors({
        submit: getAuthErrorMessage(error)
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 mt-10">
      {isSubmitted ? (
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <FaCheck className="text-green-600 text-2xl" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-gray-800">Registration Successful!</h2>
          <p className="text-gray-600 mb-4">
            Your account has been created. Youll be redirected to the homepage shortly.
          </p>
          <Link href="/" className="text-purple-600 font-medium hover:text-purple-800">
            Go to homepage
          </Link>
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Create an Account</h1>
          
          {errors.submit && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-1 font-medium text-gray-700">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
                <input
                  className={`w-full pl-10 pr-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  type="text"
                  placeholder="John Doe"
                />
              </div>
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  className={`w-full pl-10 pr-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  type="email"
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  className={`w-full pl-10 pr-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  type="password"
                  placeholder="********"
                />
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
              
              {form.password && (
                <div className="mt-2">
                  <div className="flex justify-between items-center mb-1">
                    <div className="h-2 bg-gray-200 rounded-full w-full">
                      <div 
                        className={`h-full rounded-full ${getStrengthColor()} transition-all duration-300`}
                        style={{ width: `${(getPasswordStrength() / 4) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs ml-4 min-w-[50px] text-gray-600">{getStrengthLabel()}</span>
                  </div>
                  <ul className="text-xs text-gray-500 space-y-1">
                    <li className="flex items-center">
                      {form.password.length >= 8 ? 
                        <FaCheck className="text-green-500 mr-1" /> : 
                        <FaTimes className="text-red-500 mr-1" />}
                      At least 8 characters
                    </li>
                    <li className="flex items-center">
                      {/[A-Z]/.test(form.password) ? 
                        <FaCheck className="text-green-500 mr-1" /> : 
                        <FaTimes className="text-red-500 mr-1" />}
                      At least one uppercase letter
                    </li>
                    <li className="flex items-center">
                      {/[0-9]/.test(form.password) ? 
                        <FaCheck className="text-green-500 mr-1" /> : 
                        <FaTimes className="text-red-500 mr-1" />}
                      At least one number
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <div className="mb-6">
              <label className="block mb-1 font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  className={`w-full pl-10 pr-3 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  type="password"
                  placeholder="********"
                />
              </div>
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors disabled:opacity-70 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Creating account...
                </>
              ) : (
                "Sign up"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-purple-600 hover:text-purple-800 font-medium">
              Log in
            </Link>
          </p>
        </>
      )}
    </section>
  );
}
