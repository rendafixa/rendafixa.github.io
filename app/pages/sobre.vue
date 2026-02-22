<template>
  <section class="prose prose-md dark:prose-invert max-w-4xl mx-auto my-8 px-4 sm:px-8">
    <h2>Sobre este projeto</h2>
    <div class="mb-4">
      <div>
        <img
          src="/images/laptop-ide-code.jpg"
          class="w-full h-80 object-cover"
          alt="Laptop IDE Code"
        >
        <div class="p-6">
          <h3>Como tudo começou?</h3>
          <p>
            Era uma vez um artesão de software que quis fazer sua própria calculadora de renda fixa ...
          </p>
          <div class="space-y-3">
            <p>
              .. e foi que assim que comecei a desenvolver este projeto, buscando as taxas e índices que podem de alguma
              me auxiliar nos cálculos que envolvem os rendimentos aplicados em renda fixa.
            </p>
            <p>
              Desenvolvido por
              <a
                href="https://marcelorodrigo.com"
                class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
                title="Marcelo Rodrigo"
              >Marcelo Rodrigo</a>
              e
              <a
                href="https://github.com/rendafixa/rendafixa.github.io/graphs/contributors"
                title="GitHub Contributors"
                class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
              >alguns colegas</a>.
            </p>
          </div>
          <div class="flex flex-wrap gap-2 mt-6">
            <a
              href="https://github.com/rendafixa/rendafixa.github.io"
              class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <ion-icon
                name="logo-github"
                size="large"
                class="mr-2"
                aria-hidden="true"
              />
              Github
            </a>
            <a
              href="https://github.com/rendafixa/rendafixa.github.io/graphs/contributors"
              class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <ion-icon
                name="people-outline"
                size="large"
                class="mr-2"
                aria-hidden="true"
              />
              Desenvolvedores
            </a>
          </div>
        </div>
      </div>
    </div>

    <div>
      <h3 class="px-6">
        Créditos
      </h3>
      <div class="px-6 space-y-3">
        <p>
          <a
            href="https://www.flaticon.com/free-icons/budget"
            rel="noopener"
            class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
          >
            Budget icons created by Freepik - Flaticon
          </a>
        </p>
        <p>
          Photo by
          <a
            href="https://unsplash.com/@wocintechchat"
            rel="noopener"
            class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
          >
            Christina @ wocintechchat.com
          </a>
          on
          <a
            href="https://unsplash.com/s/photos/dev"
            rel="noopener"
            class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
          >
            Unsplash
          </a>
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Sobre',
  description: 'Saiba mais como o projeto Calculadora Renda Fixa começou e quem são os desenvolvedores',
})
</script>
