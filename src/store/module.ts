import {actions} from "./actions"
import {getters} from "./getters"
import {mutations} from "./mutations"
import {state,State} from "./state"
import { createStore } from "vuex";


export default createStore<State>({
    state,
    mutations,
    actions,
    getters
    
})