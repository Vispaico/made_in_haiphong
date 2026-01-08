// src/app/api/upload/route.ts
import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { serverEnv } from '@/env/server';
import { clientEnv } from '@/env/client';
import { logger } from '@/lib/logger';

cloudinary.config({
  cloud_name: clientEnv.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: serverEnv.CLOUDINARY_API_KEY,
  api_secret: serverEnv.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new NextResponse('Bad Request: No file found', { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'haiphong-app-articles',
          upload_preset: 'ml_default',
        },
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(result);
        }
      ).end(buffer);
    });

    return NextResponse.json({ url: (result as any).secure_url });
  } catch (error) {
    logger.error({ error }, 'Error uploading to Cloudinary');
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
