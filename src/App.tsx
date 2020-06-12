import React from 'react';
import './App.scss';
import MainView from "./views/main/MainView";
import {Provider} from "react-redux";
import {store} from "./redux/store";

function App() {
  return (
    <Provider store={store}>
        <div className="App">
            <MainView/>
        </div>
    </Provider>
  );
}

export default App;
