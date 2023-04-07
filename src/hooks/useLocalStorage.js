import { useState } from 'react';

const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  })

  const setValue = (value, callback) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
  
      setStoredValue(prevValue => {
        const newValue = valueToStore instanceof Function ? valueToStore(prevValue) : valueToStore;
        window.localStorage.setItem(key, JSON.stringify(newValue));
        if (callback) {
          callback();
        }
        return newValue;
      });
    } catch (error) {
      console.log(error);
    }
  };
  
  return [storedValue, setValue];
};

export default useLocalStorage