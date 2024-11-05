<template>
  <div>
    <v-card elevation="2">
      <highchart
        class="pa-5"
        :options="chartOptions"
        style="width: 100%; height: 528px"
      />
    </v-card>
  </div>
</template>

<style>
#container {
  min-width: 310px;
}
.small-chart .highcharts-axis-title {
  display: none;
}
</style>

<script setup lang="ts">
import { computed } from "vue";

const poupancaPercentage = 32.38;
const cdbPercentage = 42.49;
const lciPercentage = 41.27;

const chartOptions = computed(() => ({
  chart: {
    type: "pie",
  },
  title: {
    text: "<span style='font-size: 1.25rem; font-weight: 500;'>Rendimento em Porcentagem</span>",
    align: "left",
  },
  accessibility: {
    announceNewData: {
      enabled: true,
    },
    point: {
      valueSuffix: "%",
    },
  },

  plotOptions: {
    pie: {
      allowPointSelect: true,
      cursor: "pointer",
      dataLabels: {
        enabled: true,
        distance: "-35%",
        filter: {
          property: "percentage",
          operator: ">",
          value: 5,
        },
        format: "{point.y:.1f}%",
        style: {
          fontSize: "0.9em",
          textOutline: "none",
        },
      },
      showInLegend: true,
    },
  },

  tooltip: {
    headerFormat: '<span style="font-size:12px">{series.name}</span><br>',
    pointFormat:
      '<span style="color:{point.color}">{point.name}</span>: ' +
      "<b>{point.y:.2f}%</b><br/>",
  },

  series: [
    {
      innerSize: "35%",
      name: "Porcentagem",
      colorByPoint: true,
      data: [
        {
          name: "Poupança",
          y: poupancaPercentage,
        },
        {
          name: "CDB / RDB",
          y: cdbPercentage,
        },
        {
          name: "LCA / LCI",
          y: lciPercentage,
        },
      ],
    },
  ],
}));
</script>
