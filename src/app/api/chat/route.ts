// src/app/api/chat/route.ts
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { convertToCoreMessages, jsonSchema, streamText } from 'ai';
import { createTravelSDK } from '@/lib/myTravelSDK';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { aiChatSchema } from '@/lib/validators';
import { NextResponse } from 'next/server';
import { serverEnv } from '@/env/server';
import { logger } from '@/lib/logger';

const google = serverEnv.GOOGLE_API_KEY
  ? createGoogleGenerativeAI({
      apiKey: serverEnv.GOOGLE_API_KEY,
    })
  : null;

export async function POST(req: Request) {
  if (!google) {
    return NextResponse.json({ error: 'AI assistant is not configured.' }, { status: 503 });
  }

  const parsed = aiChatSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload', details: parsed.error.flatten() }, { status: 400 });
  }

  const session = await getServerSession(authOptions);
  const sdk = createTravelSDK(session);
  const tools = {
    searchTransport: {
      description: 'Search for transportation options like flights or buses to a destination on a specific date.',
      inputSchema: jsonSchema({
        type: 'object',
        properties: {
          destination: {
            type: 'string',
            description: 'The city or location to travel to.',
          },
          date: {
            type: 'string',
            description: 'The date of travel, e.g., "2025-12-31".',
          },
        },
        required: ['destination', 'date'],
      }),
      execute: sdk.searchTransport,
    },
    bookAccommodation: {
      description: 'Book a place to stay, like a hotel or villa, in a specific location for given dates.',
      inputSchema: jsonSchema({
        type: 'object',
        properties: {
          location: {
            type: 'string',
            description: 'The city or area for the accommodation.',
          },
          checkIn: {
            type: 'string',
            description: 'The check-in date, e.g., "2025-12-31".',
          },
          checkOut: {
            type: 'string',
            description: 'The check-out date, e.g., "2026-01-02".',
          },
        },
        required: ['location', 'checkIn', 'checkOut'],
      }),
      execute: sdk.bookAccommodation,
    },
    findDining: {
      description: 'Find dining recommendations for a specific type of cuisine in a certain area.',
      inputSchema: jsonSchema({
        type: 'object',
        properties: {
          cuisine: {
            type: 'string',
            description: 'The type of food, e.g., "Vietnamese", "Italian", "seafood".',
          },
          area: {
            type: 'string',
            description: 'The district or neighborhood to search in, e.g., "Ngo Quyen District".',
          },
        },
        required: ['cuisine', 'area'],
      }),
      execute: sdk.findDining,
    },
  } as const;

  try {
    const coreMessages = convertToCoreMessages(parsed.data.messages as any);
    const result = await streamText({
      model: google('gemini-1.5-flash'),
      tools,
      messages: coreMessages,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    logger.error({ error }, 'AI chat failed');
    return NextResponse.json({ error: 'Unable to process assistant request.' }, { status: 500 });
  }
}
