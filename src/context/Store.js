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
  vehicleState: [],
  setVehicleState: () => [],
  fuelingState: [],
  setFuelingState: () => [],
  accountState: [],
  setAccountState: () => [],
  transactionState: [],
  setTransactionState: () => [],
  noteState: [],
  setNoteState: () => [],
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
  const [vehicleState, setVehicleState] = useState([]);
  const [fuelingState, setFuelingState] = useState([]);
  const [accountState, setAccountState] = useState([]);
  const [transactionState, setTransactionState] = useState([]);
  const [noteState, setNoteState] = useState([]);

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
        vehicleState,
        setVehicleState,
        fuelingState,
        setFuelingState,
        accountState,
        setAccountState,
        transactionState,
        setTransactionState,
        noteState,
        setNoteState,
      }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
