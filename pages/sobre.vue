<template>
  <div>
    <v-container class="">
      <v-row>
        <v-col md="5">
          <v-card class="pa-5" style="background-color: #fafafa">
            <v-img src="/images/help-wanted.jpg" max-height="100"></v-img>
            <v-card-title>Você é um desenvolvedor?</v-card-title>
            <v-card-subtitle>Tens experiência com Vue.js?</v-card-subtitle>
            <v-card-text
              >Precisamos de um desenvolvedor frontend, que possa aplicar sua
              criatividade no desenvolvimento do frontend desse projeto. Todo
              desenvolvedor backend tem a fama de fazer péssimas interfaces
              (pa-dum-ts!)
            </v-card-text>
            <v-card-actions>
              <v-btn
                variant="outlined"
                href="https://github.com/rendafixa/rendafixa.github.io"
                prepend-icon="mdi-microsoft-visual-studio-code"
                size="small"
              >
                Quero ajudar
              </v-btn>
              <v-btn
                variant="outlined"
                href="https://github.com/rendafixa/rendafixa.github.io/issues/new"
                prepend-icon="mdi-bug-outline"
                size="small"
              >
                Achei um bug
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>

        <v-col md="7">
          <v-card class="pa-5" style="background-color: #fafafa">
            <v-img src="/images/laptop-ide-code.jpg" max-height="100"></v-img>
            <v-card-title>Como tudo começou?</v-card-title>
            <v-card-subtitle
              >Era uma vez um artesão de software que quis fazer sua própria
              calculadora de renda fixa ...</v-card-subtitle
            >
            <v-card-text>
              <p>
                .. e foi que assim que comecei a desenvolver este projeto,
                buscando as taxas e índices que podem de alguma me auxiliar nos
                cálculos que envolvem os rendimentos aplicados em renda fixa.
              </p>
              <p>
                Desenvolvido por
                <a href="https://marcelorodrigo.com">Marcelo Rodrigo</a> e
                alguns
                <a
                  href="https://github.com/rendafixa/rendafixa.github.io/graphs/contributors"
                  title="GitHub Contributors"
                  >alguns colegas</a
                >.
              </p>
            </v-card-text>
            <v-card-actions>
              <v-btn
                variant="outlined"
                href="https://github.com/rendafixa/rendafixa.github.io"
                prepend-icon="mdi-github"
                size="small"
              >
                Github
              </v-btn>
              <v-btn
                variant="outlined"
                href="https://github.com/rendafixa/rendafixa.github.io/graphs/contributors"
                prepend-icon="mdi-account-multiple"
                size="small"
                >Desenvolvedores</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-col>

        <v-col md="5">
          <v-card class="pa-5" style="background-color: #fafafa">
            <v-card-title>Créditos</v-card-title>
            <v-card-text>
              <p>
                <a
                  href="https://www.flaticon.com/free-icons/budget"
                  rel="noopener"
                  >Budget icons created by Freepik - Flaticon</a
                >
              </p>
              <p>
                Photo by
                <a href="https://unsplash.com/@wocintechchat" rel="noopener"
                  >Christina @ wocintechchat.com</a
                >
                on
                <a href="https://unsplash.com/s/photos/dev" rel="noopener"
                  >Unsplash</a
                >
              </p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script setup lang="ts">
import { usePageStore } from "~/store/page";

useSeoMeta({
  title: "Sobre",
  description:
    "Saiba mais como o projeto Calculadora Renda Fixa começou e quem são os desenvolvedores",
});
</script>
