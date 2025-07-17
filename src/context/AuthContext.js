"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '@/firebase/firebase';
import { onAuthStateChanged, signOut, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

const AuthContext = createContext({
  user: null,
  loading: true,
  logout: async () => {},
  signup: async () => {},
});

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email, password, userData) => {
    setLoading(true);
    try {
      // Create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth, email, password
      );
      
      // Set display name in Firebase
      if (userData.displayName) {
        await updateProfile(userCredential.user, {
          displayName: userData.displayName
        });
      }
      
      // Call your existing API to create user in Supabase
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firebase_uid: userCredential.user.uid,
          email: email,
          full_name: userData.displayName,
          password: userData.password || password
        })
      });
      
      // Log the full response for debugging
      console.log('API response status:', response.status);
      
      const data = await response.json();
      console.log('API response data:', data);
      
      if (!response.ok) {
        // Even though the error is thrown, both accounts are created
        // This suggests the API endpoint might be returning an error status
        throw new Error(data.error || 'Failed to create user profile');
      }
      
      return userCredential.user;
    } catch (error) {
      console.error("Registration error details:", error);
      
      // Check if user was created in Firebase despite the error
      const currentUser = auth.currentUser;
      if (currentUser) {
        console.log("Firebase user was created despite error:", currentUser.uid);
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};