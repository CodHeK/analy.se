import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Link,
  Route,
  Redirect
} from "react-router-dom";
import Dashboard from './Components/Dashboard/Dashboard';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <Switch>
            <Route path="/" exact="true" component={Dashboard} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
