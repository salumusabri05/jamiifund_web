"use client";

import { AuthContextProvider } from '@/context/AuthContext';

export default function AuthProviderWrapper({ children }) {
  return <AuthContextProvider>{children}</AuthContextProvider>;
}