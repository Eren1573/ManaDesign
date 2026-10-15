// Convex Query: users.currentUser
import { UserDoc } from './schema';

export async function currentUser(ctx: any): Promise<UserDoc | null> {
  const identity = await ctx?.auth?.getUserIdentity?.();
  if (!identity) {
    return null;
  }
  return {
    _id: identity.subject,
    _creationTime: Date.now(),
    email: identity.email,
    name: identity.name || identity.email?.split('@')[0] || 'Creator',
    isAnonymous: identity.isAnonymous || false,
    role: 'creator',
  };
}
