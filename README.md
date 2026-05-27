# API de Agregacao de Dados Climaticos e Geograficos

Trabalho da disciplina Tecnicas de Integracao de Sistemas (N703).

API REST que integra dados geograficos (IBGE via Brasil API) e climaticos (CPTEC + Open-Meteo) a partir do nome de uma cidade brasileira.

## Tecnologias
- Node.js + Express
- Axios (consumo de APIs externas)
- Jest + Supertest (testes automatizados)

## Como executar

    npm install
    npm start

A API ficara disponivel em http://localhost:3000

## Endpoints

- GET /api/v1/health
- GET /api/v1/clima/{nome_cidade}  -> Exemplo: /api/v1/clima/Fortaleza
- GET /api/v1/cidades/{sigla_uf}?limite=10  -> Exemplo: /api/v1/cidades/CE?limite=5

## Testes

    npm test

## APIs externas utilizadas
- Brasil API (IBGE e CPTEC): https://brasilapi.com.br
- Open-Meteo: https://open-meteo.com

## Fluxo de integracao
1. Usuario informa o nome da cidade
2. API consulta o geocoding (Open-Meteo) para obter UF, latitude e longitude
3. Tenta obter previsao via CPTEC (Brasil API) usando o nome da cidade
4. Caso CPTEC falhe, usa Open-Meteo Forecast com as coordenadas obtidas
5. Retorna resposta agregada e padronizada em JSON
