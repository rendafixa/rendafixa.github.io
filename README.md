# Calculadora Renda Fixa

[![Nuxt.js](https://img.shields.io/badge/Nuxt-002E3B?style=for-the-badge&logo=nuxt.js&logoColor=#00DC82)](https://nuxt.com/)
[![Vue.js](https://img.shields.io/badge/Vue.js-36D8B7?style=for-the-badge&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vuetify](https://img.shields.io/badge/Vuetify-1867C0?style=for-the-badge&logo=vuetify&logoColor=white)](https://vuetifyjs.com/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

[![Website](https://img.shields.io/website?down_message=offline&label=rendafixa.github.io&up_message=online&url=https%3A%2F%2Frendafixa.github.io)](https://rendafixa.github.io)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=rendafixa_rendafixa.github.io&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=rendafixa_rendafixa.github.io)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=rendafixa_rendafixa.github.io&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=rendafixa_rendafixa.github.io)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=rendafixa_rendafixa.github.io&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=rendafixa_rendafixa.github.io)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=rendafixa_rendafixa.github.io&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=rendafixa_rendafixa.github.io)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=rendafixa_rendafixa.github.io&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=rendafixa_rendafixa.github.io)

## 📋 Sobre o Projeto

A Calculadora Renda Fixa é uma aplicação web desenvolvida para auxiliar investidores na simulação de rentabilidade de diferentes tipos de investimentos em renda fixa no Brasil. A ferramenta permite comparar diversos produtos financeiros como CDB, LCI, LCA, Poupança, Letras de Crédito e Tesouro Direto, levando em consideração as taxas de juros, impostos e prazos de aplicação.

## 🎯 Propósito

O propósito deste projeto é:

- **Educar investidores** sobre os diferentes tipos de investimentos de renda fixa
- **Facilitar a comparação** entre diferentes opções de investimento
- **Promover a literacia financeira** através de simulações práticas
- **Fornecer ferramenta gratuita** para simulação de investimentos
- **Demonstrar os efeitos dos impostos** na rentabilidade final dos investimentos

## 🛠️ Tecnologias Utilizadas

- **[Nuxt.js](https://nuxt.com/)** - Framework Vue.js para desenvolvimento universal
- **[Vue.js](https://vuejs.org/)** - Framework JavaScript progressivo para interfaces de usuário
- **[TypeScript](https://www.typescriptlang.org/)** - Superset do JavaScript que adiciona tipagem estática
- **[Vuetify](https://vuetifyjs.com/)** - Biblioteca de componentes UI baseada no Material Design
- **[Pinia](https://pinia.vuejs.org/)** - Store para gerenciamento de estado do Vue.js
- **[Vite](https://vitejs.dev/)** - Build tool rápido e leve para desenvolvimento front-end
- **[Axios](https://axios-http.com/)** - Cliente HTTP baseado em Promises para browser e node.js
- **[PNPM](https://pnpm.io/)** - Gerenciador de pacotes rápido, confiável e eficiente

## 🏗️ Estrutura do Projeto

```
rendafixa.github.io/
├── app/
│   ├── assets/           # Arquivos estáticos (imagens, fontes, etc.)
│   ├── components/       # Componentes reutilizáveis
│   │   └── investment/   # Componentes específicos de investimentos
│   ├── layouts/          # Layouts da aplicação
│   ├── pages/            # Páginas da aplicação
│   ├── plugins/          # Plugins do Vue.js
│   ├── src/              # Lógica de negócios (cálculos financeiros)
│   └── store/            # Stores do Pinia
├── public/               # Arquivos públicos e estáticos
├── server/               # APIs server-side (se necessário)
├── test/                 # Arquivos de teste
├── nuxt.config.ts        # Configuração do Nuxt.js
├── package.json          # Dependências e scripts do projeto
├── tsconfig.json         # Configuração do TypeScript
└── update-indexes.js     # Script para atualizar índices econômicos
```

### Principais Componentes

- `InvestmentInput.vue` - Componente para entrada de dados de investimento
- `InvestmentSimulation.vue` - Componente para simulação e exibição de resultados
- `InvestmentResult.vue` - Componente para exibição dos resultados de cada tipo de investimento
- `InvestmentInfo.vue` - Componente com informações educativas sobre os investimentos

### Lógica de Negócios

- `src/finance.ts` - Funções genéricas financeiras (IR, IOF, juros compostos)
- `src/cdb.ts` - Cálculos específicos para CDB
- `src/lcx.ts` - Cálculos específicos para LCI/LCA
- `src/poupanca.ts` - Cálculos específicos para Poupança
- `src/tesouro.ts` - Cálculos específicos para Tesouro Direto

### Stores

- `store/investment.ts` - Gerencia o estado dos dados de investimento
- `store/history.ts` - Gerencia o histórico de simulações (se implementado)

## 🚀 Funcionalidades

- **Simulação de investimentos** em diferentes produtos de renda fixa
- **Comparação de rentabilidade** entre diferentes tipos de investimento
- **Cálculo de impostos** (IR e IOF) conforme a legislação vigente
- **Cálculo de juros compostos** com precisão matemática
- **Responsividade** para uso em dispositivos móveis e desktop
- **Interface intuitiva** com componentes de UI baseados no Material Design
- **Informações educativas** sobre como cada tipo de investimento funciona

## 📊 Tipos de Investimentos Suportados

- **Poupança** - Com isenção de IR e IOF
- **CDB (Certificado de Depósito Bancário)** - Com IR regressivo e IOF regressivo
- **LCI (Letra de Crédito Imobiliário)** - Isento de IR e IOF
- **LCA (Letra de Crédito do Agronegócio)** - Isento de IR e IOF
- **LC (Letra de Crédito)** - Isento de IR e IOF
- **Tesouro Direto** - Com IR regressivo e IOF no primeiro dia

## 📈 Índices Econômicos

O projeto utiliza dados reais de:

- **Taxa DI (Depósito Interfinanceiro)** - Referência para CDI
- **Taxa SELIC (Sistema Especial de Liquidação e Custódia)** - Referência para Tesouro Selic
- **Taxa da Poupança** - Referência para rendimento da poupança

## 📋 Setup Local

### Pré-requisitos

- Node.js (v16 ou superior)
- PNPM (gerenciador de pacotes)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/rendafixa/rendafixa.github.io.git

# Navegue até o diretório do projeto
cd rendafixa.github.io

# Instale as dependências
pnpm install
```

### Desenvolvimento

```bash
# Inicie o servidor de desenvolvimento
pnpm dev
```

O aplicativo estará disponível em `http://localhost:3000`

### Produção

```bash
# Build para produção
pnpm build

# Ou gerar versão estática
pnpm generate

# Visualizar build de produção localmente
pnpm preview
```

### Atualizar Índices Econômicos

```bash
# Atualize os dados econômicos
pnpm run update-indexes
```

## 🧪 Testes

```bash
# Execute os testes
pnpm test
```

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests para melhorar o projeto.

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona NovaFeature'`)
4. Push para a branch (`git push origin feature/NovaFeature`)
5. Abra um pull request

## 📄 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Contato

Para dúvidas, sugestões ou suporte, abra uma [issue](https://github.com/rendafixa/rendafixa.github.io/issues) no repositório.