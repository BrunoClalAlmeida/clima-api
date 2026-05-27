const request = require('supertest');
const app = require('../src/app');

describe('Endpoint Cidades e Health', () => {
  test('retorna lista de cidades para UF valida', async () => {
    const res = await request(app).get('/api/v1/cidades/CE?limite=5');
    expect(res.status).toBe(200);
    expect(res.body.uf).toBe('CE');
    expect(Array.isArray(res.body.cidades)).toBe(true);
    expect(res.body.cidades.length).toBeLessThanOrEqual(5);
  }, 30000);

  test('retorna 400 para UF invalida', async () => {
    const res = await request(app).get('/api/v1/cidades/ceara');
    expect(res.status).toBe(400);
    expect(res.body.codigo).toBe('SIGLA_UF_INVALIDA');
  });

  test('health check retorna 200', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
  });
});
