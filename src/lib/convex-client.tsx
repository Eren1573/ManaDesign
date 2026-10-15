import React, { createContext, useContext, useState, useEffect } from 'react';
import { STORE_TEMPLATES, TemplateItem } from './store-catalog';
import { PromptDoc, OrderDoc, UserDoc } from '../convex/schema';
import { geminiVision, geminiGenerateImage } from './gemini';

interface ConvexContextType {
  user: UserDoc | null;
  setUser: (user: UserDoc | null) => void;
  prompts: PromptDoc[];
  templates: TemplateItem[];
  orders: OrderDoc[];
  purchasedTemplateSlugs: string[];
  generateUploadUrl: () => Promise<string>;
  uploadFileToStorage: (file: File | Blob) => Promise<{ storageId: string; url: string }>;
  savePrompt: (promptData: {
    prompt: string;
    thumbnail?: string;
    storageId?: string;
    subject?: string;
    lighting?: string;
    composition?: string;
    palette?: string;
    tags: string[];
  }) => Promise<string>;
  deletePrompt: (id: string) => Promise<boolean>;
  purchaseTemplate: (slug: string) => Promise<{ success: boolean; paid: boolean }>;
  isTemplatePurchased: (slug: string) => boolean;
  generateImagePromptAction: (image: string, note?: string) => Promise<any>;
  generateImageAction: (prompt: string, style: string, aspectRatio: string) => Promise<any>;
}

const ConvexContext = createContext<ConvexContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_USER = 'manadesign_user';
const LOCAL_STORAGE_KEY_PROMPTS = 'manadesign_prompts';
const LOCAL_STORAGE_KEY_ORDERS = 'manadesign_orders';

// Seed default prompts for demo presentation
const INITIAL_DEMO_PROMPTS: PromptDoc[] = [
  {
    _id: 'pmt_demo_1',
    _creationTime: Date.now() - 3600000 * 2,
    userId: 'user_demo_creator',
    prompt: 'Commercial hero product photography of a luxury minimalist frosted glass cosmetics dropper bottle, rested on dry sandstone pedestal, serene shallow water rippling with delicate caustic lighting reflections, soft northern studio daylight, 100mm macro lens f/2.8, Hasselblad H6D-100c, magazine editorial grade --ar 16:9 --style raw',
    subject: 'Luxury cosmetics dropper bottle on sandstone',
    lighting: 'Soft northern daylight with subtle caustic water reflections',
    composition: '100mm macro, shallow depth of field, centered symmetry',
    palette: 'Off-white, desert sandstone (#d4b996), crystalline aqua',
    tags: ['E-Commerce', 'Cosmetics', 'Studio', '8K', 'Macro'],
    createdAt: Date.now() - 3600000 * 2,
  },
  {
    _id: 'pmt_demo_2',
    _creationTime: Date.now() - 3600000 * 24,
    userId: 'user_demo_creator',
    prompt: 'Architectural interior detail of modern brutalist concrete coffee bar, warm natural sunlight through floor-to-ceiling glass, polished micro-cement flooring, matte black espresso machine with delicate steam plume, minimalist aesthetic, Leica M11 35mm f/1.4 --ar 4:5',
    subject: 'Brutalist coffee bar interior with espresso machine',
    lighting: 'Warm angular morning sunbeams',
    composition: 'Rule of thirds, low architectural angle',
    palette: 'Warm concrete grey, matte obsidian, morning gold',
    tags: ['Architecture', 'Branding', 'Interior', 'Editorial'],
    createdAt: Date.now() - 3600000 * 24,
  }
];

export const ConvexProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Current user state
  const [user, setUserState] = useState<UserDoc | null>(() => {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY_USER);
    if (stored) {
      try { return JSON.parse(stored); } catch (e) { }
    }
    // Default guest session so the user can immediately play with everything
    return {
      _id: 'user_guest_1',
      _creationTime: Date.now(),
      name: 'Guest Creator',
      email: 'guest@manadesign.studio',
      isAnonymous: true,
      role: 'creator',
    };
  });

  // Saved prompts
  const [prompts, setPrompts] = useState<PromptDoc[]>(() => {
    if (typeof window === 'undefined') return INITIAL_DEMO_PROMPTS;
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY_PROMPTS);
    if (stored) {
      try { return JSON.parse(stored); } catch (e) { }
    }
    return INITIAL_DEMO_PROMPTS;
  });

  // Orders
  const [orders, setOrders] = useState<OrderDoc[]>(() => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY_ORDERS);
    if (stored) {
      try { return JSON.parse(stored); } catch (e) { }
    }
    // Pre-seed Campaign Launch Suite for demonstration
    return [
      {
        _id: 'ord_init_1',
        _creationTime: Date.now() - 86400000,
        userId: 'user_guest_1',
        templateId: 'tpl_campaign_launch',
        templateSlug: 'campaign-launch-suite',
        status: 'paid',
        amountCents: 3900,
        provider: 'demo',
        createdAt: Date.now() - 86400000,
        paidAt: Date.now() - 86400000,
      }
    ];
  });

  // Save changes to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(LOCAL_STORAGE_KEY_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY_USER);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_PROMPTS, JSON.stringify(prompts));
  }, [prompts]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_ORDERS, JSON.stringify(orders));
  }, [orders]);

  const setUser = (u: UserDoc | null) => {
    setUserState(u);
  };

  const generateUploadUrl = async (): Promise<string> => {
    return `/api/convex/storage/upload?token=${Date.now()}`;
  };

  const uploadFileToStorage = async (file: File | Blob): Promise<{ storageId: string; url: string }> => {
    const storageId = `cfs_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`;
    const url = URL.createObjectURL(file);
    return { storageId, url };
  };

  const savePrompt = async (promptData: {
    prompt: string;
    thumbnail?: string;
    storageId?: string;
    subject?: string;
    lighting?: string;
    composition?: string;
    palette?: string;
    tags: string[];
  }): Promise<string> => {
    const newId = `pmt_${Date.now()}`;
    let finalStorageId = promptData.storageId;
    let finalThumbnail = promptData.thumbnail;

    // Move large data URLs to Convex file storage reference (storageId + resolved URL)
    if (finalThumbnail && finalThumbnail.startsWith('data:')) {
      finalStorageId = `cfs_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`;
      // In production Convex, this resolves to ctx.storage.getUrl(storageId)
      // For fast client-side display, create a lightweight blob URL or keep clean reference
      try {
        const parts = finalThumbnail.split(',');
        const mime = parts[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
        const bstr = atob(parts[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        const blob = new Blob([u8arr], { type: mime });
        finalThumbnail = URL.createObjectURL(blob);
      } catch {
        // Fallback for safety
      }
    }

    const newDoc: PromptDoc = {
      _id: newId,
      _creationTime: Date.now(),
      userId: user?._id || 'guest',
      prompt: promptData.prompt,
      storageId: finalStorageId,
      thumbnail: finalThumbnail,
      subject: promptData.subject,
      lighting: promptData.lighting,
      composition: promptData.composition,
      palette: promptData.palette,
      tags: promptData.tags || [],
      createdAt: Date.now(),
    };
    setPrompts((prev) => [newDoc, ...prev]);
    return newId;
  };

  const deletePrompt = async (id: string): Promise<boolean> => {
    setPrompts((prev) => prev.filter((p) => p._id !== id));
    return true;
  };

  const purchaseTemplate = async (slug: string): Promise<{ success: boolean; paid: boolean }> => {
    const tpl = STORE_TEMPLATES.find((t) => t.slug === slug);
    if (!tpl) throw new Error('Template not found');

    const newOrder: OrderDoc = {
      _id: `ord_${Date.now()}`,
      _creationTime: Date.now(),
      userId: user?._id || 'guest',
      templateId: tpl.id,
      templateSlug: tpl.slug,
      status: 'paid', // Instant demo purchase
      amountCents: tpl.priceCents,
      provider: 'demo',
      createdAt: Date.now(),
      paidAt: Date.now(),
    };

    setOrders((prev) => [newOrder, ...prev]);
    return { success: true, paid: true };
  };

  const purchasedTemplateSlugs = orders
    .filter((o) => o.status === 'paid' && (!user || o.userId === user._id || o.userId === 'guest' || user.isAnonymous))
    .map((o) => o.templateSlug);

  const isTemplatePurchased = (slug: string) => {
    return purchasedTemplateSlugs.includes(slug);
  };

  const generateImagePromptAction = async (image: string, note?: string) => {
    return await geminiVision({ image, note });
  };

  const generateImageAction = async (prompt: string, style: string, aspectRatio: string) => {
    return await geminiGenerateImage({ prompt, style, aspectRatio });
  };

  return (
    <ConvexContext.Provider
      value={{
        user,
        setUser,
        prompts,
        templates: STORE_TEMPLATES,
        orders,
        purchasedTemplateSlugs,
        generateUploadUrl,
        uploadFileToStorage,
        savePrompt,
        deletePrompt,
        purchaseTemplate,
        isTemplatePurchased,
        generateImagePromptAction,
        generateImageAction,
      }}
    >
      {children}
    </ConvexContext.Provider>
  );
};

export function useConvexData() {
  const context = useContext(ConvexContext);
  if (!context) {
    throw new Error('useConvexData must be used within a ConvexProvider');
  }
  return context;
}
