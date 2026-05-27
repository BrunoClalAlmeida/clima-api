const express = require('express');
const router = express.Router();
const { erroResposta } = require('../utils/errors');
const cptec = require('../services/cptec.service');
const openMeteo = require('../services/openMeteo.service');

router.get('/:nome_cidade', async (req, res) => {
  const nome = req.params.nome_cidade;

  if (!nome || nome.trim().length < 2) {
    return erroResposta(res, 400, 'NOME_INVALIDO',
      'O nome da cidade deve conter pelo menos 2 caracteres',
      { nome_informado: nome });
  }

  try {
    const resultados = await openMeteo.geocodificar(nome);
    if (!resultados.length) {
      return erroResposta(res, 404, 'CIDADE_NAO_ENCONTRADA',
        'Nenhuma cidade encontrada com o nome informado',
        { nome_informado: nome });
    }
    const cidade = resultados[0];
    const estado = cidade.admin1 || '';

    let temp_min, temp_max, condicao;

    try {
      const cidades = await cptec.buscarCidadePorNome(cidade.name);
      if (cidades && cidades.length > 0) {
        const previsao = await cptec.previsaoPorId(cidades[0].id);
        if (previsao && previsao.clima && previsao.clima[0]) {
          temp_min = previsao.clima[0].min;
          temp_max = previsao.clima[0].max;
          condicao = previsao.clima[0].condicao_desc || previsao.clima[0].condicao;
        }
      }
    } catch (e) {
      // fallback abaixo
    }

    if (temp_min === undefined) {
      try {
        const prev = await openMeteo.previsaoPorCoordenadas(cidade.latitude, cidade.longitude);
        temp_min = prev.daily.temperature_2m_min[0];
        temp_max = prev.daily.temperature_2m_max[0];
        condicao = openMeteo.descricao(prev.daily.weathercode[0]);
      } catch (e) {
        return erroResposta(res, 503, 'SERVICO_EXTERNO_INDISPONIVEL',
          'Nao foi possivel obter dados do servico externo. Tente novamente em alguns instantes',
          { servico: 'Open-Meteo' });
      }
    }

    return res.status(200).json({
      nome: cidade.name,
      estado: estado,
      latitude: cidade.latitude,
      longitude: cidade.longitude,
      clima: {
        temperatura_min: Math.round(temp_min),
        temperatura_max: Math.round(temp_max),
        condicao: condicao,
        unidades: { temperatura: 'C' }
      },
      consultado_em: new Date().toISOString()
    });
  } catch (err) {
    return erroResposta(res, 503, 'SERVICO_EXTERNO_INDISPONIVEL',
      'Nao foi possivel obter dados do servico externo. Tente novamente em alguns instantes',
      { servico: 'Geocoding' });
  }
});

module.exports = router;
