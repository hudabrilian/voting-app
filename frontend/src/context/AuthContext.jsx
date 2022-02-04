import { createContext, useContext } from "react";

export const AuthContext = createContext({
  user: {},
  isAuthenticated: false,
  updateUser: () => {},
  updateIsAuthenticated: () => {},
});

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(`useAuthContext must be used within a AuthProvider`);
  }
  return context;
};
