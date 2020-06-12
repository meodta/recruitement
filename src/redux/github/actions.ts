import {createPayloadAction, createPayloadAsyncAction} from "../../shared/action";

import * as API from "../../shared/api";
import {GithubRepository} from "../../models/repository";
import {GithubUser} from "../../models/user";

export const fetchUsersSuccess = createPayloadAction<{users: GithubUser[]}>("[Github] Succeeded to fetch users");

export const fetchUsersFailed = createPayloadAction<{error: any}>("[Github] Failed to fetch users");

export const fetchUsers = createPayloadAsyncAction<{query: string}>("[Github] Attempting to fetch users", async (dispatch, action) => {
    try {
        const result = await API.fetchUsers(action.query);
        const data = result.data.items;
        const limited = data.slice(0, 5);
        limited.forEach(user => dispatch(fetchReposForUser({username: user.login})));
        dispatch(fetchUsersSuccess({users: limited}));
    } catch (error) {
        dispatch(fetchUsersFailed({error}));
    }
});

export const fetchReposForUserSuccess = createPayloadAction<{username: string, repos: GithubRepository[]}>("[Github] Succeeded to fetch repos for user");

export const fetchReposForUserFailed = createPayloadAction<{username: string, error: any}>("[Github] Failed to fetch repos for user");

export const fetchReposForUser = createPayloadAsyncAction<{username: string}>("[Github] Attempting to fetch repos for user", async (dispatch, action) => {
    try {
        const result = await API.fetchReposForUser(action.username);
        dispatch(fetchReposForUserSuccess({
            username: action.username,
            repos: result.data.slice(0, 5)
        }));
    } catch (error) {
        dispatch(fetchReposForUserFailed({username: action.username, error}));
    }
});
