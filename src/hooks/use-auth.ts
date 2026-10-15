import { useState, useCallback } from 'react';
import { useConvexData } from '../lib/convex-client';
import { UserDoc } from '../convex/schema';

export function useAuth() {
  const { user, setUser } = useConvexData();
  const [isLoading, setIsLoading] = useState(false);

  const isAuthenticated = !!user && !user.isAnonymous;

  const signIn = useCallback(
    async (provider: 'email-otp' | 'anonymous', params?: { email?: string; code?: string }) => {
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 600));

        if (provider === 'anonymous') {
          const guestUser: UserDoc = {
            _id: `guest_${Date.now()}`,
            _creationTime: Date.now(),
            name: 'Guest Creator',
            email: 'guest@manadesign.studio',
            isAnonymous: true,
            role: 'creator',
          };
          setUser(guestUser);
          return { success: true, user: guestUser };
        }

        if (provider === 'email-otp' && params?.email) {
          const verifiedUser: UserDoc = {
            _id: `user_${Math.random().toString(36).substring(2, 9)}`,
            _creationTime: Date.now(),
            name: params.email.split('@')[0],
            email: params.email,
            isAnonymous: false,
            role: 'creator',
          };
          setUser(verifiedUser);
          return { success: true, user: verifiedUser };
        }

        throw new Error('Invalid sign-in parameters');
      } finally {
        setIsLoading(false);
      }
    },
    [setUser]
  );

  const signOut = useCallback(async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      // Revert to guest
      const guestUser: UserDoc = {
        _id: `guest_${Date.now()}`,
        _creationTime: Date.now(),
        name: 'Guest Creator',
        email: 'guest@manadesign.studio',
        isAnonymous: true,
        role: 'creator',
      };
      setUser(guestUser);
    } finally {
      setIsLoading(false);
    }
  }, [setUser]);

  return {
    isLoading,
    isAuthenticated,
    user,
    signIn,
    signOut,
  };
}
