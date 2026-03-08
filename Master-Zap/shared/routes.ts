import { z } from 'zod';
import { contacts, messages, citations } from './schema';

export const api = {
  contacts: {
    list: {
      method: 'GET' as const,
      path: '/api/contacts' as const,
      responses: {
        200: z.array(z.custom<typeof contacts.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/contacts/:id' as const,
      responses: {
        200: z.custom<typeof contacts.$inferSelect>(),
        404: z.object({ message: z.string() }),
      },
    }
  },
  messages: {
    list: {
      method: 'GET' as const,
      path: '/api/contacts/:contactId/messages' as const,
      responses: {
        200: z.array(z.custom<typeof messages.$inferSelect>()),
      },
    },
  },
  citations: {
    list: {
      method: 'GET' as const,
      path: '/api/citations' as const,
      responses: {
        200: z.array(z.custom<typeof citations.$inferSelect>()),
      },
    }
  }
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
