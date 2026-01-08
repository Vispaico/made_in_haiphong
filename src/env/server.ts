import { z } from 'zod';

const serverSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  NEXTAUTH_SECRET: z.string().min(1, 'NEXTAUTH_SECRET is required'),
  GOOGLE_CLIENT_ID: z.string().min(1, 'GOOGLE_CLIENT_ID is required'),
  GOOGLE_CLIENT_SECRET: z.string().min(1, 'GOOGLE_CLIENT_SECRET is required'),
  CLOUDINARY_API_KEY: z.string().min(1, 'CLOUDINARY_API_KEY is required'),
  CLOUDINARY_API_SECRET: z.string().min(1, 'CLOUDINARY_API_SECRET is required'),
  NEXTAUTH_URL: z.string().url('NEXTAUTH_URL must be a valid URL').optional(),
  GOOGLE_API_KEY: z.string().optional(),
  DEPLOY_NETWORK_URL: z.string().url('DEPLOY_NETWORK_URL must be a valid URL').optional(),
  ADMIN_PRIVATE_KEY: z.string().optional(),
  EMAIL_SERVER_HOST: z.string().optional(),
  EMAIL_SERVER_PORT: z.string().optional(),
  EMAIL_SERVER_USER: z.string().optional(),
  EMAIL_SERVER_PASSWORD: z.string().optional(),
  EMAIL_FROM: z.string().optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  CONTACT_FORM_RECEIVER_EMAIL: z.string().optional(),
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z
    .string()
    .min(1, 'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is required for media uploads'),
  NEXT_PUBLIC_CONTRACT_ADDRESS: z.string().optional(),
  NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: z.string().optional(),
});

const parsed = serverSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid server environment variables');
  console.error(parsed.error.flatten().fieldErrors);
  throw new Error('Invalid server environment variables');
}

export const serverEnv = parsed.data;
