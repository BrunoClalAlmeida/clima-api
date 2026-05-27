const axios = require('axios');
const BASE = 'https://brasilapi.com.br/api/cptec/v1';

async function buscarCidadePorNome(nome) {
  const url = BASE + '/cidade/' + encodeURIComponent(nome);
  const resp = await axios.get(url, { timeout: 10000 });
  return resp.data;
}

async function previsaoPorId(id) {
  const url = BASE + '/clima/previsao/' + id;
  const resp = await axios.get(url, { timeout: 10000 });
  return resp.data;
}

module.exports = { buscarCidadePorNome, previsaoPorId };
