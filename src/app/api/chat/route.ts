// src/app/api/chat/route.ts
import { google } from '@google/generative-ai';
import { GoogleGenerativeAIStream, Message, streamToResponse } from 'ai';
import { myTravelSDK } from '@/lib/myTravelSDK';

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

// Define the tools the AI can call
const tools = {
  searchTransport: {
    description: 'Search for transportation options like flights or buses to a destination on a specific date.',
    parameters: {
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
    },
    function: async ({ destination, date }: { destination: string; date: string }) => {
      return await myTravelSDK.searchTransport({ destination, date });
    },
  },
  bookAccommodation: {
    description: 'Book a place to stay, like a hotel or villa, in a specific location for given dates.',
    parameters: {
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
    },
    function: async ({ location, checkIn, checkOut }: { location: string; checkIn: string; checkOut: string }) => {
      return await myTravelSDK.bookAccommodation({ location, checkIn, checkOut });
    },
  },
  findDining: {
    description: 'Find dining recommendations for a specific type of cuisine in a certain area.',
    parameters: {
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
    },
    function: async ({ cuisine, area }: { cuisine: string; area: string }) => {
      return await myTravelSDK.findDining({ cuisine, area });
    },
  },
};

const genAI = new google.generativeai.GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

export async function POST(req: Request) {
  const { messages }: { messages: Message[] } = await req.json();

  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    // @ts-ignore - The `tools` property is not yet in the official SDK types
    tools: tools,
  });

  const stream = await model.generateContentStream({
    contents: messages.map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.content }],
    })),
  });

  const aiStream = GoogleGenerativeAIStream(stream);
  return streamToResponse(aiStream);
}
