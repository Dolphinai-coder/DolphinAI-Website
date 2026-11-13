const PRODUCTION_API = 'https://dolphinai-api-c2a8ezgdctakh9g0.centralus-01.azurewebsites.net';

export function resolveApiEndpoint(path, env = {}) {
  const production = env.VITE_DEPLOYMENT_ENV === 'production';
  const configured = String(env.VITE_API_URL || '').trim();
  if (!production && !configured) throw new Error('Service unavailable in this environment.');

  const base = new URL(configured || PRODUCTION_API);
  const loopback = ['localhost', '127.0.0.1', '[::1]'].includes(base.hostname);
  if (base.protocol !== 'https:' && !(env.DEV && loopback && base.protocol === 'http:')) {
    throw new Error('The service requires a secure connection.');
  }
  if (base.username || base.password || base.search || base.hash) {
    throw new Error('Invalid service address.');
  }
  if (!production && base.hostname === new URL(PRODUCTION_API).hostname) {
    throw new Error('Production service unavailable in this environment.');
  }
  if (!path.startsWith('/api/') || path.includes('\\')) throw new Error('Invalid service path.');
  return `${base.href.replace(/\/$/, '')}${path}`;
}

export function apiEndpoint(path) {
  return resolveApiEndpoint(path, import.meta.env);
}
