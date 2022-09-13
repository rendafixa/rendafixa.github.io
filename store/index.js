import Vue from 'vue'
import Vuex from 'vuex'
import * as investment from './investment'

Vue.use(Vuex)

export default () =>
  new Vuex.Store({
    modules: {
      investment
    }
  })
