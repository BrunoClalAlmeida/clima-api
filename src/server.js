const app = require('./app');
const PORT = 3000;
app.listen(PORT, () => {
  console.log('API rodando em http://localhost:' + PORT);
  console.log('Health: http://localhost:' + PORT + '/api/v1/health');
});
