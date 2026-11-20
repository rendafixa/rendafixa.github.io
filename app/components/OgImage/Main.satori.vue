<script setup lang="ts">
// Rendered at build time by nuxt-og-image (Satori renderer) — see README of
// nuxt-og-image for the template constraints: inline styles + simple flex
// utilities only, no browser APIs.
const props = defineProps<{
  title?: string
  description?: string
}>()
</script>

<template>
  <div
    class="w-full h-full flex flex-col justify-center items-center relative p-[60px]"
    style="background-color: #020617; color: #f8fafc; display: flex; flex-direction: column;"
  >
    <!-- Accent gradients: amber (Poupança) bottom-right, sky (CDB) top-left -->
    <div
      class="absolute top-0 left-0 right-0 bottom-0"
      :style="{
        backgroundImage: 'radial-gradient(ellipse 100% 100% at 100% 100%, rgba(245, 158, 11, 0.2) 0%, transparent 60%)',
      }"
    />
    <div
      class="absolute top-0 left-0 right-0 bottom-0"
      :style="{
        backgroundImage: 'radial-gradient(ellipse 100% 100% at 0% 0%, rgba(14, 165, 233, 0.15) 0%, transparent 50%)',
      }"
    />

    <div
      class="w-full flex-col justify-center items-center text-center relative"
      style="display: flex; flex-direction: column; gap: 24px;"
    >
      <!-- Brand lockup -->
      <div style="display: flex; align-items: center; justify-content: center; gap: 12px;">
        <svg
          viewBox="0 0 64 64"
          style="width: 64px; height: 64px;"
        >
          <rect
            x="8"
            y="6"
            width="48"
            height="52"
            rx="6"
            fill="none"
            stroke="#fbbf24"
            stroke-width="4"
          />
          <rect
            x="16"
            y="14"
            width="24"
            height="6"
            rx="3"
            fill="#38bdf8"
          />
          <rect
            x="16"
            y="26"
            width="32"
            height="4"
            rx="2"
            fill="#475569"
          />
          <rect
            x="16"
            y="34"
            width="32"
            height="4"
            rx="2"
            fill="#475569"
          />
          <rect
            x="16"
            y="42"
            width="20"
            height="4"
            rx="2"
            fill="#475569"
          />
        </svg>
        <div style="display: flex; font-size: 44px; font-weight: 700; letter-spacing: -1px;">
          <span>Calculadora&nbsp;</span><span style="color: #fbbf24;">de Renda Fixa</span>
        </div>
      </div>

      <!-- Page title -->
      <h1
        v-if="props.title"
        style="display: block; margin: 0; font-size: 56px; font-weight: 700; line-height: 1.1; max-width: 1000px; text-wrap: balance;"
      >
        {{ props.title }}
      </h1>

      <!-- Page description -->
      <p
        v-if="props.description"
        style="display: block; margin: 0; font-size: 28px; opacity: 0.7; max-width: 850px; line-height: 1.4;"
      >
        {{ props.description }}
      </p>

      <!-- Site URL pill -->
      <div style="display: flex; margin-top: 8px;">
        <div
          style="display: flex; padding: 8px 24px; border-radius: 9999px; border: 2px solid #334155; font-size: 20px; color: #94a3b8;"
        >
          rendafixa.github.io
        </div>
      </div>
    </div>
  </div>
</template>
