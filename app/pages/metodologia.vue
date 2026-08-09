<script setup lang="ts">
import marketData from '~/assets/market-data.json'
import type { MarketSnapshot } from '~/src/contracts/market'

const market = marketData as MarketSnapshot
const iof = [96, 93, 90, 86, 83, 80, 76, 73, 70, 66, 63, 60, 56, 53, 50, 46, 43, 40, 36, 33, 30, 26, 23, 20, 16, 13, 10, 6, 3]
useSeoMeta({ title: 'Metodologia', description: 'Fórmulas, dados, impostos e limitações usados pelo comparador de renda fixa.' })
</script>

<template>
  <article class="mx-auto max-w-5xl space-y-10">
    <header>
      <h1 class="text-4xl font-bold sm:text-5xl">
        Metodologia da simulação
      </h1>
      <p class="mt-4 text-lg text-muted">
        O motor usa datas civis, precisão decimal e regras explícitas para tornar comparáveis produtos que anunciam taxas de formas diferentes.
      </p>
    </header>
    <section>
      <h2 class="text-2xl font-semibold">
        Período e capitalização
      </h2>
      <p class="mt-3 text-muted">
        O período de rendimento é (data inicial, vencimento]. Produtos bancários e Tesouro usam 252 dias úteis; Poupança usa aniversários mensais e base de 365 dias corridos. Taxas são mantidas com 32 dígitos significativos e valores monetários só são arredondados na apresentação.
      </p>
    </section>
    <section class="grid gap-4 md:grid-cols-2">
      <UCard>
        <h2 class="text-xl font-semibold">
          IR regressivo
        </h2>
        <table class="mt-4 w-full text-sm">
          <thead>
            <tr>
              <th
                scope="col"
                class="p-2 text-left font-medium"
              >
                Prazo
              </th>
              <th
                scope="col"
                class="p-2 text-right font-medium"
              >
                Alíquota
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in [['Até 180 dias', '22,5%'], ['181–360 dias', '20%'], ['361–720 dias', '17,5%'], ['Acima de 720 dias', '15%']]"
              :key="row[0]"
            >
              <td class="p-2">
                {{ row[0] }}
              </td><td class="p-2 text-right font-semibold">
                {{ row[1] }}
              </td>
            </tr>
          </tbody>
        </table>
      </UCard>
      <UCard>
        <h2 class="text-xl font-semibold">
          IOF nos primeiros 29 dias
        </h2>
        <div class="mt-4 grid grid-cols-5 gap-2 text-center text-xs">
          <span
            v-for="(rate, index) in iof"
            :key="rate"
            class="rounded bg-elevated p-2"
          >D{{ index + 1 }}<strong class="block">{{ rate }}%</strong></span>
        </div>
      </UCard>
    </section>
    <section>
      <h2 class="text-2xl font-semibold">
        Projeções e fontes
      </h2>
      <p class="my-3 text-muted">
        CDI usa o valor atual até a primeira vigência projetada da Selic; depois, a Selic efetiva projetada funciona como proxy. IPCA usa a mediana Focus por ano e repete o último valor após a curva disponível.
      </p>
      <ProjectionTables :market="market" />
    </section>
    <HolidayList :market="market" />
    <CalculationNotes />
    <section>
      <h2 class="text-2xl font-semibold">
        Atualização e transparência
      </h2>
      <p class="mt-3 text-muted">
        O snapshot foi gerado em {{ market.generatedAt }} com data de referência brasileira {{ market.brazilReferenceDate }}. Fontes antigas permanecem utilizáveis com aviso; uma falha externa nunca substitui o último snapshot válido.
      </p>
      <OfficialSourceList
        :sources="Object.values(market.sources).map(source => ({ label: source.url, url: source.url }))"
        class="mt-4"
      />
    </section>
  </article>
</template>
