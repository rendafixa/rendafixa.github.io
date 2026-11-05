# Architecture Spec — Comparador de Investimentos em Renda Fixa

## Overview

Reconstruir o projeto como uma SPA estática, mobile-first e responsiva, usando Nuxt 4, Nuxt UI e Pinia. O resultado final substituirá a calculadora atual somente quando todos os recursos, conteúdos educacionais e testes estiverem concluídos.

A mudança é grande o suficiente para exigir evolução interna por marcos. O desenvolvimento ocorrerá na branch `feat/rebuild-investment-comparator`, mantendo a versão pública intacta até a aprovação final. Cada marco deixará uma calculadora funcional na branch, mas não haverá publicação parcial.

A aplicação continuará usando `ssr: false` e `pnpm generate`, portanto não terá API ou backend em produção. Dados do Banco Central e ANBIMA serão coletados antecipadamente pelo workflow do GitHub Actions e incluídos no bundle estático. Isso respeita as limitações de uma [SPA estática do Nuxt](https://nuxt.com/docs/4.x/getting-started/deployment).

O lançamento incluirá:

- Poupança, CDB/RDB/LC, LCI/LCA, Tesouro Prefixado, Tesouro Selic e Tesouro IPCA+.
- Taxas prefixadas, `% CDI` e `IPCA + taxa real`.
- IR, IOF, dias úteis, feriados ANBIMA e aniversários da Poupança.
- Curvas projetadas de Selic e IPCA.
- Ranking, comparações, alertas FGC e faixas de IR.
- Gráficos, referências e detalhamento mensal.
- Links compartilháveis.
- Tema claro/escuro.
- Área educacional completa.
- Sem PDF, white-label, B2B, autenticação ou backend.

## Decisions

| Tema | Decisão |
|---|---|
| Lançamento | Big-bang: todo o desenvolvimento acontece em branch separada; o site público só muda após todos os marcos e critérios de aceite. |
| Estratégia de implementação | Cinco marcos internos, começando por um núcleo simples e utilizável e elevando a complexidade progressivamente. |
| Plataforma | Nuxt 4, Vue 3, Pinia, Nuxt UI e Tailwind CSS 4; SPA estática com `ssr: false`. |
| Interface | Mobile-first, layouts fluidos, componentes Nuxt UI sempre que adequados e componentes próprios quando não houver equivalente. |
| Tema | Claro, escuro e preferência do sistema; escolha persistida no navegador. |
| Precisão | `decimal.js`, com 32 dígitos significativos e arredondamento `ROUND_HALF_UP`; valores monetários são arredondados apenas nas fronteiras de exibição. |
| Datas | `@internationalized/date`, trabalhando com datas civis sem horário; “hoje” é obtido em `America/Sao_Paulo`. |
| Cálculo | Motor TypeScript puro, sem dependência de Nuxt, Vue, Pinia ou browser. |
| Biblioteca financeira | Nenhuma biblioteca genérica de NPV/IRR. Elas não cobrem tributação e produtos brasileiros; as fórmulas serão implementadas e testadas no domínio. |
| Gráficos | Chart.js 4 + `vue-chartjs`, `chartjs-plugin-annotation` e `chartjs-plugin-datalabels`. |
| Tesouro Direto | Simulação até o vencimento, sem marcação a mercado, cupons, spread, corretagem ou taxa de custódia. A limitação será exibida ao usuário. |
| Valor inicial | Um valor global, compartilhado por todos os investimentos da comparação. |
| Datas de rendimento | Período `(data inicial, vencimento]`; o dia da aplicação não rende e o vencimento rende quando for dia útil. |
| Base anual | 252 dias úteis para todos os produtos, exceto Poupança, cuja anualização usa dias corridos e base 365. |
| Projeção | Ligada por padrão; pós-fixados usam curva Selic/Focus, IPCA+ usa projeções anuais Focus. |
| Tributação | IR regressivo e IOF conforme legislação; Poupança e LCI/LCA isentas. |
| FGC | Avaliação simplificada por investimento, sem consolidação por emissor, conglomerado ou limite global de quatro anos. |
| Compartilhamento | Estado compacto e versionado em `?sim=...`, sem persistir dados em servidor. |
| Limites | Até 40 investimentos, nomes de até 60 caracteres, vencimentos dentro de 30 anos e da cobertura disponível de feriados. |
| Educação | Hub completo antes do lançamento, embora produzido progressivamente nos marcos internos. |
| Fora do escopo | PDF, white-label/B2B, login, carteiras persistidas, API, dados intradiários e simulação de venda antecipada de Tesouro. |

## Project Context

### Structure

O projeto atual já segue Nuxt 4 e separa parte da lógica financeira em `app/src/`. A nova arquitetura manterá essa convenção, expandindo-a em módulos menores.

Estado atual confirmado:

- Nuxt `^4.5.2`, Pinia `^4.0.2` e Tailwind CSS 4.
- `ssr: false`, publicação por `pnpm generate`.
- `app/src/` contém cálculos simples de CDB, LCI/LCA, Poupança, prefixados, IR e IOF.
- `app/stores/investment.ts` trabalha com uma única simulação e taxas parcialmente fixas.
- `update-indexes.mjs` atualiza apenas Poupança, CDI e Selic.
- Existem 101 testes passando, além de `lint` e `generate` bem-sucedidos.
- As páginas educacionais atuais serão preservadas em suas URLs para evitar quebrar links existentes.

### Conventions

- TypeScript estrito e módulos com exports nomeados.
- Lógica financeira pura em `app/src/`.
- Pinia armazena somente estado serializável, nunca instâncias `Decimal`.
- Datas atravessam as fronteiras como ISO `YYYY-MM-DD`.
- Percentuais digitados atravessam contratos como strings decimais.
- Valores calculados retornam strings decimais; formatação em BRL ocorre apenas na UI.
- Erros de entrada são resultados de domínio, não exceções.
- Componentes Vue não contêm fórmulas financeiras.
- O comando `pnpm update-indexes` será preservado.
- A sequência de CI permanece `lint → test → generate`.
- Commits da branch seguirão Conventional Commits.

### Dependencies

Dependências adicionadas:

| Pacote | Faixa | Uso |
|---|---:|---|
| `@nuxt/ui` | `^4.10` | Sistema visual, formulários, cards, tabelas, drawers, alerts e tema. A integração oficial está documentada no [módulo Nuxt UI](https://nuxt.com/modules/ui). |
| `@iconify-json/lucide` | major atual compatível | Ícones empacotados localmente, substituindo Ionicons via CDN. |
| `decimal.js` | `^10` | Juros compostos e operações decimais de precisão arbitrária, incluindo potências não inteiras. [Documentação](https://github.com/MikeMcl/decimal.js/). |
| `@internationalized/date` | `^3` | Datas civis sem horário ou deslocamentos inesperados de fuso. [CalendarDate](https://react-aria.adobe.com/internationalized/date/CalendarDate). |
| `zod` | `^4` | Schemas de formulários, snapshots de mercado, mensagens do worker e links compartilhados. |
| `chart.js` | `^4` | Renderização dos gráficos. |
| `vue-chartjs` | `^5` | Integração Vue 3 para Chart.js. [Documentação](https://vue-chartjs.org/guide/). |
| `chartjs-plugin-annotation` | `^3` | Marcações de vencimento, reuniões do Copom e referências. |
| `chartjs-plugin-datalabels` | `^2` | Rótulos opcionais nas linhas. |
| `vitest-axe` | major compatível | Verificações automatizadas básicas de acessibilidade. |

Remoções:

- `axios`: scripts utilizarão o `fetch` nativo do Node.
- Scripts externos do Ionicons e configuração `isCustomElement`.
- `@vue/devtools-api` como dependência direta, se continuar sem importações.
- Plugin Vite manual de Tailwind quando o Nuxt UI assumir a integração.

`financejs`, bibliotecas de IRR/NPV e Dinero.js não serão adicionadas. Elas resolvem outros tipos de problemas ou forçam arredondamento monetário prematuro; não substituem o motor brasileiro especializado.

### Patterns

- Funções puras e dependências explícitas.
- Discriminated unions para tipos de investimento.
- Registry de estratégias por produto.
- Adapters separados para BCB, Focus, Copom e ANBIMA.
- Snapshot normalizado como única entrada de mercado do domínio.
- Web Worker para evitar bloquear a interface em cenários extensos.
- Estado Pinia separado de resultados derivados.
- Componentes de campos reutilizados nas versões mobile e desktop.
- Componentes `.client.vue` para gráficos e recursos exclusivos do navegador.

## Component Design

### Public domain contracts

```ts
export type IsoDate = `${number}-${number}-${number}`

export type InvestmentInput = InvestmentBase & (
  | {
      type: 'poupanca'
      rate: { kind: 'savings' }
    }
  | {
      type: 'cdb-pre' | 'lci-pre' | 'tesouro-pre'
      rate: { kind: 'fixed'; annualPct: string }
    }
  | {
      type: 'cdb-cdi' | 'lci-cdi'
      rate: { kind: 'cdi-percent'; percentOfCdi: string }
    }
  | {
      type: 'cdb-ipca' | 'lci-ipca' | 'tesouro-ipca'
      rate: { kind: 'ipca-plus'; realAnnualPct: string }
    }
  | {
      type: 'tesouro-selic'
      rate: { kind: 'selic' }
    }
)

export interface InvestmentBase {
  id: string
  name: string
  maturityDate: IsoDate
}

export interface ComparisonRequest {
  schemaVersion: 1
  startDate: IsoDate
  principal: string
  useProjections: boolean
  investments: InvestmentInput[]
}

export interface InvestmentResult {
  investmentId: string
  calendarDays: number
  businessDays: number
  grossProfit: string
  iof: string
  incomeTax: string
  netProfit: string
  grossFinalValue: string
  netFinalValue: string
  netReturnPct: string
  annualizedNetPct: string
  fgc: FgcResult
  taxBracketAlert?: TaxBracketAlert
  warnings: SimulationWarning[]
  timeline: TimelinePoint[]
  monthlyYields: MonthlyYield[]
}

export interface ComparisonResult {
  investments: InvestmentResult[]
  ranking: string[]
  bestInvestmentId?: string
  runnerUpDifference?: string
  benchmarkDifferences: {
    cdi: string
    savings: string
    ipca: string
  }
  warnings: SimulationWarning[]
}
```

Entrada pública principal do motor:

```ts
simulateComparison(
  request: ComparisonRequest,
  market: MarketSnapshot,
): DomainResult<ComparisonResult>
```

Nenhum componente acessará diretamente funções internas de produtos.

### Market snapshot

```ts
export interface MarketSnapshot {
  schemaVersion: 1
  generatedAt: string
  brazilReferenceDate: IsoDate
  rates: {
    selicEffective: CurrentRate
    selicTarget: CurrentRate
    cdi: CurrentRate
    ipca12m: CurrentRate
    trMonthly: CurrentRate
  }
  projections: {
    selic: SelicProjectionPoint[]
    ipca: IpcaProjectionYear[]
  }
  holidays: {
    supportedFrom: IsoDate
    supportedUntil: IsoDate
    dates: Holiday[]
  }
  sources: Record<string, SourceMetadata>
}

export interface SourceMetadata {
  url: string
  retrievedAt: string
  referenceDate: IsoDate
  status: 'fresh' | 'stale'
  lastSuccessfulAt: string
}
```

O snapshot substituirá `app/assets/indicadores.json`. O domínio o receberá como parâmetro, sem importar o arquivo diretamente.

### Regras financeiras

#### Prefixados

- Converter taxa anual em fator diário por `factor = (1 + annualRate)^(1/252)`.
- Aplicar o fator apenas em dias úteis.
- Manter precisão completa durante a acumulação.

#### CDI

- No modo atual, CDI permanece constante até o vencimento.
- No modo projetado, usar CDI atual até a primeira nova vigência da Selic; depois usar a Selic efetiva projetada como proxy.
- Para `x% CDI`, aplicar o percentual ao rendimento diário, não ao saldo anual já composto.

#### IPCA e IPCA+

- Sem projeção, manter o IPCA acumulado em 12 meses constante.
- Com projeção, usar a mediana Focus de cada ano-calendário.
- Após o último ano, repetir a última taxa projetada.
- Em IPCA+, combinar inflação e taxa real multiplicativamente:
  `(1 + IPCA) × (1 + taxa real) - 1`.
- Converter a taxa anual combinada para base diária de 252 dias úteis.

#### Tesouro

- Tesouro Prefixado reutiliza o cálculo prefixado.
- Tesouro Selic usa 100% da Selic efetiva atual ou projetada.
- Tesouro IPCA+ reutiliza IPCA + taxa real.
- Não haverá marcação a mercado, cupons ou custos.
- A UI exibirá “simulação até o vencimento; não representa preço de venda antecipada”.

#### Poupança

- Crédito somente nos aniversários mensais.
- Antes do primeiro aniversário, rendimento zero.
- Se o dia original for 29, 30 ou 31 e não existir no mês, o aniversário passa para o primeiro dia do mês seguinte.
- Selic meta acima de 8,5%: remuneração básica mensal de 0,5%.
- Selic meta igual ou abaixo de 8,5%: 70% da Selic meta anual convertida para taxa mensal equivalente.
- Somar a TR mensal constante do snapshot à remuneração básica.
- Poupança não usa dias úteis e é isenta de IR e IOF.

#### IR e IOF

- IR sobre rendimento positivo após IOF.
- Até 180 dias: 22,5%.
- De 181 a 360 dias: 20%.
- De 361 a 720 dias: 17,5%.
- Acima de 720 dias: 15%.
- A tabela oficial é publicada pela [Receita Federal](https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/tabelas/2026).
- IOF aplica a tabela completa dos primeiros 29 dias; no 30º dia é zero, conforme o [Decreto nº 6.306](https://www.planalto.gov.br/ccivil_03/_ato2007-2010/2007/decreto/d6306compilado.htm).
- LCI/LCA e Poupança são isentas.
- O alerta de IR aparece quando faltarem de 1 a 29 dias para os marcos 181, 361 ou 721.

#### Gráficos e impostos

Os pontos intermediários do gráfico representam a evolução de uma aplicação destinada ao vencimento informado:

- IR e IOF seguem a faixa do vencimento final da linha.
- Não são cotações de resgate antecipado.
- A explicação será exibida junto ao gráfico.

#### FGC

- Produtos indicados: Poupança, CDB/RDB/LC e LCI/LCA.
- Tesouro recebe selo “Tesouro Nacional”, não FGC.
- Se o principal já exceder R$ 250.000, a data do alerta é a data inicial.
- Caso contrário, localizar o primeiro dia de crédito no qual o saldo bruto ultrapasse R$ 250.000.
- O alerta mostra data, saldo naquela data e valor final acima da cobertura.
- A UI explica que não existe consolidação por instituição ou conglomerado, embora a cobertura real siga esses limites. Referência: [FGC](https://www.fgc.org.br/sobre-garantia-fgc).

### Market-data pipeline

O workflow continuará executando `pnpm update-indexes`, mas o script será reestruturado em adapters.

| Informação | Fonte |
|---|---|
| Selic efetiva, base 252 | BCB SGS 1178: [dataset](https://dadosabertos.bcb.gov.br/dataset/1178-taxa-de-juros---selic-anualizada-base-252) |
| Selic meta | BCB SGS 432: [dataset](https://dadosabertos.bcb.gov.br/dataset/432-taxa-de-juros---meta-selic-definida-pelo-copom) |
| CDI anual | BCB SGS 4389 |
| IPCA acumulado em 12 meses | BCB SGS 13522 |
| TR mensal | BCB SGS 226 |
| Selic por reunião | `ExpectativasMercadoSelic`, no [sistema Focus](https://dadosabertos.bcb.gov.br/dataset/expectativas-mercado) |
| IPCA anual | `ExpectativasMercadoAnuais`, no sistema Focus |
| Reuniões agendadas | [Calendário oficial do Copom](https://www.bcb.gov.br/controleinflacao/copom) |
| Feriados | Páginas anuais da [ANBIMA](https://www.anbima.com.br/feriados/fer_nacionais/2026.asp) |

Regras do updater:

1. Determinar a data atual em `America/Sao_Paulo`.
2. Consultar cada série SGS com limite final nessa data; nunca aceitar registros futuros como taxa atual.
3. Fazer três tentativas por fonte, com timeout de dez segundos.
4. Buscar a data Focus mais recente com `baseCalculo = 1`.
5. Usar a mediana de cada reunião ou ano.
6. Associar identificadores `R#/YYYY` às datas oficiais do Copom.
7. Considerar o segundo dia da reunião; a taxa entra em vigor no dia seguinte.
8. Para reuniões Focus posteriores ao calendário publicado, estimar datas por `round(lastDate + n × 45,5 dias)` e marcar `estimated: true`.
9. Converter Selic meta Focus em efetiva subtraindo 0,10 ponto percentual.
10. Após o último ponto Selic ou IPCA, manter a última taxa.
11. Buscar feriados do ano anterior até 30 anos à frente.
12. Se faltar um ano de ANBIMA, definir `supportedUntil` no último ano contínuo disponível.
13. Validar cada resposta externa e o snapshot final com Zod.
14. Escrever o arquivo somente depois de toda a normalização.
15. Se uma fonte falhar, reutilizar a seção anterior e marcá-la `stale`.
16. Se não houver seção anterior válida, não sobrescrever o snapshot e encerrar com erro.
17. Marcar taxas diárias como antigas após três dias úteis e Focus após dez dias corridos.
18. O workflow `update-indexes.yml` roda às 14:00 UTC em dias úteis e cria commit apenas quando o snapshot mudar.

### State and worker

`comparison.ts` armazenará:

- Principal.
- Data inicial.
- Toggle de projeção.
- Lista ordenada de investimentos.
- Preferências de gráfico.
- Estado de carregamento e erros.

Resultados não serão persistidos; serão derivados pelo worker.

Contrato do worker:

```ts
type SimulationWorkerRequest = {
  requestId: number
  type: 'simulate'
  request: ComparisonRequest
  market: MarketSnapshot
}

type SimulationWorkerResponse = {
  requestId: number
  type: 'result'
  result: DomainResult<ComparisonResult>
}
```

- Alterações serão agrupadas com debounce de 120 ms.
- Respostas antigas serão descartadas pelo `requestId`.
- Se o worker não puder ser criado, o mesmo motor será executado de forma síncrona.
- Falhas de cálculo não apagarão a última simulação válida.

### Layout mobile-first

#### Estrutura global

- `UApp` envolve a aplicação.
- Header fluido com marca, “Calculadora”, “Aprenda”, “Metodologia”, “Sobre” e `UColorModeButton`.
- Conteúdo em `w-full`, largura máxima de aproximadamente 1600 px e paddings responsivos.
- Tipografia e espaços fluidos; nenhum componente depende de largura fixa.
- Controles têm alvo mínimo de 44 × 44 px.
- Rolagem horizontal somente dentro do gráfico ou tabela mensal, nunca na página inteira.

#### Tela principal

1. Hero compacto com proposta de valor e principais capacidades.
2. Cards de Selic, CDI, IPCA e TR, mostrando valor, data de referência e status da fonte.
3. Card principal da simulação:
   - Valor inicial.
   - “Preencher com exemplos”.
   - “Copiar link”.
   - Lista/tabela de investimentos.
   - Toggle de projeção.
   - Toggle de detalhes tributários.
   - Botão de adicionar investimento.
4. Resumo do melhor investimento.
5. Gráfico comparativo.
6. Detalhamento mensal.
7. Metodologia dinâmica, curvas e feriados.
8. Avisos educacionais e legais.

#### Mobile e tablet, abaixo de `xl`

- Cada investimento é um `UCard` expansível.
- Cabeçalho mostra nome, tipo, lucro líquido, posição e alertas.
- Corpo contém campos, vencimento, métricas e exclusão.
- Edição avançada pode usar `UDrawer`.
- Ações ficam empilhadas.
- Indicadores usam uma coluna no mobile e duas no tablet.
- Resumo comparativo usa cards horizontais roláveis.
- Detalhamento mensal usa um investimento por accordion.

#### Desktop, a partir de `xl`

- `UTable` com nome, tipo, taxa, vencimento, dias, proteção, lucro líquido e ações.
- Campos de edição continuam usando o mesmo componente `InvestmentEditorFields`.
- Ordenação de visualização por prazo e lucro não altera a ordem canônica do estado.
- Detalhes de lucro bruto, IOF e IR aparecem quando o toggle estiver ativo.

#### Tema

- Cores semânticas: azul primário, esmeralda para resultados positivos, âmbar para atenção, vermelho para erro e slate para neutros.
- Tema inicial acompanha o sistema.
- Nenhum componente usa branco ou preto fixo.
- Gráficos alternam tokens de claro/escuro e também usam tipos de traço, não apenas cor.

### Graph design

O Nuxt UI não possui gráfico financeiro nativo, portanto será criado `ComparisonChart.client.vue`.

Funcionalidades:

- Valores em BRL ou percentual.
- Período completo ou últimos 12 meses.
- Rótulos nas linhas.
- Legenda externa com seleção de séries.
- Tooltip com data, saldo, lucro líquido e diferença para referência.
- Modo normal e modo referencial.
- Referências: 100% CDI, Poupança ou IPCA.
- Cada investimento termina em seu próprio vencimento.
- CDI de referência recebe a mesma tributação da aplicação tributável equivalente.
- Poupança é isenta.
- IPCA representa preservação do poder de compra, sem tributação.
- Linhas verticais opcionais para vigências da Selic e vencimentos.
- Altura de 360 px no mobile e 520 px no desktop.
- Tabela textual associada via `aria-describedby`, pois conteúdo canvas não é acessível por padrão. Isso segue as recomendações de [acessibilidade do Chart.js](https://www.chartjs.org/docs/latest/general/accessibility.html).

### Monthly analytics

- Agrupar por investimento.
- Cada accordion mostra anos em linhas e meses em colunas.
- Cada célula representa o acréscimo líquido no mês.
- Meses inicial e final recebem indicação de período parcial.
- Cabeçalho mostra taxa, tributação, taxa líquida anualizada e valor final.
- Valores com e sem projeção podem ser exibidos juntos para produtos indexados.
- Apenas o investimento expandido monta sua matriz completa.

### Ranking and alerts

- Melhor investimento é o maior lucro líquido.
- Empates usam a ordem original como desempate, mas mostram selo de empate.
- Diferença para segundo colocado somente quando existirem dois resultados válidos.
- Comparações com CDI, IPCA e Poupança usam o mesmo principal e horizonte do vencedor.
- Alertas ficam tanto na linha/card quanto no resumo.
- Investimentos inválidos ficam fora do ranking sem desaparecer da edição.

### Shareable links

Schema `v1` compacto contendo:

- Principal.
- Toggle de projeção.
- Investimentos e ordem.
- Preferências relevantes do gráfico.
- Não inclui resultados ou snapshot de mercado.

Fluxo:

1. Validar o estado.
2. Converter para JSON compacto.
3. Codificar como UTF-8 Base64URL.
4. Rejeitar payload acima de 12 KB.
5. Copiar URL com `?sim=`.
6. Se Clipboard API falhar, abrir modal com URL selecionável.
7. Na carga, validar versão, tamanho, quantidade, tipos e limites.
8. Payload inválido é ignorado com aviso e a simulação padrão permanece.

O exemplo padrão será R$ 10.000, Poupança e CDB 100% CDI com vencimento em dois anos. “Preencher com exemplos” pede confirmação antes de substituir dados editados.

### Educational hub

Rotas completas no lançamento:

- `/aprenda`
- `/aprenda/renda-fixa`
- `/aprenda/cdb-rdb-lc`
- `/aprenda/lci-lca`
- `/aprenda/tesouro-direto`
- `/aprenda/indices-selic-cdi-ipca-tr`
- `/aprenda/impostos-ir-iof`
- `/aprenda/poupanca`
- `/aprenda/fgc`
- `/metodologia`
- `/sobre`

As URLs existentes `/como-calcular-imposto-de-renda` e `/como-calcular-juros-da-poupanca` continuarão funcionando e reutilizarão o novo conteúdo.

Cada artigo terá:

- Resumo.
- Fórmula e exemplo.
- Regras e exceções.
- Ligação com a calculadora.
- Fontes oficiais.
- Data da última revisão.
- Aviso de caráter educacional.
- Metadados sociais e schema estruturado.

`/metodologia` apresentará:

- Todas as regras descritas pelo usuário.
- Tabela IR e IOF.
- Curvas Selic e IPCA do snapshot.
- Distinção entre reuniões agendadas e estimadas.
- Lista de feriados no período ativo.
- Fontes, datas de referência e status de atualização.
- Limitações de FGC e Tesouro.

### Delivery milestones

#### Marco 0 — Fundação

- Criar a branch.
- Instalar Nuxt UI e dependências selecionadas.
- Implementar `UApp`, layout, tokens, tema claro/escuro e navegação.
- Criar contratos, validators e novo snapshot.
- Reestruturar o updater.
- Configurar fixtures das fontes.
- Gate: `lint`, testes do updater e `generate`.

#### Marco 1 — Calculadora simples e correta

- Datas e dias úteis.
- IR, IOF e Poupança.
- CDB prefixado, CDI e IPCA+.
- LCI/LCA prefixada, CDI e IPCA+.
- Valor inicial global.
- Cards mobile e tabela desktop.
- Resultados básicos e detalhes tributários.
- Gate: calculadora utilizável com dados atuais e testes de fronteira.

#### Marco 2 — Produtos, projeções e inteligência

- Tesouro até o vencimento.
- Curvas Selic e IPCA.
- Ranking e comparações.
- Alertas FGC e faixas de IR.
- Tabelas de curvas e feriados.
- Gate: todos os tipos e regras financeiras concluídos.

#### Marco 3 — Analytics e compartilhamento

- Web Worker.
- Gráficos e referências.
- Detalhamento mensal.
- Links compartilháveis.
- Otimizações para cenários extensos.
- Gate: fluxos analíticos completos em mobile e desktop.

#### Marco 4 — Educação, qualidade e lançamento

- Hub educacional completo.
- Acessibilidade e tema final.
- Testes de regressão, performance e browsers.
- Revisão jurídica das notas e fontes.
- Remoção dos módulos antigos somente após cobertura equivalente.
- Execução final de `pnpm lint`, `pnpm test` e `pnpm generate`.
- Merge da branch e publicação única pelo workflow existente.

## Package Structure

```text
app/
  app.vue
  assets/
    css/main.css
    market-data.json
  components/
    calculator/
      MarketIndicators.vue
      SimulationToolbar.vue
      InvestmentDesktopTable.vue
      InvestmentMobileList.vue
      InvestmentMobileCard.vue
      InvestmentEditorFields.vue
      InvestmentResultDetails.vue
      ComparisonSummary.vue
      ComparisonChart.client.vue
      ChartSeriesControls.vue
      MonthlyYieldDetails.vue
      CalculationNotes.vue
      ProjectionTables.vue
      HolidayList.vue
    education/
      EducationArticleLayout.vue
      FormulaExample.vue
      OfficialSourceList.vue
  composables/
    useComparisonCalculator.ts
    useSimulationWorker.ts
    useShareSimulation.ts
  layouts/
    default.vue
  pages/
    index.vue
    metodologia.vue
    sobre.vue
    aprenda/
      index.vue
      renda-fixa.vue
      cdb-rdb-lc.vue
      lci-lca.vue
      tesouro-direto.vue
      indices-selic-cdi-ipca-tr.vue
      impostos-ir-iof.vue
      poupanca.vue
      fgc.vue
  src/
    contracts/
      investment.ts
      market.ts
      simulation.ts
      errors.ts
    calendar/
      dates.ts
      business-days.ts
      monthly-anniversary.ts
    finance/
      decimal.ts
      taxes.ts
      rate-curves.ts
      benchmarks.ts
      fgc.ts
      regulatory-constants.ts
    products/
      savings.ts
      fixed-rate.ts
      cdi-linked.ts
      ipca-linked.ts
      treasury.ts
      registry.ts
    simulation/
      simulate-investment.ts
      simulate-comparison.ts
      timeline.ts
      monthly-yield.ts
      ranking.ts
    sharing/
      schema.ts
      codec.ts
    market/
      validate-snapshot.ts
  stores/
    comparison.ts
  workers/
    simulation.worker.ts

scripts/
  update-indexes.mjs
  market-data/
    fetch-bcb-sgs.mjs
    fetch-focus.mjs
    fetch-copom.mjs
    fetch-anbima.mjs
    normalize-market-data.mjs
    validate-market-data.mjs

test/
  fixtures/
    market-data/
  unit/
    calendar/
    finance/
    products/
    simulation/
    sharing/
    market-data/
  nuxt/
    calculator.test.ts
    responsive-investments.test.ts
    theme.test.ts
    chart-controls.test.ts
    share-simulation.test.ts
    education.test.ts
```

## Data Flow

```text
GitHub Actions
  → BCB SGS / Focus / Copom / ANBIMA
  → adapters e validação Zod
  → app/assets/market-data.json
  → pnpm generate
  → SPA estática no GitHub Pages

Navegador
  → Pinia recebe edição do usuário
  → ComparisonRequest validado
  → Web Worker
  → simulateComparison(request, snapshot)
  → resultados + timeline + matriz mensal
  → cards/tabela + ranking + gráfico + alertas
```

Fluxo inicial:

1. Carregar e validar o snapshot empacotado.
2. Obter a data brasileira atual.
3. Decodificar `?sim=` quando presente; caso contrário, usar exemplo padrão.
4. Validar cobertura de feriados e projeções.
5. Enviar solicitação ao worker.
6. Exibir skeleton durante o primeiro cálculo.
7. Renderizar resultados válidos e erros por investimento.
8. Recalcular somente após debounce, preservando o último resultado válido.

## Error Handling

```ts
export type DomainResult<T> =
  | {
      ok: true
      value: T
      warnings: SimulationWarning[]
    }
  | {
      ok: false
      errors: SimulationError[]
    }
```

Códigos obrigatórios:

- `invalid-principal`
- `invalid-rate`
- `invalid-maturity`
- `maturity-before-start`
- `maturity-outside-holiday-coverage`
- `unsupported-investment-type`
- `too-many-investments`
- `market-data-unavailable`
- `market-data-stale`
- `projection-unavailable`
- `invalid-share-payload`
- `unsupported-share-version`
- `share-payload-too-large`
- `calculation-overflow`
- `worker-unavailable`

Comportamentos:

- Erros de linha aparecem junto aos campos.
- Uma linha inválida não bloqueia as demais.
- Fonte antiga permite cálculo, mas mostra aviso persistente.
- Projeção indisponível usa taxas atuais e marca `fallback-current`.
- Falta de feriados bloqueia apenas vencimentos fora da cobertura.
- Link inválido mantém os defaults.
- Falha do gráfico mantém resumo e tabela mensal disponíveis.
- Falha do Clipboard abre o fallback manual.
- Erros externos do updater nunca sobrescrevem o último snapshot válido.
- Exceções são reservadas a invariantes quebradas e bugs, não a dados do usuário.

## Test Strategy

### Unit tests — dates and calendar

- Finais de semana.
- Feriados nacionais e bancários.
- Início exclusivo e vencimento inclusivo.
- Vencimento em sábado, domingo e feriado.
- Intervalos atravessando anos bissextos.
- Cobertura ausente.
- Aniversários de Poupança nos dias 28, 29, 30 e 31.
- Carnaval, Paixão de Cristo e Corpus Christi.

### Unit tests — taxes

- Todos os 29 percentuais do IOF.
- Dias 29 e 30.
- IR nos dias 180, 181, 360, 361, 720 e 721.
- IR calculado após IOF.
- Rendimentos negativos ou nulos sem imposto.
- Isenções de Poupança e LCI/LCA.
- Alertas a 29, 1 e 0 dias da próxima faixa.

### Unit tests — products

- Prefixado constante.
- CDI em modo atual.
- CDI atravessando múltiplas vigências Selic.
- Percentuais CDI de 50%, 100% e 250%.
- IPCA+ atravessando anos-calendário.
- Repetição da última projeção.
- Tesouro nas três modalidades.
- Poupança antes e depois do aniversário.
- Regra da Selic em ambos os lados de 8,5%.
- Combinação de TR com a remuneração básica.

### Unit tests — comparison

- Ranking simples, empate e apenas uma linha.
- Diferenças contra CDI, IPCA e Poupança.
- Séries com vencimentos diferentes.
- Modo referencial com CDB 100% CDI resultando em diferença zero.
- Matriz mensal e meses parciais.
- FGC já excedido na aplicação.
- Data exata de ultrapassagem durante o investimento.
- Investimentos não cobertos pelo FGC.
- Cenários máximos de 40 linhas e 30 anos.

### Golden fixtures

Criar snapshot imutável com base em 31/07/2026 e cenário:

- Principal: R$ 10.000.
- Início: 09/08/2026.
- Vencimento: 09/08/2028.
- Poupança.
- CDB 100% CDI.
- Projeção ativa.

A fixture deve reproduzir, com tolerância de um centavo, os resultados de referência apresentados: Poupança em aproximadamente R$ 11.740,44 e CDB projetado em aproximadamente R$ 12.284,74. O CDB sem projeção deve ser validado separadamente.

### Updater tests

- Payloads reais armazenados como fixtures.
- Decimais com vírgula e ponto.
- Registro SGS futuro ignorado.
- Última data Focus corretamente selecionada.
- `baseCalculo = 1`.
- Junção das reuniões Focus com Copom.
- Datas estimadas de 45,5 dias.
- Falha parcial e reaproveitamento da seção anterior.
- Snapshot inválido não escrito.
- Gap de feriados limitando `supportedUntil`.

### Nuxt tests

- Estado inicial e carregamento dos exemplos.
- Adicionar, editar e remover linhas.
- Limite de 40 linhas.
- Cards abaixo de `xl` e tabela a partir de `xl`.
- Tema claro, escuro e sistema.
- Navegação por teclado e foco de modais/drawers.
- Estados loading, erro, stale e fallback.
- Round-trip do link compartilhado.
- Link inválido.
- Controles do gráfico.
- Rotas educacionais e URLs legadas.
- `vitest-axe` nos principais componentes.

### Manual acceptance

Browsers:

- Chrome e Edge atuais.
- Firefox atual.
- Safari atual.
- Safari iOS atual e anterior.
- Chrome Android atual.

Viewports:

- 320, 375, 768, 1024, 1280, 1440 e 1920 px.
- Sem rolagem horizontal global.
- Campos e ações utilizáveis por toque.
- Tema coerente em toda a aplicação.

Metas:

- Lighthouse mobile: acessibilidade e boas práticas ≥ 95.
- CLS ≤ 0,1.
- LCP ≤ 2,5 s em build de produção.
- Interações continuam responsivas durante cálculo máximo.
- Cenário típico de dez investimentos por dez anos calculado em até 300 ms no worker em dispositivo intermediário.
- `pnpm lint`, `pnpm test` e `pnpm generate` sem falhas antes do merge.

## Open Items for Implementer

Não restam decisões de produto abertas. Durante a implementação:

- Resolver versões patch compatíveis dentro dos majors definidos e registrá-las no `pnpm-lock.yaml`.
- Não publicar nenhum marco intermediário.
- Não ampliar Tesouro para marcação a mercado ou custos sem nova decisão de produto.
- Não adicionar PDF, white-label, contas ou backend.
- Não substituir fórmulas brasileiras por bibliotecas financeiras genéricas.
- Preservar as URLs educacionais existentes.
- Remover código e testes antigos somente depois de existir cobertura equivalente no novo domínio.
- Qualquer divergência material entre a fixture de referência e as fórmulas aprovadas deverá ser tratada como defeito de implementação ou de dados, não ajustada por constantes arbitrárias.
