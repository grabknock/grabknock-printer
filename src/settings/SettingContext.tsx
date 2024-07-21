import {createContext, useState} from 'react';
import {SettingData} from './types';

export const SettingContext = createContext<SettingData>({
  toPrintCount: 1,
} as SettingData);

const SettingProvider = ({children}: any) => {
  const [toPrintCount, setToPrintCount] = useState<number>(1);

  const increment = () => {
    setToPrintCount(toPrintCount + 1);
  };

  const decrement = () => {
    setToPrintCount(toPrintCount - 1);
  };

  return (
    <SettingContext.Provider value={{toPrintCount, increment, decrement}}>
      {children}
    </SettingContext.Provider>
  );
};

export default SettingProvider;