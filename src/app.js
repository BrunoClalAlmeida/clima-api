const express = require('express');
const cors = require('cors');
const path = require('path');

const healthRoutes = require('./routes/health.routes');
const climaRoutes = require('./routes/clima.routes');
const cidadesRoutes = require('./routes/cidades.routes');

const app = express();
app.use(cors());
app.use(express.json());

// Servir arquivos estaticos do front (public/)
app.use(express.static(path.join(__dirname, '..', 'public')));

// Garantir UTF-8 nas respostas JSON da API
app.use('/api', (req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});

app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/clima', climaRoutes);
app.use('/api/v1/cidades', cidadesRoutes);

// 404 padrao para rotas /api inexistentes
app.use('/api', (req, res) => {
  res.status(404).json({
    erro: true,
    codigo: 'ROTA_NAO_ENCONTRADA',
    mensagem: 'A rota solicitada nao existe',
    rota: req.originalUrl
  });
});

module.exports = app;
