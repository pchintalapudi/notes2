import Vue from "vue";
import Vuex from "vuex";
import { theme, real_time as realTime } from "./store_modules";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: { theme, realTime }
});
