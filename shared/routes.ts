import { z } from 'zod';
import { insertTrackingLinkSchema, trackingLinks, captures } from './schema';

export const errorSchemas = {
  validation: z.object({ message: z.string(), field: z.string().optional() }),
  notFound: z.object({ message: z.string() }),
  internal: z.object({ message: z.string() }),
};

export const api = {
  links: {
    list: {
      method: 'GET' as const,
      path: '/api/links' as const,
      responses: {
        200: z.array(z.custom<typeof trackingLinks.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/links' as const,
      input: insertTrackingLinkSchema,
      responses: {
        201: z.custom<typeof trackingLinks.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/links/:token' as const,
      responses: {
        200: z.custom<typeof trackingLinks.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    }
  },
  captures: {
    list: {
      method: 'GET' as const,
      path: '/api/links/:linkId/captures' as const,
      responses: {
        200: z.array(z.custom<typeof captures.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/links/:linkId/captures' as const,
      input: z.object({
        ipAddress: z.string().optional(),
        userAgent: z.string().optional(),
        latitude: z.string().optional(),
        longitude: z.string().optional(),
        accuracy: z.string().optional(),
        imageData: z.string().optional(),
      }),
      responses: {
        201: z.custom<typeof captures.$inferSelect>(),
        400: errorSchemas.validation,
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
