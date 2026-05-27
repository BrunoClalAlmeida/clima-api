function erroResposta(res, status, codigo, mensagem, extra) {
  if (!extra) extra = {};
  return res.status(status).json(Object.assign({ erro: true, codigo: codigo, mensagem: mensagem }, extra));
}
module.exports = { erroResposta };
