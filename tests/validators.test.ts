import { describe, expect, it } from 'vitest';
import { postBodySchema, bookingRequestSchema } from '@/lib/validators';

describe('validators', () => {
  it('rejects empty community posts', () => {
    const result = postBodySchema.safeParse({ content: '', imageUrls: [] });
    expect(result.success).toBe(false);
  });

  it('accepts valid booking ranges', () => {
    const result = bookingRequestSchema.safeParse({
      listingId: 'cku2exampleid1234567890',
      startDate: new Date('2026-01-10'),
      endDate: new Date('2026-01-12'),
    });
    expect(result.success).toBe(true);
  });
});
