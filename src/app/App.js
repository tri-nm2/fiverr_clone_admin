import "./App.css";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import React, { Suspense, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { AuthenRoute, SignInRoute } from "./guard";
import { useDispatch } from "react-redux";
import { fetchUserInfoAction } from "features/authentication/action";

function App() {
  const SignIn = React.lazy(() =>
    import("features/authentication/pages/SignIn")
  );
  const JobTypeManagement = React.lazy(() =>
    import("features/main/pages/JobTypeManagement")
  );
  const history = useHistory();
  const dispatch = useDispatch();
  const id = localStorage.getItem("id");

  //Hooks
  useEffect(() => {
    if (id) {
      fetchUserInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //Hooks

  //Api functions
  const fetchUserInfo = () => {
    dispatch(fetchUserInfoAction(id));
  };
  //Api functions

  return (
    <Router history={history}>
      <div className="App">
        <Suspense fallback={<div>...Loading</div>}>
          <Switch>
            {/* <Route path="/signin" exact component={SignIn} /> */}
            <SignInRoute
              path="/signin"
              redirectPath="/"
              exact
              Component={SignIn}
            />
            <AuthenRoute
              path="/"
              exact
              redirectPath="/signin"
              Component={JobTypeManagement}
            />
          </Switch>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
