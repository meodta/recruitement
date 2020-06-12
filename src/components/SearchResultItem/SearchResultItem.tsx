import "./SearchResultItem.scss";
import React from "react";
import {GithubUserWithRepos} from "../../models/user";
import {useSelector} from "react-redux";
import {repoForUserState} from "../../redux/github/selectors";
import {StarFilled} from "@ant-design/icons/lib";

export default function SearchResultItem(props: {user: GithubUserWithRepos}) {
    const { user } = props;

    const status = useSelector(repoForUserState(user.login));

    return <div className={"repos"}>
            {status}
            {user.repos.map(repo => (
                <div className={"repo"} key={`repo${repo.name}`}>
                    <div className={"header"}>
                        <span className={"name"}>{repo.name}</span>
                        <div className={"stars"}>
                            <StarFilled />
                            <span>{repo.stargazers_count}</span>
                        </div>
                    </div>
                    <div className={"description"}>
                        {repo.description}
                    </div>
                </div>
            ))}
        </div>
}
