import {createReducer, on} from "../../shared/reducer";
import {GithubUser} from "../../models/user";
import {GithubRepository} from "../../models/repository";
import {fetchReposForUser, fetchReposForUserFailed, fetchReposForUserSuccess, fetchUsersSuccess} from "./actions";
import {Fetch} from "../../shared/api";

export const key = "github";

export interface IGithubState {
    users: GithubUser[];
    repos: {[key: string]: Fetch<GithubRepository[]>};
}

const initialState: IGithubState = {
    users: [],
    repos: {},
};

export const reducer = createReducer(
    initialState,
    on(fetchUsersSuccess, (state, action) => ({
        ...state,
        users: action.users
    })),
    on(fetchReposForUser, (state, action) => ({
        ...state,
        repos: {
            ...state.repos,
            [action.username]: {
                loading: true
            }
        }
    })),
    on(fetchReposForUserFailed, (state, action) => ({
        ...state,
        repos: {
            ...state.repos,
            [action.username]: {
                error: action.error
            }
        }
    })),
    on(fetchReposForUserSuccess, (state, action) => ({
        ...state,
        repos: {
            ...state.repos,
            [action.username]: {
                payload: action.repos,
                loading: false
            }
        },
    })),
);
