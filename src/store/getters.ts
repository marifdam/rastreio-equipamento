import { State } from './state';

export const getters = {
  getDatabase(state: State) {
    return state.database;
  },
  getLastSearch(state: State) {
    return state.lastSearch;
  }
};
