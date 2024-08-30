// store

import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import createPersistedState from "vuex-persistedstate";
import user from './modules/user'

Vue.use(Vuex)

const userStore = createPersistedState({
  paths: ['user']
})

const store = new Vuex.Store({
  modules: { user },
  getters,
  plugins: [userStore]
})

export default store

