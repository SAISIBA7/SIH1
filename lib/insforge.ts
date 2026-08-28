import { createClient } from '@insforge/sdk';

const baseUrl =
  process.env.NEXT_PUBLIC_INSFORGE_URL || 'https://856k6wi6.us-east.insforge.app';
const anonKey =
  process.env.NEXT_PUBLIC_INSFORGE_API_KEY ||
  process.env.INSFORGE_API_KEY ||
  'ik_91ea0e539d3016d1f957b64d71322dcf';

export const insforge = createClient({
  baseUrl,
  anonKey,
});

export default insforge;
