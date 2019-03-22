import { Module } from "vuex";
import { Diff, diff_match_patch } from "diff-match-patch";
const diff_applier = new diff_match_patch();
function timeout(ms:number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function sleep(fn: any, ...args: any) {
  await timeout(3000);
  return fn(...args);
}
let state = {
  //This should probably switch to a deque later.
  queuedDiffs: [] as Diff[],
  serverText: ""
};

type StateType = { [P in keyof typeof state]: (typeof state)[P] };

let module: Module<StateType, any> = {
  state,
  namespaced: true,
  getters: {
    computedText: function({ serverText, queuedDiffs }): string {
      return diff_applier.patch_apply(
        diff_applier.patch_make(serverText, queuedDiffs),
        serverText
      )[0];
    }
  },
  mutations: {
    _queueDiffs({ queuedDiffs }, diffs: Diff[]) {
      queuedDiffs.push(...diffs);
    },
    popDiffs({ queuedDiffs }, number: number) {
      queuedDiffs.splice(0, number);
    },
    setServerText(state, serverText) {
      state.serverText = serverText;
    }
  },
  actions: {
    queueDiffs({ commit, getters }, diffs: Diff[]) {
      commit("_queueDiffs", diffs);
      // patch these diffs to the server and await a response
      //As a temporary testing measure, we apply the diffs to the
      let response = getters.computedText;
      commit("setServerText", response);
      commit("popDiffs", diffs.length);
    }
  }
};

export default module;
