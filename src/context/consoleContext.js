import React, { createContext, useState} from 'react'

export const ConsoleContext = createContext({})

export const ConsoleProvider = (props) => {
    const [userInput, setUserInput] = useState('');
    const [userOutput, setUserOutput] = useState('');
    const [loading, setLoading] = useState(false);
    const [modeSwitch, setModeSwitch] = useState(false);
    
  return (
    <ConsoleContext.Provider value={{
        userInput, setUserInput, userOutput, setUserOutput,
        loading, setLoading, modeSwitch, setModeSwitch
         }}> 
      {props.children}

    </ConsoleContext.Provider>
  )
}
