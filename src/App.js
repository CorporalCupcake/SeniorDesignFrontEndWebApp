import LoginPage from "./pages/LoginPage";
import "./App.css";
import { Route, Switch } from "react-router-dom";

import ErrorPage from "./pages/ErrorPage";
import HomePage from "./pages/HomePage";
import LandingPage from "./pages/LandingPage";
import Header from "./components/header.component";

import AuthenticatedRoute from "./components/authenticatedRoute.component";

import { AiOutlineUser } from 'react-icons/ai';
import { IconContext } from "react-icons";


function App() {
  return (
    <div>
      {/* <IconContext.Provider value={{ color: 'blue', size: '50px' }}>
        <AiOutlineUser/>
      </IconContext.Provider> */}

      <Header />
      <Switch>
        <Route exact path="/" component={LandingPage} />
        <Route exact path="/login" component={LoginPage} />
        <AuthenticatedRoute exact={true} path="/home" component={HomePage} />
        <Route path="" component={ErrorPage} />
      </Switch>
    </div>
  );
}

export default App;