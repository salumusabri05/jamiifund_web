"use client";

import { AuthContextProvider } from '@/context/AuthContext'; // Singular "context"

export default function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    return (
      <AuthContextProvider>
        <Component {...props} />
      </AuthContextProvider>
    );
  };
}