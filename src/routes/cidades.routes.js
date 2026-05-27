const express = require('express');
const router = express.Router();
const { erroResposta } = require('../utils/errors');
const ibge = require('../services/ibge.service');

router.get('/:sigla_uf', async (req, res) => {
  const uf = req.params.sigla_uf;

  if (!uf || !/^[A-Za-z]{2}$/.test(uf)) {
    return erroResposta(res, 400, 'SIGLA_UF_INVALIDA',
      'A sigla do estado deve conter exatamente 2 letras',
      { sigla_uf_informada: uf });
  }

  let limite = parseInt(req.query.limite, 10);
  if (isNaN(limite) || limite < 1) limite = 10;
  if (limite > 100) limite = 100;

  try {
    const municipios = await ibge.listarMunicipiosPorUF(uf);
    const cidades = municipios.slice(0, limite).map(m => ({ nome: m.nome }));
    return res.status(200).json({
      uf: uf.toUpperCase(),
      quantidade_retornada: cidades.length,
      cidades: cidades,
      consultado_em: new Date().toISOString()
    });
  } catch (err) {
    if (err.response && err.response.status === 404) {
      return erroResposta(res, 404, 'UF_NAO_ENCONTRADA',
        'Estado com a sigla informada nao foi encontrado',
        { sigla_uf_informada: uf });
    }
    return erroResposta(res, 503, 'SERVICO_EXTERNO_INDISPONIVEL',
      'Nao foi possivel obter dados do servico externo. Tente novamente em alguns instantes',
      { servico: 'Brasil API - IBGE' });
  }
});

module.exports = router;
