import PageTemplate from "templates/PageTemplate";
import { Redirect, Route } from "react-router-dom";

const createRoute = (condition) => {
  return (props) => {
    const { path, exact, Component, redirectPath } = props;
    if (condition()) {
      return <PageTemplate path={path} exact={exact} Component={Component} />;
    } else {
      return <Redirect to={redirectPath} />;
    }
  };
};

const createSignInRoute = (condition) => {
  return (props) => {
    const { path, exact, Component, redirectPath } = props;
    if (condition()) {
      return <Route path={path} exact={exact} component={Component} />;
    } else {
      return <Redirect to={redirectPath} />;
    }
  };
};

const signIn = () => {
  if (localStorage.getItem("token")) {
    return true;
  }

  return false;
};

const notSignIn = () => {
  if (localStorage.getItem("token")) {
    return false;
  }

  return true;
};

export const AuthenRoute = createRoute(signIn);
export const SignInRoute = createSignInRoute(notSignIn);
