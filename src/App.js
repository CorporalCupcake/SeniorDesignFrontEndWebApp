import LoginPage from "./pages/LoginPage";
import "./App.css";
import { Route, Switch } from "react-router-dom";

import ErrorPage from "./pages/ErrorPage";
import HomePage from "./pages/HomePage";
import LandingPage from "./pages/LandingPage";
import Header from "./components/header/header.component";
import SandboxPage from "./pages/SandboxPage";
import CreateUser from "./components/createUser.component";

import AuthenticatedRoute from "./components/authenticatedRoute.component";

// import { AiOutlineUser } from 'react-icons/ai';
// import { IconContext } from "react-icons";

/* <IconContext.Provider value={{ color: 'blue', size: '50px' }}>
<AiOutlineUser/>
</IconContext.Provider> 
*/


function App() {
  return (
    <div>
      <Header />
      <Switch>
        <Route exact path="/" component={LandingPage} />
        <Route exact path="/login" component={LoginPage} />
        <AuthenticatedRoute exact={true} path="/home" component={HomePage} />
        <AuthenticatedRoute exact={true} path="/sandbox" component={SandboxPage} />
        <AuthenticatedRoute exact={true} path="/create-user" component={CreateUser} />
        <Route path="" component={ErrorPage} />
      </Switch>
    </div>
  );
}

export default App;