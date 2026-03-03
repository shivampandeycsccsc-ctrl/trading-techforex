import { z } from 'zod';
import { insertProductSchema, products, insertContactSchema, contacts, insertChallengeEntrySchema, challengeEntries, insertCopyTradingEntrySchema, copyTradingChallengeEntries } from './schema';

export * from './schema';

export const api = {
  products: {
    list: {
      method: 'GET' as const,
      path: '/api/products',
      responses: {
        200: z.array(z.custom<typeof products.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/products/:id',
      responses: {
        200: z.custom<typeof products.$inferSelect>(),
        404: z.object({ message: z.string() }),
      },
    },
  },
  contact: {
    create: {
      method: 'POST' as const,
      path: '/api/contact',
      input: insertContactSchema,
      responses: {
        201: z.custom<typeof contacts.$inferSelect>(),
        400: z.object({ message: z.string() }),
      },
    },
  },
  challengeEntry: {
    create: {
      method: 'POST' as const,
      path: '/api/challenge-entry',
      input: insertChallengeEntrySchema,
      responses: {
        201: z.custom<typeof challengeEntries.$inferSelect>(),
        400: z.object({ message: z.string() }),
      },
    },
  },
  copyChallenge: {
    create: {
      method: 'POST' as const,
      path: '/api/copy-challenge-entry',
      input: insertCopyTradingEntrySchema,
      responses: {
        201: z.custom<typeof copyTradingChallengeEntries.$inferSelect>(),
        400: z.object({ message: z.string() }),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
