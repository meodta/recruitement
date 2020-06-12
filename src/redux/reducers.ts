import {combineReducers} from "redux";
import * as Github from "./github/reducer";

export type IStore = {
    [Github.key]: Github.IGithubState,
}

export const combinedReducers = combineReducers({
    [Github.key]: Github.reducer,
});
