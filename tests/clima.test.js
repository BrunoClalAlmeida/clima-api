const request = require('supertest');
const app = require('../src/app');

describe('Endpoint Clima', () => {
  test('retorna dados climaticos para cidade valida', async () => {
    const res = await request(app).get('/api/v1/clima/Fortaleza');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('nome');
    expect(res.body).toHaveProperty('clima');
    expect(res.body.clima).toHaveProperty('temperatura_min');
    expect(res.body.clima).toHaveProperty('temperatura_max');
  }, 30000);

  test('retorna 404 para cidade inexistente', async () => {
    const res = await request(app).get('/api/v1/clima/XyzNaoExisteCidade123');
    expect(res.status).toBe(404);
    expect(res.body.erro).toBe(true);
    expect(res.body.codigo).toBe('CIDADE_NAO_ENCONTRADA');
  }, 30000);

  test('retorna 400 para nome muito curto', async () => {
    const res = await request(app).get('/api/v1/clima/X');
    expect(res.status).toBe(400);
    expect(res.body.codigo).toBe('NOME_INVALIDO');
  });
});
