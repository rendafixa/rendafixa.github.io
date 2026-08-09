<script setup lang="ts">
import type { ComparisonRequest } from '~/src/contracts/investment'
import type { ChartPreferences } from '~/stores/comparison'

const props = defineProps<{ request: ComparisonRequest, chart: ChartPreferences }>()
const emit = defineEmits<{ examples: [], share: [] }>()
const { fallbackUrl, shareError, copySimulation } = useShareSimulation()
const copied = ref(false)

async function share() {
  copied.value = await copySimulation(props.request, props.chart)
  emit('share')
}
</script>

<template>
  <div class="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
    <UButton
      icon="i-lucide-wand-sparkles"
      color="neutral"
      variant="soft"
      @click="emit('examples')"
    >
      Preencher com exemplos
    </UButton>
    <UButton
      icon="i-lucide-link"
      color="neutral"
      variant="soft"
      @click="share"
    >
      {{ copied ? 'Link copiado' : 'Copiar link' }}
    </UButton>
    <UAlert
      v-if="shareError"
      color="error"
      :description="shareError"
    />
    <div
      v-if="fallbackUrl"
      class="w-full"
    >
      <label
        for="fallback-share"
        class="text-sm font-medium"
      >Copie o link manualmente</label>
      <UInput
        id="fallback-share"
        :model-value="fallbackUrl"
        readonly
        class="mt-1 w-full"
        @focus="($event.target as HTMLInputElement).select()"
      />
    </div>
  </div>
</template>
