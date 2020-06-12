import {applyMiddleware, createStore} from "redux";
import {combinedReducers} from "./reducers";
import thunk from "redux-thunk";

export const store = createStore(combinedReducers, applyMiddleware(thunk));
