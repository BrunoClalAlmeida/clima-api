const axios = require('axios');
const BASE = 'https://brasilapi.com.br/api/ibge';

async function listarMunicipiosPorUF(uf) {
  const url = BASE + '/municipios/v1/' + uf.toUpperCase();
  const resp = await axios.get(url, { timeout: 10000 });
  return resp.data;
}

module.exports = { listarMunicipiosPorUF };
