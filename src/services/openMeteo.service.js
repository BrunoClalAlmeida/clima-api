const axios = require('axios');
const GEO = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST = 'https://api.open-meteo.com/v1/forecast';

async function geocodificar(nome) {
  const resp = await axios.get(GEO, {
    params: { name: nome, count: 5, language: 'pt', format: 'json', country: 'BR' },
    timeout: 10000
  });
  return resp.data.results || [];
}

async function previsaoPorCoordenadas(lat, lon) {
  const resp = await axios.get(FORECAST, {
    params: {
      latitude: lat,
      longitude: lon,
      daily: 'temperature_2m_max,temperature_2m_min,weathercode',
      timezone: 'America/Sao_Paulo',
      forecast_days: 1
    },
    timeout: 10000
  });
  return resp.data;
}

const WEATHER_CODES = {
  0: 'Ceu limpo',
  1: 'Predominantemente limpo',
  2: 'Parcialmente nublado',
  3: 'Nublado',
  45: 'Neblina',
  48: 'Neblina com geada',
  51: 'Garoa leve',
  53: 'Garoa moderada',
  55: 'Garoa densa',
  61: 'Chuva leve',
  63: 'Chuva moderada',
  65: 'Chuva forte',
  71: 'Neve leve',
  73: 'Neve moderada',
  75: 'Neve forte',
  80: 'Pancadas de chuva leves',
  81: 'Pancadas de chuva moderadas',
  82: 'Pancadas de chuva fortes',
  95: 'Trovoada',
  96: 'Trovoada com granizo leve',
  99: 'Trovoada com granizo forte'
};

function descricao(code) {
  return WEATHER_CODES[code] || 'Indefinido';
}

module.exports = { geocodificar, previsaoPorCoordenadas, descricao };
