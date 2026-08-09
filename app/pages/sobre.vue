<script setup lang="ts">
useSeoMeta({ title: 'Sobre', description: 'Sobre a Calculadora Renda Fixa e os limites das simulações.' })
</script>

<template>
  <article class="mx-auto max-w-3xl space-y-6">
    <h1 class="text-4xl font-bold">
      Sobre a Calculadora Renda Fixa
    </h1>
    <p class="text-lg text-muted">
      Este projeto aberto transforma regras da renda fixa brasileira em comparações transparentes. Ele não vende produtos, não recebe dados pessoais e não substitui aconselhamento financeiro.
    </p>
    <h2 class="text-2xl font-semibold">
      O que entra na conta
    </h2>
    <p>O motor considera capitalização, dias úteis, feriados, IR, IOF, Poupança, projeções e alertas simplificados de FGC. Os dados de mercado são incorporados ao site durante a geração estática.</p>
    <h2 class="text-2xl font-semibold">
      O que fica de fora
    </h2>
    <p>Não simulamos venda antecipada do Tesouro, custos específicos de corretoras, risco individual do emissor, liquidez contratual nem a consolidação real da cobertura do FGC.</p>
    <div class="flex flex-wrap gap-3">
      <UButton to="/">
        Abrir calculadora
      </UButton>
      <UButton
        to="/metodologia"
        color="neutral"
        variant="soft"
      >
        Ler metodologia
      </UButton>
    </div>
  </article>
</template>
