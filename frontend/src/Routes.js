import React, { Component } from "react";
import { Router, Switch, Route } from "react-router-dom";

import LoginPage from "./LoginPage";
import RegistrationPage from "./RegistrationPage";
import history from './history';
import InstaTwitter from './InstaTwitter';
import Menu from './Components/Menu'


export default class Routes extends Component {
    render() {
        return (
            <Router history={history}>
                <Switch>
                     <Route path="/" exact component={InstaTwitter} /> 
                    <Route path="/LoginPage" component={LoginPage} />
                    <Route path="/RegistrationPage" component={RegistrationPage} />
                    <Route path="/Menu" component={Menu} />

                    
                </Switch>
            </Router>
        )
    }
}
