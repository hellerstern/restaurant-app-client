import React, { useContext, useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setAuthToken } from "../utils/set-auth-token";
import { getAuth } from "../utils/localstorage";
import { getCurrentUser } from "../actions/auth";

import { PUBLIC_ROUTES } from "../config/routes";

import { UserInterface } from "../types/user";

interface AuthContextInterface {
  user: UserInterface | null;
  loadUserData: () => void;
  signOut: () => void;
  setUserData: (result: any) => void;
}

const AuthContext = React.createContext<AuthContextInterface | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const useAuth = () => {
  return useContext(AuthContext);
};

// ====================
// Serve current user
// ====================
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserInterface | null>(null);

  const setUserData = (result: any) => {
    setUser({
      email: result.user.email,
      name: result.user.name,
      role: result.user.role,
      _id: result.user._id,
      _v: result.user._v,
      image: result.user.image,
    });
  };

  const loadUserData = () => {
    const _result = getCurrentUser();

    if (_result.ok === false) setUser(null);
    else setUserData(_result);
  };

  const signOut = () => {
    setAuthToken(null);
    setUser(null);

    navigate(PUBLIC_ROUTES.login);
  };

  useEffect(() => {
    loadUserData();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loadUserData, signOut, setUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useSignOut = () => {
  return useCallback(() => {
    setAuthToken(null);
  }, []);
};

export const isSignedIn = () => {
  return getAuth() !== "";
};
