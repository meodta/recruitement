import {GithubRepository} from "./repository";

export type GithubUser = {
    login: string,
    id: number
}

export type GithubUserWithRepos = {
    repos: GithubRepository[]
} & GithubUser;
