import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveApiEndpoint } from '../src/apiEndpoint.js';

const production = 'https://dolphinai-api-c2a8ezgdctakh9g0.centralus-01.azurewebsites.net';
test('development and previews cannot silently use production', () => {
  for (const env of [{}, { DEV: true }, { VITE_DEPLOYMENT_ENV: 'preview' }]) {
    assert.throws(() => resolveApiEndpoint('/api/auth/login', env));
  }
});
test('previews reject the production endpoint even when explicitly configured', () => {
  assert.throws(() => resolveApiEndpoint('/api/auth/login', {
    VITE_DEPLOYMENT_ENV: 'preview', VITE_API_URL: `${production.toUpperCase()}/`,
  }));
});
test('a production deployment keeps the current endpoint', () => {
  assert.equal(resolveApiEndpoint('/api/auth/login', { VITE_DEPLOYMENT_ENV: 'production' }),
    `${production}/api/auth/login`);
});
test('a preview uses its separate explicit HTTPS endpoint', () => {
  assert.equal(resolveApiEndpoint('/api/auth/signup', {
    VITE_DEPLOYMENT_ENV: 'preview', VITE_API_URL: 'https://preview.example.test/',
  }), 'https://preview.example.test/api/auth/signup');
});
test('HTTP is restricted to local development loopback', () => {
  assert.equal(resolveApiEndpoint('/api/classify', { DEV: true, VITE_API_URL: 'http://localhost:8000' }),
    'http://localhost:8000/api/classify');
  for (const env of [
    { DEV: true, VITE_API_URL: 'http://remote.example.test' },
    { VITE_DEPLOYMENT_ENV: 'preview', VITE_API_URL: 'http://localhost:8000' },
  ]) assert.throws(() => resolveApiEndpoint('/api/classify', env));
});
test('embedded credentials, query strings and alternate request paths are rejected', () => {
  for (const address of ['https://user:pass@preview.example.test', 'https://preview.example.test/?token=x']) {
    assert.throws(() => resolveApiEndpoint('/api/classify', { VITE_API_URL: address }));
  }
  assert.throws(() => resolveApiEndpoint('https://other.example.test', { VITE_DEPLOYMENT_ENV: 'production' }));
});
