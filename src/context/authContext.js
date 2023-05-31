import { getUserData, loginRequest } from "../services/userService";
import { checkUser } from "@Services/authenticationService";
import { useState, useEffect, useContext, createContext } from "react";

export const AuthState = {
  UnAuthenticated: 1,
  InProgress: 2,
  Authenticated: 3
};

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(null);
  const [user, setUser] = useState();
  const [isAdmin, setIsAdmin] = useState();

  useEffect(() => {
    handleAuth();
  }, []);

  useEffect(() => {
    if (user) {
      (async () => {
        console.log("user");
        console.log(user);

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
    }
  }, [user]);

  const handleInfo = async () => {
    try {
      const response = await getUserData();
      if (!(response?.data)) {
        throw ("Invalid response");
      }
      const user = response.data;
      console.log(user);
      setUser({ name: `${user.firstName} ${user.lastName}`, id: user.id, username: user.id, phone: user.phone, organizationId: user.organization_id, teamId: user.team_id });
      setAuthState(AuthState.Authenticated);
    } catch (e) {
      console.log(e);
      setAuthState(AuthState.UnAuthenticated);
    }
  };

  const handleAuth = async () => {
    try {
      setAuthState(AuthState.InProgress);
      const accessToken = localStorage.getItem("token");
      if (accessToken) {
        console.log(accessToken);
        await handleInfo();
      } else {
        setAuthState(AuthState.UnAuthenticated);
      }
    } catch (error) {
      console.error(error);
      setAuthState(AuthState.UnAuthenticated)
    }
  };

  const login = async (user, setError) => {
    try {
      const response = await loginRequest(user);
      if (!(response?.data?.token)) {
        throw "Invalid response"
      } else {
        console.log(response.data.token);
        localStorage.setItem("token", response.data.token);
        await handleInfo();
      }
    } catch (exception) {
      console.log(exception);
      setError("Invalid userId or password!");
      setAuthState(AuthState.UnAuthenticated);
    }
  }

  const setToken = async token => {
    try {
      console.log(token);
      setAuthState(AuthState.InProgress);
      localStorage.setItem("token", token);
      await handleInfo();
    } catch (exception) {
      console.log(exception);
      setAuthState(AuthState.UnAuthenticated);
    }
  }


  const logout = () => {
    // TODO logout
    // publicClient.logoutRedirect();
    localStorage.removeItem("token");
    setAuthState(AuthState.UnAuthenticated);
    setUser(null);
  };

  const saveComplexId = complexId => {
    setUser(prev => ({ ...prev, complexId }));
  };

  return (
    <AuthContext.Provider
      value={{
        authState,
        user,
        login,
        logout,
        isAdmin,
        saveComplexId,
        setToken
      }}
    >
      {children(authState)}
    </AuthContext.Provider>
  );
};
