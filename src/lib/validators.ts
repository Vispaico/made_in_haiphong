import { z } from 'zod';

export const postBodySchema = z.object({
  content: z.string().trim().min(1, 'Post content cannot be empty').max(2000),
  imageUrls: z
    .array(z.string().url('Image URLs must be valid URLs'))
    .max(5, 'A maximum of 5 images per post is allowed')
    .optional()
    .default([]),
});

export const listingBodySchema = z.object({
  title: z.string().trim().min(3).max(120),
  description: z.string().trim().min(30),
  category: z.string().trim().min(1),
  price: z.coerce.number().positive(),
  imageUrls: z.array(z.string().url()).min(1).max(10).optional().default([]),
  maxGuests: z.coerce.number().int().positive().optional(),
  bedrooms: z.coerce.number().int().positive().optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
});

export const bookingRequestSchema = z
  .object({
    listingId: z.string().cuid(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
  })
  .refine((data) => data.startDate < data.endDate, {
    message: 'End date must be after start date',
    path: ['endDate'],
  });

export const awardPointsSchema = z.object({
  recipientAddress: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/u, 'Recipient address must be a valid Ethereum address'),
  amount: z.coerce.number().positive(),
});

export const contactFormSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().email(),
  message: z.string().trim().min(20).max(1500),
});

export const conversationRecipientSchema = z.object({
  recipientId: z.string().cuid(),
});

export const aiChatSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(['system', 'user', 'assistant']),
        content: z.any(),
      })
    )
    .min(1),
});

export const emailOnlySchema = z.object({
  email: z.string().email(),
});
