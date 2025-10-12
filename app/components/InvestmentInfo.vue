<template>
  <v-expansion-panels variant="accordion" class="mb-4">
    <v-expansion-panel>
      <v-expansion-panel-title class="text-h6">
        <v-icon start>mdi-information-outline</v-icon>
        Como Funcionam os Investimentos
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <v-tabs v-model="tab" density="compact">
          <v-tab value="poupanca">Poupança</v-tab>
          <v-tab value="cdb">CDB</v-tab>
          <v-tab value="lci-lca">LCI/LCA</v-tab>
          <v-tab value="lc">LC</v-tab>
          <v-tab value="tesouro">Tesouro Direto</v-tab>
        </v-tabs>

        <v-window v-model="tab" class="mt-4">
          <v-window-item value="poupanca">
            <h3 class="text-h6 mb-2">Poupança</h3>
            <p><strong>Funcionamento:</strong> É uma aplicação financeira de baixo risco, com liquidez diária e garantida pelo Fundo Garantidor de Créditos (FGC).</p>
            <p><strong>Cálculo:</strong></p>
            <ul>
              <li>Utiliza uma taxa mensal fornecida (baseada na Taxa Referencial - TR e Selic)</li>
              <li>Converte a taxa mensal para taxa diária: <code>(1 + taxa_mensal)^(1/30) - 1</code></li>
              <li>Calcula juros compostos: <code>M = C * (1 + i)^n</code></li>
              <li>Considera apenas períodos completos de 30 dias</li>
            </ul>
            <p><strong>Isenção fiscal:</strong> Poupança é isenta de Imposto de Renda (IR) e Imposto sobre Operações Financeiras (IOF)</p>
          </v-window-item>

          <v-window-item value="cdb">
            <h3 class="text-h6 mb-2">CDB (Certificado de Depósito Bancário)</h3>
            <p><strong>Funcionamento:</strong> Título emitido por bancos para captação de recursos, com garantia do FGC até R$250 mil por CPF por banco.</p>
            <p><strong>Cálculo:</strong></p>
            <ul>
              <li>Taxa baseada em um percentual do CDI (Certificado de Depósito Interbancário)</li>
              <li>Converte a taxa anual efetiva para diária: <code>(1 + (percentual * cdi_anual) / 100)^(1/365) - 1</code></li>
              <li>Aplica juros compostos</li>
            </ul>
            <p><strong>Tributação:</strong></p>
            <ul>
              <li>IR regressivo: 22,5% (até 180 dias), 20% (181-360 dias), 17,5% (361-720 dias), 15% (acima de 720 dias)</li>
              <li>IOF: varia de 96% a 0% nos primeiros 30 dias, zerando após 30 dias</li>
            </ul>
          </v-window-item>

          <v-window-item value="lci-lca">
            <h3 class="text-h6 mb-2">LCI (Letra de Crédito Imobiliário) / LCA (Letra de Crédito do Agronegócio)</h3>
            <p><strong>Funcionamento:</strong> Títulos emitidos por instituições financeiras para financiar o setor imobiliário (LCI) ou agronegócio (LCA).</p>
            <p><strong>Cálculo:</strong></p>
            <ul>
              <li>Similar ao CDB, baseado em percentual do CDI</li>
              <li>Aplica juros compostos</li>
            </ul>
            <p><strong>Isenção fiscal:</strong> ISENTOS de Imposto de Renda (IR) e Imposto sobre Operações Financeiras (IOF)</p>
          </v-window-item>

          <v-window-item value="lc">
            <h3 class="text-h6 mb-2">LC (Letra de Crédito)</h3>
            <p><strong>Funcionamento:</strong> Similar a LCI/LCA, mas para outros setores (comercial, industriais).</p>
            <p><strong>Cálculo:</strong></p>
            <ul>
              <li>Baseado em percentual do CDI</li>
              <li>Aplica juros compostos</li>
            </ul>
            <p><strong>Isenção fiscal:</strong> ISENTOS de Imposto de Renda (IR) e Imposto sobre Operações Financeiras (IOF)</p>
          </v-window-item>

          <v-window-item value="tesouro">
            <h3 class="text-h6 mb-2">Tesouro Direto</h3>
            <p><strong>Funcionamento:</strong> Títulos públicos federais negociados diretamente com o governo.</p>
            <p><strong>Cálculo:</strong></p>
            <ul>
              <li>No caso do Tesouro Selic, a rentabilidade acompanha a taxa Selic</li>
              <li>Baseado em percentual da taxa Selic</li>
              <li>Aplica juros compostos</li>
            </ul>
            <p><strong>Tributação:</strong></p>
            <ul>
              <li>IR regressivo (mesmo que CDB): 22,5% (até 180 dias), 20% (181-360 dias), 17,5% (361-720 dias), 15% (acima de 720 dias)</li>
              <li>IOF: aplicável no primeiro dia, zerando após o primeiro dia</li>
            </ul>
          </v-window-item>
        </v-window>

        <div class="mt-4">
          <h4 class="text-h6 mb-2">Precisão dos Cálculos</h4>
          <p>Os cálculos implementados seguem as regras reais da legislação financeira brasileira:</p>
          <ul>
            <li>Fórmula de juros compostos: <code>M = C * (1 + i)^n</code></li>
            <li>Taxas convertidas para base diária</li>
            <li>IOF regressivo para resgates em até 30 dias</li>
            <li>IR regressivo baseado no tempo de aplicação</li>
            <li>Isenção de IR e IOF para LCI/LCA/LC</li>
          </ul>
          <p><strong>Observação:</strong> Para aplicações reais, o cálculo considera dias úteis vs dias corridos, o que pode afetar levemente o resultado final.</p>
        </div>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const tab = ref(null);
</script>