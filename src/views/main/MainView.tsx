import './MainView.scss';
import React, {useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import {fetchUsers} from "../../redux/github/actions";
import {allUsers} from "../../redux/github/selectors";
import {Collapse} from "antd";
import SearchResultItem from "../../components/SearchResultItem/SearchResultItem";

export default function MainView () {
    const inputRef = useRef<HTMLInputElement>(null);
    const dispatch = useDispatch();

    const users = useSelector(allUsers);

    const onSearch = () => {
        const query = inputRef.current?.value;
        if (!query)
            return;
        dispatch(fetchUsers({query}));
    };

    return <div className={"main-view"}>
        <input placeholder={"Enter username"} ref={inputRef}/>
        <button onClick={onSearch}>Search</button>
        {users?.length ? <div className={"search-results"}>
            <Collapse expandIconPosition={"right"}>
                {users?.map(user =>
                    <Collapse.Panel header={user.login} key={user.login}>
                        <SearchResultItem user={user}/>
                    </Collapse.Panel>
                )}
            </Collapse>
        </div> : null}
    </div>;
}
