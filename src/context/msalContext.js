import { getUserPhone } from "../services/userService";
import { checkUser } from "@Services/authenticationService";
import { useAsyncThrowError } from "../hooks/useAsyncThrowError";
import { getMsalProps, publicClient } from "../config/authConfig";
import { getServiceType } from "../services/newAppointmentService";
import { useState, useEffect, useContext, createContext } from "react";

export const AuthState = {
  UnAuthenticated: 1,
  InProgress: 2,
  Authenticated: 3
};

export const MsalContext = createContext();
export const useMsal = () => useContext(MsalContext);

export const MsalProvider = ({ children, request, forceLogin = false, handleError = null }) => {
  const [authState, setAuthState] = useState(null);
  const [user, setUser] = useState();
  const [isAdmin, setIsAdmin] = useState();

  const { throwError } = useAsyncThrowError();

  useEffect(() => {
    handleAuth();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await checkUser(user?.id);
        setIsAdmin(true);
      } catch (e) {
        if (e.response.status === 401) {
          setIsAdmin(false);
        }
        setIsAdmin(false);
      }
    })();
  }, [user]);

  const handleInfo = async () => {
    try {
      const { name, username } = publicClient.getAllAccounts()[0];

      const [{ data: userPhone }, { data: serviceType }] = await Promise.all([
        getUserPhone(username.substring(0, 9)),
        getServiceType(username.substring(0, 9))
      ]);

      setUser({ serviceType, name, username, id: username.substring(0, 9), phone: userPhone.phone });
      setAuthState(AuthState.Authenticated);
    } catch (e) {
      throwError(e);
    }
  };

  const handleAuth = async () => {
    try {
      setAuthState(AuthState.InProgress);

      const response = await publicClient.handleRedirectPromise();

      if (response) {
        handleInfo();
      } else {
        const msalProps = await getMsalProps();

        if (msalProps) {
          handleInfo();
        } else if (forceLogin) {
          login(request);
        } else {
          setAuthState(AuthState.UnAuthenticated);
        }
      }
    } catch (error) {
      console.error(error);
      typeof handleError === "function" && handleError(error);

      const redirectUrl = localStorage.getItem("redirectUrl");
      localStorage.clear();
      localStorage.setItem("redirectUrl", redirectUrl);
      login(request);
    }
  };

  const login = async loginRequest => {
    setAuthState(AuthState.InProgress);
    publicClient.loginRedirect(loginRequest);
  };

  const logout = () => {
    // TODO logout
    publicClient.logoutRedirect();
  };

  const saveComplexId = complexId => {
    setUser(prev => ({ ...prev, complexId }));
  };

  return (
    <MsalContext.Provider
      value={{
        authState,
        user,
        login,
        logout,
        isAdmin,
        saveComplexId
      }}
    >
      {children(authState)}
    </MsalContext.Provider>
  );
};
