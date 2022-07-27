import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch } from "react-router-dom";


import indexRoutes from './routes/index.jsx';

import './assets/css/bootstrap.min.css';
import './assets/sass/light-bootstrap-dashboard.css';
import './assets/css/demo.css';
import './assets/css/pe-icon-7-stroke.css';


const hist = createBrowserHistory();

ReactDOM.render(
    <Router history={hist}>
        <Switch>
        {indexRoutes.map((prop, key) => {
            return <Route path={prop.path} component={prop.component} key={key} />;
        })}
        </Switch>
    </Router>,
    document.getElementById("root")
);
  