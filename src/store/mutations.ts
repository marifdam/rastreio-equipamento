import { State } from "./state";

export const mutations = {
  setDatabase(state: State, database: object) {
    state.database = database;
  },
  setLastSearch(state: State, lastSearch: object) {
    state.lastSearch = lastSearch;
  },
};
