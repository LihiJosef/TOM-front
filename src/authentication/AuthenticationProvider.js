import { TomLogo } from "../icons";
import LoginPage from "./LoginPage/LoginPage";
import { useStyles } from "./Authentication.style";
import { CodesContextProvider } from "../context/codesContext";
import { AuthState, AuthProvider } from "../context/authContext";
import ErrorBoundaryMain from "../providersError/ErrorBoundaryMain";
import { AsyncErrorContextProvider } from "../context/asyncErrorContext";
import { ErrorAsyncProvider } from "../providersError/ErrorAsyncProvider";
import RegisterPage from "./RegisterPage/RegisterPage";
import LoginPageTom from "./LoginPage/LoginPageTom";
import { Redirect, Route, Switch } from "react-router-dom";

const AuthenticationProvider = ({ children }) => {
  const classes = useStyles();

  return (
    <>
      <AuthProvider>
        {authState => {
          if (process.env.REACT_APP_NOT_AUTH === "true") {
            return (
              <ErrorBoundaryMain>
                <AsyncErrorContextProvider>
                  <ErrorAsyncProvider>
                    <CodesContextProvider>{children}</CodesContextProvider>
                  </ErrorAsyncProvider>
                </AsyncErrorContextProvider>
              </ErrorBoundaryMain>
            );
          } else {
            switch (authState) {
              case AuthState.UnAuthenticated:
                // TODO:adi alon before start working remove from comment to replace old login screen with the new
                return (
                  <>
                    <Switch>
                      <Route key={1} exact path="/login">
                        <LoginPageTom />
                      </Route>
                      <Route key={2} exact path="/register">
                        <RegisterPage />
                      </Route>
                      <Redirect from="*" to="/login" />
                    </Switch>
                  </>
                );
                // return <LoginPage />;

              case AuthState.InProgress:
                return (
                  <div className={classes.root}>
                    <TomLogo className={classes.logo} />
                  </div>
                );

              case AuthState.Authenticated:
                return (
                  <ErrorBoundaryMain>
                    <AsyncErrorContextProvider>
                      <ErrorAsyncProvider>
                        <CodesContextProvider>{children}</CodesContextProvider>
                      </ErrorAsyncProvider>
                    </AsyncErrorContextProvider>
                  </ErrorBoundaryMain>
                );
            }
          }
        }}
      </AuthProvider>
    </>
  );
};

export default AuthenticationProvider;
