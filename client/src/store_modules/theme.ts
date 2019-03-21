import { Module } from "vuex";
import { Theme } from "../theme";
import { dark, standard } from "../theme/defaults";

let state = { theme: dark };
type StateType = { [P in keyof typeof state]: (typeof state)[P] };

let module: Module<StateType, any> = {
  namespaced: true,
  state,
  mutations: {
    setTheme(state, theme: Theme) {
      state.theme = theme;
    }
  }
};

export default module;
