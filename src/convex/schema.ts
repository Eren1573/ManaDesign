// Convex Database Schema
// Defines collections: users, prompts, templates, orders

export interface UserDoc {
  _id: string;
  _creationTime: number;
  email?: string;
  name?: string;
  image?: string;
  isAnonymous?: boolean;
  role?: 'creator' | 'admin';
}

export interface PromptDoc {
  _id: string;
  _creationTime: number;
  userId: string;
  thumbnail?: string;
  storageId?: string;
  prompt: string;
  subject?: string;
  lighting?: string;
  composition?: string;
  palette?: string;
  tags: string[];
  createdAt: number;
}

export interface TemplateDoc {
  _id: string;
  _creationTime: number;
  slug: string;
  title: string;
  category: 'Marketing' | 'Personal';
  priceCents: number;
  description: string;
  shortDescription: string;
  promptCount: number;
  tags: string[];
  gradientClass: string;
  accentColor: string;
  highlights: string[];
  samplePrompts: string[];
  recommendedModel: string;
  featured?: boolean;
}

export interface OrderDoc {
  _id: string;
  _creationTime: number;
  userId: string;
  templateId: string;
  templateSlug: string;
  status: 'pending' | 'paid' | 'cancelled';
  amountCents: number;
  provider: 'demo' | 'stripe' | 'vly';
  createdAt: number;
  paidAt?: number;
}
