<template>
  <div>
    <v-chart class="chart" :option="option" autoresize />
  </div>
</template>

<script setup lang="ts">
import { useCurrencyStore } from "~/store/currencies";
const store = useCurrencyStore();
import { use } from "echarts/core";
import { LineChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import VChart from "vue-echarts";

use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LineChart,
  CanvasRenderer,
]);

const option = ref({});

function render() {
  option.value = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        animation: false,
      },
    },
    xAxis: {
      type: "time",
      splitLine: {
        show: false,
      },
    },
    yAxis: {
      type: "value",
      boundaryGap: [0, "100%"],
      splitLine: {
        show: true,
      },
    },
    series: [
      {
        name: store.target.title,
        type: "line",
        showSymbol: true,
        data: store.currencySeries,
      },
    ],
  };
}

watch(
  () => [store.currencySeries],
  () => {
    render();
  }
);
</script>

<style scoped>
.chart {
  height: 75vh;
}
</style>
