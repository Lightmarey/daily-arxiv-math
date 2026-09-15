import { Miniflare } from 'miniflare';

export const LOCAL_D1_ID = '00000000-0000-4000-8000-000000000000';
export async function localD1() {
  const miniflare = new Miniflare({
    modules: true,
    script: 'export default { fetch() { return new Response("ok") } }',
    d1Databases: { DB: LOCAL_D1_ID },
    d1Persist: '.wrangler/state/v3/d1',
  });
  return { miniflare, db: await miniflare.getD1Database('DB') };
}
