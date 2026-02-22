<template>
  <section class="prose dark:prose-invert max-w-3xl mx-auto my-8 px-4 sm:px-8">
    <h2>Como calcular o Imposto de Renda sobre investimentos</h2>

    <p>
      Esta página explica, de forma clara e prática, como o Imposto de Renda (IR) incide sobre as principais aplicações financeiras no Brasil
      (CDB/RDB, LCI/LCA, fundos e poupança). As regras e tabelas aqui citadas seguem a legislação e normas oficiais (Receita Federal, Planalto,
      Banco Central e CVM). Veja os links no final da página.
    </p>

    <h3>Tabela regressiva do IR para aplicações de renda fixa</h3>
    <p>
      Para a maioria das aplicações de renda fixa (CDB, RDB, títulos privados e públicos, fundos de renda fixa quando não tributados na fonte),
      o IR é cobrado de forma regressiva conforme o prazo de investimento:
    </p>
    <ul>
      <li>Até 180 dias: <strong>22,5%</strong></li>
      <li>181 a 360 dias: <strong>20%</strong></li>
      <li>361 a 720 dias: <strong>17,5%</strong></li>
      <li>Acima de 720 dias: <strong>15%</strong></li>
    </ul>

    <h3>IOF (resgates em menos de 30 dias)</h3>
    <p>
      Se o resgate ocorrer em até 30 dias do aporte, incide IOF regressivo sobre os rendimentos. Este projeto usa a tabela padrão (dia 1 → 96%,
      dia 30 → 0%). O IOF é calculado sobre os rendimentos e reduz o ganho antes da aplicação do IR.
    </p>

    <h3>Investimentos isentos</h3>
    <ul>
      <li>
        <strong>LCI / LCA:</strong> Letras de Crédito Imobiliário e do Agronegócio são, em geral, isentas de IR para pessoa física (ou seja, não há
        retenção de IR sobre os rendimentos). Verificar condições contratuais e eventuais alterações legislativas.
      </li>
      <li>
        <strong>Poupança:</strong> Rendimentos de cadernetas de poupança são isentos de IR para pessoa física conforme legislação vigente.
      </li>
    </ul>

    <h3>Como realizar o cálculo (passo a passo)</h3>
    <ol>
      <li>Calcule o rendimento bruto (juros) do investimento no período.</li>
      <li>Se houver resgate em até 30 dias, aplique a taxa de IOF sobre o rendimento bruto e subtraia o IOF do rendimento.</li>
      <li>Determine a alíquota de IR conforme a tabela regressiva pelo número de dias de aplicação.</li>
      <li>Calcule o IR sobre o rendimento líquido após IOF (quando aplicável) e subtraia do rendimento líquido para obter o rendimento final.</li>
    </ol>

    <h3>Exemplos práticos</h3>
    <ContentGradientBox>
      Exemplos com valores reais e cálculos passo a passo para você entender como o IR e IOF afetam seus ganhos.
    </ContentGradientBox>

    <h4>Exemplo 1: CDB resgatado em 120 dias (sem IOF)</h4>
    <p>
      <strong>Dados:</strong> Aporte de R$ 10.000 em CDB. Resgate após 120 dias com rendimento bruto de R$ 600.
    </p>
    <ol>
      <li><strong>Dias de aplicação:</strong> 120 dias → alíquota de IR = <strong>22,5%</strong> (conforme tabela regressiva).</li>
      <li><strong>IOF:</strong> Resgate após 30 dias → IOF = <strong>0%</strong> (sem penalidade de IOF).</li>
      <li><strong>Cálculo do IR:</strong> 22,5% × R$ 600 = <strong>R$ 135,00</strong>.</li>
      <li><strong>Rendimento líquido:</strong> R$ 600 − R$ 135 = <strong>R$ 465,00</strong>.</li>
      <li><strong>Saldo final:</strong> R$ 10.000 + R$ 465 = <strong>R$ 10.465,00</strong>.</li>
    </ol>

    <h4>Exemplo 2: CDB resgatado em 15 dias (com IOF)</h4>
    <p>
      <strong>Dados:</strong> Mesmo aporte de R$ 10.000 em CDB. Resgate em apenas 15 dias com rendimento bruto de R$ 75.
    </p>
    <ol>
      <li><strong>IOF (dia 15):</strong> Conforme a tabela regressiva do IOF (ver <code>app/src/finance.ts</code>) → <strong>50%</strong> sobre o rendimento bruto.</li>
      <li><strong>Cálculo do IOF:</strong> 50% × R$ 75 = <strong>R$ 37,50</strong>.</li>
      <li><strong>Rendimento após IOF:</strong> R$ 75 − R$ 37,50 = <strong>R$ 37,50</strong>.</li>
      <li><strong>Dias de aplicação:</strong> 15 dias → alíquota de IR = <strong>22,5%</strong>.</li>
      <li><strong>Cálculo do IR:</strong> 22,5% × R$ 37,50 = <strong>R$ 8,44</strong> (arredondado).</li>
      <li><strong>Rendimento líquido:</strong> R$ 37,50 − R$ 8,44 = <strong>R$ 29,06</strong>.</li>
      <li><strong>Saldo final:</strong> R$ 10.000 + R$ 29,06 = <strong>R$ 10.029,06</strong>.</li>
    </ol>
    <p>
      <em>Observe:</em> O resgate antecipado (dia 15) resultou em um ganho líquido de apenas R$ 29,06 contra R$ 465,00 no exemplo anterior.
      Esta é a razão pela qual aplicações de longo prazo tendem a ser mais vantajosas: menores alíquotas de IR e sem IOF.
    </p>

    <h4>Exemplo 3: LCI/LCA com mesmo rendimento (isenta de IR)</h4>
    <p>
      <strong>Dados:</strong> Mesmo aporte de R$ 10.000 em LCI. Resgate após 120 dias com rendimento bruto de R$ 600.
    </p>
    <ol>
      <li><strong>Rendimento bruto:</strong> R$ 600.</li>
      <li><strong>IR:</strong> <strong>0%</strong> (LCI/LCA são isentas de IR para pessoa física).</li>
      <li><strong>IOF:</strong> <strong>0%</strong> (não incide IOF em LCI/LCA).</li>
      <li><strong>Rendimento líquido:</strong> R$ 600 − 0 = <strong>R$ 600,00</strong>.</li>
      <li><strong>Saldo final:</strong> R$ 10.000 + R$ 600 = <strong>R$ 10.600,00</strong>.</li>
    </ol>
    <p>
      <em>Comparação:</em> Com LCI, você fica com R$ 600 de rendimento. Com CDB em 120 dias, ficou com R$ 465. A diferença (R$ 135) é justamente o IR que seria cobrado no CDB.
      Sempre verifique as condições contratuais e se a isenção se aplica ao seu caso.
    </p>

    <h4>Exemplo 4: Poupança (totalmente isenta)</h4>
    <p>
      <strong>Dados:</strong> R$ 10.000 em caderneta de poupança. Após 120 dias, rendimento bruto de R$ 60 (conforme índice da poupança vigente).
    </p>
    <ol>
      <li><strong>Rendimento bruto:</strong> R$ 60.</li>
      <li><strong>IR:</strong> <strong>0%</strong> (poupança é isenta de IR para pessoa física).</li>
      <li><strong>Rendimento líquido:</strong> R$ 60 − 0 = <strong>R$ 60,00</strong>.</li>
      <li><strong>Saldo final:</strong> R$ 10.000 + R$ 60 = <strong>R$ 10.060,00</strong>.</li>
    </ol>
    <p>
      <em>Nota:</em> Embora isenta de IR, a poupança geralmente oferece rentabilidade menor que CDB ou LCI. A escolha depende do seu objetivo (liquidez, segurança ou rentabilidade).
    </p>

    <h3>Observações importantes</h3>
    <ul>
      <li>As regras tributárias podem mudar; use sempre fontes oficiais para confirmar alíquotas e procedimentos.</li>
      <li>
        Alguns fundos de investimento têm regime de tributação diferente (por exemplo, fundos listados como tributos na fonte ou tributação equilibrada
        para fundos de longo prazo). Consulte a documentação do fundo e a CVM.
      </li>
      <li>Para declarar no Imposto de Renda anual, verifique as orientações da Receita Federal sobre rendimentos e IRRF.</li>
    </ul>

    <h3>Fontes oficiais</h3>
    <ul>
      <li>
        <a
          href="https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/mpv/mpv1303.htm"
          target="_blank"
          rel="noopener noreferrer"
        >
          Medida Provisória nº 1.303/2025: Tributação de aplicações financeiras e ativos virtuais (Planalto)
        </a>
      </li>
      <li>
        <a
          href="https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/lei/L15191.htm"
          target="_blank"
          rel="noopener noreferrer"
        >
          Lei nº 15.191/2025: Tabela progressiva mensal do IRPF (Planalto)
        </a>
      </li>
      <li>
        <a
          href="https://www.planalto.gov.br/ccivil_03/leis/l9250.htm"
          target="_blank"
          rel="noopener noreferrer"
        >
          Lei nº 9.250/1995: IRPF e base de cálculo (Planalto)
        </a>
      </li>
      <li>
        <a
          href="https://www.gov.br/receitafederal/pt-br"
          target="_blank"
          rel="noopener noreferrer"
        >
          Receita Federal do Brasil: Orientações sobre Imposto de Renda
        </a>
      </li>
      <li>
        <a
          href="https://www.gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/tabelas"
          target="_blank"
          rel="noopener noreferrer"
        >
          Receita Federal: Tabelas do Imposto de Renda (2026)
        </a>
      </li>
      <li>
        <a
          href="https://www.bcb.gov.br/estatisticas/remuneradepositospoupanca"
          target="_blank"
          rel="noopener noreferrer"
        >
          Banco Central: Remuneração dos Depósitos de Poupança
        </a>
      </li>
      <li>
        <a
          href="https://www.bcb.gov.br/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Banco Central do Brasil: Índices oficiais (DI, SELIC, Poupança)
        </a>
      </li>
      <li>
        <a
          href="https://www.cvm.gov.br/"
          target="_blank"
          rel="noopener noreferrer"
        >
          CVM: Comissão de Valores Mobiliários (orientações sobre fundos e tributação)
        </a>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Como Calcular Imposto de Renda sobre Investimentos',
  description: 'Guia prático para calcular IR e IOF em aplicações financeiras (CDB, LCI/LCA, Poupança) com referências oficiais',
})
</script>
