import type { APIRoute } from 'astro';
import { SITE_MODE } from 'astro:env/server';
import { getRobotsContent } from '../config/site';

export const prerender = true;

export const GET: APIRoute = () => {
  const content = getRobotsContent(SITE_MODE ?? 'staging');
  return new Response(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
