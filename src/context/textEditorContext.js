import React, { createContext, useState, useEffect} from 'react'
import useLocalStorage from '../hooks/useLocalStorage';

export const TextEditorContext = createContext({})

export const TextEditorProvider = (props) => {
    const [userCode, setUserCode] = useState('');
    const [userLang, setUserLang] = useState('javascript');
    const [userTheme, setUserTheme] = useState('monokai');
    const [fontSize, setFontSize] = useState(20);
    const [aiLangIcon, setAiLangIcon] = useLocalStorage('aiLangIcon', 'js.png');

    useEffect(() => {
      localStorage.setItem('aiLangIcon', JSON.stringify('js.png'));
    });
  
  return (
    <TextEditorContext.Provider value={{
        fontSize,
        setFontSize,
        userCode,
        setUserCode,
        userLang,
        setUserLang,
        userTheme,
        setUserTheme,
        aiLangIcon, 
        setAiLangIcon
         }}> 
      {props.children}

    </TextEditorContext.Provider>
  )
}