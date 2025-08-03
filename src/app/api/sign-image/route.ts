// src/app/api/sign-image/route.ts

import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
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
      process.env.CLOUDINARY_API_SECRET!
    );

    return NextResponse.json({
      signature,
      timestamp,
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      folder,
    });
  } catch (error) {
    console.error("Error generating Cloudinary signature:", error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}