# Clima API - N703

API REST de agregacao de dados climaticos e geograficos de cidades brasileiras, utilizando CPTEC, Open-Meteo e Brasil API/IBGE.

## Sobre o Projeto

Trabalho da disciplina N703 que consiste em uma API REST que recebe o nome de uma cidade brasileira e retorna dados climaticos e geograficos combinados de multiplas fontes externas.

## Tecnologias

- Node.js (>= 18)
- Express - Framework web
- Axios - Cliente HTTP
- Jest + Supertest - Testes automatizados
- CORS - Habilitado para todas as origens

## Integrantes

| Nome | Matricula |
|------|-----------|
| Arthur Alves Damasceno | 2425112 |
| Andreza Livia Martins Rocha | 2415652 |
| Bruno Claudio de Almeida | 2425038 |
| Lais Dantas Ferreira | 2418863 |
| Cristiano da Costa Silva | 2415527 |
| Isadora Furtado Menezes | 2415625 |

## Instalacao

    git clone https://github.com/BrunoClalAlmeida/clima-api.git
    cd clima-api
    npm install
    npm start

A API estara disponivel em http://localhost:3000

## Endpoints

### Health Check
GET /api/v1/health - Retorna status, versao e timestamp da API.

### Clima por Cidade
GET /api/v1/clima/{nome_cidade}
Exemplo: /api/v1/clima/Fortaleza
Retorna: nome, estado, temperatura minima e maxima, condicao, unidades e horario da consulta.

### Cidades por Estado
GET /api/v1/cidades/{sigla_uf}?limite=10
Exemplo: /api/v1/cidades/CE?limite=5
Retorna lista de cidades do estado informado. Parametro limite opcional (padrao 10, maximo 100).

## Codigos de Erro

| Codigo HTTP | Erro | Descricao |
|-------------|------|-----------|
| 400 | NOME_INVALIDO / SIGLA_UF_INVALIDA | Entrada invalida |
| 404 | CIDADE_NAO_ENCONTRADA / UF_NAO_ENCONTRADA | Recurso nao encontrado |
| 503 | SERVICO_EXTERNO_INDISPONIVEL | Falha em API externa |

## Testes

    npm test

## Estrutura

    clima-api/
    |-- src/
    |   |-- routes/
    |   |-- services/
    |   |-- utils/
    |   |-- app.js
    |   |-- server.js
    |-- tests/
    |-- docs/
    |   |-- postman_collection.json
    |-- public/
    |-- INTEGRANTES.md
    |-- README.md
    |-- package.json

## Postman

Importe a colecao em docs/postman_collection.json no Postman para testar todos os endpoints.

## Entrega

Disciplina N703 - Prazo: 05/06/2026 23:59 (AVA)