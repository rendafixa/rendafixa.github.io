<script setup lang="ts">
useSeoMeta({ title: 'Como rende a Poupança' })
</script>

<template>
  <EducationArticleLayout
    title="Poupança rende por aniversário, não a cada dia"
    summary="O crédito mensal depende da data do depósito, da meta Selic e da TR. Sacar antes do aniversário pode eliminar o rendimento daquele mês."
    :sources="[{ label: 'Banco Central — remuneração da Poupança', url: 'https://www.bcb.gov.br/estatisticas/remuneradepositospoupanca' }]"
  >
    <h2>A data do depósito define o crédito</h2><p>Antes do primeiro aniversário, a simulação não contabiliza rendimento. Depósitos nos dias 29, 30 ou 31 migram para o primeiro dia do mês seguinte quando o dia não existe.</p><FormulaExample
      title="Regra básica"
      formula="Selic > 8,5%: 0,5% ao mês + TR; caso contrário: 70% da Selic em taxa mensal equivalente + TR"
      example="A Poupança usa dias corridos e é isenta de IR e IOF."
    />
  </EducationArticleLayout>
</template>
