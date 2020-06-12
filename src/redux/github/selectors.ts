import {IStore} from "../reducers";
import {key} from "./reducer";
import {createSelector} from "reselect";
import {GithubUserWithRepos} from "../../models/user";

const featureSelector = (store: IStore) => store[key];

export const allUsers = createSelector(featureSelector, github => {
   return github.users.map<GithubUserWithRepos>(user => {
       return {
           ...user,
           repos: github.repos[user.login].payload ?? []
       }
   });
});

export const repoForUserState = (username: string) => createSelector(featureSelector, github => {
    const repo = github.repos[username];
   if (repo.loading) return "Loading ...";
   if (repo.error) return "An error occurred";
   if (!repo.payload?.length) return "No repository for user found";
});
