import axios from "axios";
import {GithubUser} from "../models/user";
import {GithubRepository} from "../models/repository";

const BASE_URL = 'https://api.github.com';

export const fetchUsers = (query: string) => axios.get<{items: GithubUser[]}>(`${BASE_URL}/search/users?q=${query}`);

export const fetchReposForUser = (username: string) => axios.get<GithubRepository[]>(`${BASE_URL}/users/${username}/repos`);

export type Fetch<T> = Partial<{
    payload: T,
    loading: boolean,
    error: any
}>
