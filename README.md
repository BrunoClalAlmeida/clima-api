# API de Agregação de Dados Climáticos e Geográficos

Trabalho da disciplina **Técnicas de Integração de Sistemas (N703)**.

API REST que integra dados geográficos (IBGE via Brasil API) e climáticos (CPTEC + Open-Meteo) a partir do nome de uma cidade brasileira.

## Integrantes

- Arthur Alves Damasceno — 2425112
- Andreza Lívia Martins Rocha — 2415652
- Bruno Clal de Almeida — 2425038
- Laís Dantas Ferreira — 2418863
- Cristiano da Costa Silva — 2415527

## Tecnologias

- Node.js + Express
- Axios (consumo de APIs externas)
- Jest + Supertest (testes automatizados)

## Pré-requisitos

- Node.js versão 18 ou superior
- npm

## Como executar

```bash
git clone https://github.com/BrunoClalAlmeida/clima-api.git
cd clima-api
npm install
npm start
```

A API ficará disponível em **http://localhost:3000**.

Para abrir o front-end de testes, acesse http://localhost:3000 no navegador.

## Endpoints

### Health Check
```
GET /api/v1/health
```

### Consulta climática por cidade
```
GET /api/v1/clima/{nome_cidade}
```
Exemplo: `/api/v1/clima/Fortaleza`

### Listagem de cidades por estado
```
GET /api/v1/cidades/{sigla_uf}?limite=10
```
Exemplo: `/api/v1/cidades/CE?limite=5`

## Códigos de erro

| Código HTTP | Descrição |
|-------------|-----------|
| 400 | Entrada inválida |
| 404 | Cidade ou UF não encontrada |
| 503 | Serviço externo indisponível |

## Executar os testes

```bash
npm test
```

## APIs externas utilizadas

- **Brasil API (IBGE):** https://brasilapi.com.br/docs#tag/IBGE
- **Brasil API (CPTEC):** https://brasilapi.com.br/docs#tag/CPTEC
- **Open-Meteo:** https://open-meteo.com/en/docs

## Fluxo de integração

1. O usuário informa apenas o nome da cidade
2. A API consulta o geocoding (Open-Meteo) para obter UF, latitude e longitude dinamicamente
3. Tenta obter a previsão via CPTEC (Brasil API) usando o nome da cidade
4. Caso o CPTEC falhe, usa o Open-Meteo Forecast com as coordenadas obtidas
5. Retorna a resposta agregada e padronizada em JSON

## Coleção Postman

A coleção com todos os endpoints está em `docs/postman_collection.json`. Importe no Postman para testar.
