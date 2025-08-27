// filepath: d:\JAMIIFUND\jamiifund\src\components\withAuth.jsx
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthProvider } from '@/contexts/AuthContext';
import ClientOnly from './ClientOnly';

export default function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    return (
      <ClientOnly>
        <AuthContextProvider>
          <Component {...props} />
        </AuthContextProvider>
      </ClientOnly>
    );
  };
}