import { Route, Switch } from "react-router-dom";
import "./App.css";

import ErrorPage from "./pages/ErrorPage";
import HomePage from "./pages/HomePage";
import LandingPage from "./pages/LandingPage/LandingPage";
import Header from "./components/header/header.component";
import SandboxPage from "./pages/SandboxPage";
import CreateUserPage from "./pages/CreateUserPage";
import TripsManagmentPage from "./pages/TripsManagmentPage/TripsManagmentPage";
import AuthenticatedRoute from "./components/authenticatedRoute.component";
import LoginPage from "./pages/LoginPage/LoginPage.jsx";
import ViewUserPage from "./pages/ViewUserPage/ViewUserPage";
import BikeManagmentPage from "./pages/BikeManagmentPage/BikeManagmentPage";
import CreateBike from "./components/createBike/createBike.component";
import UpdateBike from "./components/updateBike/updateBike.component";


function App() {
  return (
    <div>
      <Header />
      <Switch>
        <Route exact path="/" component={LandingPage} />
        <Route exact path="/login" component={LoginPage} />
        <AuthenticatedRoute exact={true} path="/home" component={HomePage} />
        <AuthenticatedRoute exact={true} path="/sandbox" component={SandboxPage} /> {/** For testing */}
        <AuthenticatedRoute exact={true} path="/create-user" component={CreateUserPage} />
        <AuthenticatedRoute exact={true} path="/manage-trips" component={TripsManagmentPage} />
        <AuthenticatedRoute exact={true} path="/view-users" component={ViewUserPage} />
        <AuthenticatedRoute exact={true} path="/manage-bikes" component={BikeManagmentPage} />
        <AuthenticatedRoute exact={true} path="/create-bike" component={CreateBike} />
        <AuthenticatedRoute exact={true} path="/update-bike" component={UpdateBike} />

        <Route path="" component={ErrorPage} />
      </Switch>
    </div>
  );
}

export default App;