import React, { useState, useEffect, createContext, useContext } from "react";
import { auth } from "../firebase/config";
const AuthContext = createContext();

export function useAuth () {
  return useContext(AuthContext);
}
// eslint-disable-next-line react/prop-types
export default function AuthProvider ({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  const value = { currentUser };
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      console.log(user);
      setCurrentUser(user);
      setLoading(false);
    });

    return unsub;
  }, []);
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
