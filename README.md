<p align="center">

  <!-- Framework principal -->
  <a href="https://nuxt.com/">
    <img src="https://img.shields.io/badge/-Nuxt.js-00C58E?style=flat-square&logo=nuxt.js&logoColor=white" alt="Nuxt.js" />
  </a>
  <a href="https://vuejs.org/">
    <img src="https://img.shields.io/badge/-Vue.js-4FC08D?style=flat-square&logo=vue.js&logoColor=white" alt="Vue.js" />
  </a>
  
  <!-- UI Framework -->
  <a href="https://vuetifyjs.com/">
    <img src="https://img.shields.io/badge/-Vuetify-1867C0?style=flat-square&logo=vuetify&logoColor=white" alt="Vuetify" />
  </a>

  <!-- Linguagem -->
  <a href="https://www.typescriptlang.org/">
    <img src="https://img.shields.io/badge/-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  </a>

  <!-- Gerenciador de Pacotes -->
  <a href="https://pnpm.io/">
    <img src="https://img.shields.io/badge/-pnpm-F69220?style=flat-square&logo=pnpm&logoColor=white" alt="pnpm" />
  </a>

  <!-- Gerenciamento de Estado -->
  <a href="https://pinia.vuejs.org/">
    <img src="https://img.shields.io/badge/-Pinia-FF7ED2?style=flat-square&logo=pinia&logoColor=white" alt="Pinia" />
  </a>

  <!-- Build Tool -->
  <a href="https://vitejs.dev/">
    <img src="https://img.shields.io/badge/-Vite-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
  </a>

  <!-- Containerização -->
  <a href="https://www.docker.com/">
    <img src="https://img.shields.io/badge/-Docker-2496ED?style=flat-square&logo=docker&logoColor=white" alt="Docker" />
  </a>

  <!-- Status do projeto -->
  <img src="https://img.shields.io/badge/status-Em%20produção-success?style=flat-square" alt="Status do projeto" />

</p>

# Calculadora Renda Fixa

[![Website](https://img.shields.io/website?down_message=offline&label=rendafixa.github.io&up_message=online&url=https%3A%2F%2Frendafixa.github.io)](https://rendafixa.github.io)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=rendafixa_rendafixa.github.io&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=rendafixa_rendafixa.github.io)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=rendafixa_rendafixa.github.io&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=rendafixa_rendafixa.github.io)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=rendafixa_rendafixa.github.io&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=rendafixa_rendafixa.github.io)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=rendafixa_rendafixa.github.io&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=rendafixa_rendafixa.github.io)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=rendafixa_rendafixa.github.io&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=rendafixa_rendafixa.github.io)

## Descrição

A Calculadora Renda Fixa é uma aplicação web desenvolvida para simular investimentos em diferentes modalidades de renda fixa, ajudando investidores a tomar decisões mais informadas sobre onde aplicar seu dinheiro. A plataforma permite simular investimentos em CDB/RDB, LCI/LCA, Poupança e Tesouro Selic, calculando rentabilidade, Iof, Imposto de Renda e comparando resultados.

## Propósito

O objetivo principal deste projeto é fornecer uma ferramenta gratuita e acessível para que pessoas comuns possam:

- Simular investimentos de curto e longo prazo
- Comparar diferentes opções de renda fixa
- Entender o impacto de Imposto de Renda e IOF nas rentabilidades
- Planejar melhor seus investimentos com base em dados reais e projeções

## Funcionalidades

- **Simulação de investimentos**: Calcule o retorno de investimentos em diferentes modalidades de renda fixa
- **Comparação de modalidades**: Compare simultaneamente diferentes opções de investimento
- **Cálculo de tributação**: Inclui cálculo automático de Imposto de Renda e IOF
- **Cálculo de rentabilidade**: Mostra rentabilidade bruta e líquida de cada investimento
- **Interface responsiva**: Funciona em dispositivos móveis, tablets e desktops
- **Cálculos em tempo real**: Atualização instantânea dos resultados conforme a alteração dos parâmetros
- **Atualização de índices**: Dados atualizados com as taxas mais recentes do mercado

## Tecnologias Utilizadas

- **[Nuxt.js](https://nuxt.com/)** - Framework Vue.js para aplicações universais
- **[Vue.js](https://vuejs.org/)** - Framework JavaScript para construção de interfaces
- **[Vuetify](https://vuetifyjs.com/)** - Biblioteca de componentes UI baseada no Material Design
- **[TypeScript](https://www.typescriptlang.org/)** - Superconjunto tipado do JavaScript
- **[Pinia](https://pinia.vuejs.org/)** - Gerenciamento de estado para Vue.js
- **[Vite](https://vitejs.dev/)** - Ferramenta de build rápida para projetos modernos
- **[pnpm](https://pnpm.io/)** - Gerenciador de pacotes rápido e eficiente
- **[Material Design Icons](https://materialdesignicons.com/)** - Conjunto de ícones

## Estrutura do Projeto

```
rendafixa.github.io/
├── app/
│   ├── assets/           # Arquivos estáticos (imagens, estilos, fonts)
│   ├── components/       # Componentes reutilizáveis da aplicação
│   ├── layouts/          # Layouts da aplicação (ex: default, error)
│   ├── pages/            # Páginas da aplicação (index.vue, sobre.vue)
│   ├── plugins/          # Plugins Vue.js
│   ├── src/              # Código-fonte adicional
│   └── store/            # Stores do Pinia para gerenciamento de estado
├── public/               # Arquivos estáticos públicos
├── server/               # Código do lado do servidor (se aplicável)
├── .output/              # Arquivos gerados pelo Nuxt (após build)
├── nuxt.config.ts        # Configuração principal do Nuxt
├── package.json          # Dependências e scripts do projeto
├── pnpm-lock.yaml        # Versões exatas das dependências
├── tsconfig.json         # Configuração do TypeScript
├── update-indexes.js     # Script para atualizar índices de rentabilidade
└── README.md             # Documentação do projeto
```

## Docker Setup

A aplicação está configurada para ser executada em contêineres Docker. Para executar a aplicação com Docker:

```bash
# Construir e iniciar os contêineres
docker-compose up -d

# A aplicação estará disponível em:
# - http://localhost:3000 (acesso direto)
# - http://localhost (via proxy nginx)
```

Para mais detalhes sobre a configuração Docker, veja o arquivo `DOCKER.md`.

## Setup

Make sure to install the dependencies:

```bash
pnpm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
pnpm dev
```

## Production

Build the application for production:

```bash
pnpm build
```

Locally preview production build:

```bash
pnpm preview
```

## Atualização de Dados

O projeto inclui um script para atualizar automaticamente os índices de rentabilidade:

```bash
pnpm run update-indexes
```

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests para melhorar a aplicação.

## Licença

Este projeto está licenciado sob os termos da licença MIT - veja o arquivo LICENSE para detalhes.

## Autor

Este projeto foi desenvolvido para auxiliar investidores brasileiros na simulação e comparação de investimentos em renda fixa.
