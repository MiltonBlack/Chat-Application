import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [contacts, setContacts] = useState(null)

  const values = {
  authToken,
  setAuthToken,
  contacts,
  setContacts
}

  return (
    <AuthContext.Provider value={{ authToken, setAuthToken, values }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
