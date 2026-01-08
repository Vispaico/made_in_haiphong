// src/app/api/sign-image/route.ts

import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';
import { serverEnv } from '@/env/server';
import { clientEnv } from '@/env/client';
import { logger } from '@/lib/logger';

cloudinary.config({
  cloud_name: clientEnv.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: serverEnv.CLOUDINARY_API_KEY,
  api_secret: serverEnv.CLOUDINARY_API_SECRET,
});

export async function POST() {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = 'haiphong-app-posts';

    // THE FIX: We are generating a simpler, more direct signature
    // by removing the problematic 'source: "uw"' parameter.
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp,
        folder: folder,
      },
      serverEnv.CLOUDINARY_API_SECRET
    );

    return NextResponse.json({
      signature,
      timestamp,
      cloud_name: clientEnv.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: serverEnv.CLOUDINARY_API_KEY,
      folder,
    });
  } catch (error) {
    logger.error({ error }, 'Error generating Cloudinary signature');
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}