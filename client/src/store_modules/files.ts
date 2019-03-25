import { Module } from "vuex";
import { FileBase, TextNote } from "../files";

let state = {
  rootFile: undefined as FileBase | undefined,
  open: [] as TextNote[],
  editing: undefined as TextNote | undefined
};

type StateType = { [P in keyof typeof state]: (typeof state)[P] };

let module: Module<StateType, any> = {
  namespaced:true,
  state,
  mutations: {
    setRootFile: function(state, rootFile: FileBase) {
      state.rootFile = rootFile;
    },
    open: function(state, file: TextNote) {
      if (!state.open.includes(file)) state.open.push(file);
      state.editing = file;
    },
    close: function({ open, editing }, file: TextNote) {
      let index = open.indexOf(file);
      if (~index) open.splice(open.indexOf(file), 1);
      if (file === editing)
        editing = open.length ? open[index > 0 ? index - 1 : index] : undefined;
    }
  }
};

export default module;
