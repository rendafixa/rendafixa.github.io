import Vue from 'vue'
import Vuex from 'vuex'
import * as investment from './investment/index'

Vue.use(Vuex)

export default () =>
  new Vuex.Store({
    modules: {
      investment
    }
  })
