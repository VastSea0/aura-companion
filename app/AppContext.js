import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [sharedState, setSharedState] = useState("Merhaba Dünya!");
  const [aura, setAura] = useState(0); // 
  const [auraActivityMessage, setAuraActivityMessage] = useState(''); //

  return (
    <AppContext.Provider value={{ sharedState, setSharedState, aura, setAura, auraActivityMessage, setAuraActivityMessage }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
