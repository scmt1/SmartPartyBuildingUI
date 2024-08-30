import Vue from 'vue'
import Vuex from 'vuex'
import getters from "./getters"
import user from './modules/user'
import dept from './modules/dept'
import app from './modules/app'

Vue.use(Vuex)
export default new Vuex.Store({
  getters,
  modules: {
    user,
    dept,
    app
  }
})
