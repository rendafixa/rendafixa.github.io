<template>
  <section class="prose prose-md max-w-4xl mx-auto my-8 px-4 sm:px-8">
    <h2>Sobre este projeto</h2>
    <div class="mb-4">
      <div>
        <img src="/images/laptop-ide-code.jpg" class="w-full h-80 object-cover" alt="Laptop IDE Code"/>
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
              <a href="https://marcelorodrigo.com" class="text-blue-600 hover:text-blue-800 underline"
                 title="Marcelo Rodrigo">Marcelo Rodrigo</a>
              e
              <a href="https://github.com/rendafixa/rendafixa.github.io/graphs/contributors" title="GitHub Contributors"
                 class="text-blue-600 hover:text-blue-800 underline">alguns colegas</a>.
            </p>
          </div>
          <div class="flex flex-wrap gap-2 mt-6">
            <a href="https://github.com/rendafixa/rendafixa.github.io"
               class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clip-rule="evenodd"/>
              </svg>
              Github
            </a>
            <a href="https://github.com/rendafixa/rendafixa.github.io/graphs/contributors"
               class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
              Desenvolvedores
            </a>
          </div>
        </div>
      </div>
    </div>

    <div>
      <h3 class="px-6">Créditos</h3>
      <div class="px-6 space-y-3">
        <p>
          <a href="https://www.flaticon.com/free-icons/budget" rel="noopener"
             class="text-blue-600 hover:text-blue-800 underline">
            Budget icons created by Freepik - Flaticon
          </a>
        </p>
        <p>
          Photo by
          <a href="https://unsplash.com/@wocintechchat" rel="noopener"
             class="text-blue-600 hover:text-blue-800 underline">
            Christina @ wocintechchat.com
          </a>
          on
          <a href="https://unsplash.com/s/photos/dev" rel="noopener"
             class="text-blue-600 hover:text-blue-800 underline">
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
