import React, {createContext, useContext, useState} from 'react';

const GlobalContext = createContext({
  state: {
    USER: {
      name: '',
      email: '',
      id: '',
    },
    LOGGEDAT: '',
  },
  setState: () => {},
  activeTab: 0,
  setActiveTab: () => '',
  stateArray: [],
  setStateArray: () => [],
  stateObject: {},
  setStateObject: () => {},
});

export const GlobalContextProvider = ({children}) => {
  const [state, setState] = useState({
    USER: {
      name: '',
      email: '',
      id: '',
    },
    LOGGEDAT: '',
  });
  const [activeTab, setActiveTab] = useState(0);
  const [stateArray, setStateArray] = useState([]);
  const [stateObject, setStateObject] = useState({});

  return (
    <GlobalContext.Provider
      value={{
        state,
        setState,
        activeTab,
        setActiveTab,
        stateArray,
        setStateArray,
        stateObject,
        setStateObject,
      }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
