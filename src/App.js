import React from "react";
import "antd/dist/antd.css";
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import { useDataEngine } from "@dhis2/app-runtime";
import { TrackedEntityInstance } from "./TrackedEntityInstance";
import { Home } from "./Home";
import { Provider } from "./context/context";
import { Store } from "./Store";
import "./App.css";
import { Template } from "./Template";
import "mobx-react-lite/batchingForReactDom";

const MyApp = () => {
  const engine = useDataEngine();
  const store = new Store(engine);
  return (
    <Provider value={store}>
      <Router>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/templates/editor">
            <Template />
          </Route>
          <Route path="/:instance">
            <TrackedEntityInstance />
          </Route>
        </Switch>
      </Router>
    </Provider>
  );
};
export default MyApp;
