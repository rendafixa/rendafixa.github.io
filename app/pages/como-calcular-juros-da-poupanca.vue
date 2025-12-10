<template>
  <section class="prose max-w-3xl mx-auto my-8 px-4 sm:px-8">
    <h2>Como calcular juros da Poupança</h2>
    <p>
      De acordo com a <a href="https://www.bcb.gov.br/estatisticas/remuneradepositospoupanca" target="_blank">legislação
      atual</a>, a remuneração dos depósitos de poupança é composta de duas parcelas:
    </p>
    <ol>
      <li><strong>Remuneração básica:</strong> dada pela <strong>Taxa Referencial (TR)</strong>.</li>
      <li><strong>Remuneração adicional:</strong> correspondente a:
        <ul>
          <li>0,5% ao mês, enquanto a meta da taxa Selic ao ano for <strong>superior a 8,5%</strong>;</li>
          <li>ou 70% da meta da taxa Selic ao ano, <strong>mensalizada</strong>, vigente na data de início do período de
            rendimento, enquanto a meta da taxa Selic ao ano for <strong>igual ou inferior a 8,5%</strong>.
          </li>
        </ul>
      </li>
    </ol>
    <p>
      A remuneração dos depósitos de poupança é calculada sobre o <strong>menor saldo de cada período de
      rendimento</strong>.
    </p>
    <h3>Período de Rendimento</h3>
    <p class="p-4 shadow shadow-gray-300 rounded-lg bg-gradient-to-r from-slate-100 to-amber-50">
      A <strong>data de aniversário</strong> da conta de depósito de poupança é o dia do mês de sua abertura. Para
      contas abertas nos dias 29, 30 e 31, considera-se como data de aniversário o dia 1º do mês seguinte.
    </p>
    <h3>Crédito dos Rendimentos</h3>
    <ul>
      <li>Mensalmente, na data de aniversário da conta, para depósitos de pessoa física e entidades sem fins
        lucrativos.
      </li>
      <li>Trimestralmente, na data de aniversário no último mês do trimestre, para os demais depósitos.</li>
    </ul>
    <h3>Como obtemos o índice da Poupança</h3>
    <p>
      Este projeto obtém automaticamente o índice mais recente da poupança por meio de integração com a dados oficiais
      fornecidos pelo <a href="https://www.bcb.gov.br/estatisticas/remuneradepositospoupanca" target="_blank">Banco
      Central do Brasil</a>.
    </p>
    <h3>Fontes Oficiais</h3>
    <ul>
      <li><a href="https://www.bcb.gov.br/estatisticas/remuneradepositospoupanca" target="_blank">Remuneração dos
        Depósitos de Poupança – BCB</a></li>
    </ul>
  </section>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Como Calcular Juros da Poupança',
  description: 'Entenda como funciona o cálculo dos juros da poupança, incluindo regras da Selic, TR, datas de aniversário conforme fontes oficiais do Banco Central',
})
</script>
