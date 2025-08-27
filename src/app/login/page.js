// app/login/page.js
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaEnvelope, FaLock, FaSpinner } from "react-icons/fa";
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};

    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password
      });
      
      if (error) throw error;

      console.log("Supabase login successful:", data);
      
      // Redirect to home page after successful login
      router.push("/");
    } catch (error) {
      let errorMessage = "Invalid email or password";

      // Handle Supabase auth errors
      if (error.message) {
        if (error.message.includes("Invalid login")) {
          errorMessage = "Invalid email or password. Please try again.";
        } else if (error.message.includes("too many requests")) {
          errorMessage = "Too many unsuccessful login attempts. Please try again later.";
        } else if (error.message.includes("User is disabled")) {
          errorMessage = "This account has been disabled. Please contact support.";
        } else {
          errorMessage = error.message;
        }
      }

      setErrors({ submit: errorMessage });
      console.error("Login failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Welcome Back
      </h1>

      {errors.submit && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
          {errors.submit}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">Email</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaEnvelope className="text-gray-400" />
            </div>
            <input
              className={`w-full pl-10 pr-3 py-2 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              type="email"
              placeholder="you@example.com"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-medium text-gray-700">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaLock className="text-gray-400" />
            </div>
            <input
              className={`w-full pl-10 pr-3 py-2 border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              type="password"
              placeholder="********"
            />
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">{errors.password}</p>
          )}
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-gray-700"
            >
              Remember me
            </label>
          </div>
          <div className="text-sm">
            <Link
              href="/forgot-password"
              className="text-purple-600 hover:text-purple-800"
            >
              Forgot your password?
            </Link>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors disabled:opacity-70 flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <FaSpinner className="animate-spin mr-2" />
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </button>
      </form>

      <p className="text-center text-sm text-gray-600 mt-6">
        New to JamiiFund?{" "}
        <Link
          href="/register"
          className="text-purple-600 hover:text-purple-800 font-medium"
        >
          Create an account
        </Link>
      </p>
    </section>
  );
}
