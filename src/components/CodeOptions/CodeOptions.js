import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Select from 'react-select';
import { TextEditorContext } from '../../context/textEditorContext';
import { ChatContext } from '../../context/chatContext';
import useLocalStorage from '../../hooks/useLocalStorage';
import { ConsoleContext } from "context/consoleContext";

function CodeOptions() {
  const [messages, addMessage, setMessages, , , thinking, setThinking] = useContext(ChatContext)
  const {userOutput, setUserOutput, modeSwitch, setModeSwitch} = useContext(ConsoleContext);
  const { userLang, setUserLang, userTheme, setUserTheme, aiLangIcon, setAiLangIcon } = useContext(TextEditorContext);
  const [storedAiLangIcon, setStoredAiLangIcon] = useLocalStorage('aiLangIcon', 'js.png');

  const navigate = useNavigate();
  
  const customStyles = {
    control: styles => ({
      ...styles,
      backgroundColor: 'black',
      color: 'white',
      marginTop: '5px',
      border: '.2px solid #afec3f',
      borderRadius: '12px',
      margin: '10px',
      minWidth: '140px',
      borderRadius: '4px',
    }),
    option: (styles, { isFocused, isSelected }) => ({
      ...styles,
      backgroundColor: isSelected ? '#afec3f' : isFocused ? '#474747' : null,
      color: isSelected ? '#474747' : isFocused ? 'white' : '#a4f79f',
      padding: '8px',

    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: 'black',
      minWidth: '150px',
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: 'purple',
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: 'purple',
        borderRadius: '6px',
      },
    }),
    placeholder: styles => ({
      ...styles,
      color: 'white',
    }),
  };

  const languages = [
    { value: "c", label: "c" },
    { value: "c++", label: "c++" },
    { value: "python", label: "python" },
    { value: "java", label: "java" },
    { value: "javascript", label: "javascript" },
    { value: "c#", label: "c#" },
    { value: "rust", label: "rust" },
    { value: "go", label: "go" },
    { value: "ruby", label: "ruby" },
    { value: "f#", label: "f#" },
    { value: "perl", label: "perl" },
    { value: "php", label: "php" },
    { value: "dart", label: "dart" },
    { value: "pascal", label: "pascal" },
  ];
  const themes = [
    { value: "monokai", label: "monokai" },
    { value: "github", label: "github" },
    { value: "ambiance", label: "ambiance" },
    { value: "chaos", label: "chaos" },
    { value: "dawn", label: "dawn" },
    { value: "chrome", label: "chrome" },
  ];

  function handleThemeOptions(e) {
    setUserTheme(e.value);
    navigate('/');
  }

  const updateMessage = (newValue, ai = false, aiLangIcon) => {
    const id = Date.now() + Math.floor(Math.random() * 1000000);
    const newMsg = {
      id: id,
      createdAt: Date.now(),
      text: newValue,
      ai: ai,
    };
    addMessage(newMsg, aiLangIcon);
  };


  function handleOptionSelection(e) {
    setUserLang(e.value);
    let aiLangIconValue;
    let consoleLanguage = e.value.charAt(0).toUpperCase() + e.value.slice(1);
    switch (e.value) {
      case "javascript":
        aiLangIconValue = 'js.png';
        updateMessage("Let's get started with Javascript!", true, aiLangIconValue);
        break;
      case "java":
        aiLangIconValue = 'java.png';
        updateMessage('What would you like accomplish with Java today?', true, aiLangIconValue);
        break;
      case "python":
        aiLangIconValue = 'python.png';
        updateMessage('I am happy to get started with you in Python.', true, aiLangIconValue);
        break;
      case "c++":
        aiLangIconValue = 'c++.png';
        updateMessage("I am excited to work on C++ with you.", true, aiLangIconValue);
        break;
      case "c":
        aiLangIconValue = 'c.png';
        updateMessage("How can I help you today with the C language?", true, aiLangIconValue);
        break;
        case "go":
          aiLangIconValue = 'go.png';
          updateMessage("How can we get GOing ;)?", true, aiLangIconValue);
          break;
      case "c#":
        aiLangIconValue = 'c#.png';
        updateMessage("Let's get going with C#!", true, aiLangIconValue);
        break;
      case "php":
        aiLangIconValue = 'php.png';
        updateMessage('How can we get this PHP party started?', true, aiLangIconValue);
        break;
      case "perl":
        aiLangIconValue = 'perl.png';
        updateMessage('It is a pleasure to be working on some Perl with you today.', true, aiLangIconValue);
        break;
      case "rust":
        aiLangIconValue = 'rust.png';
        updateMessage("Always a good time for some Rust.", true, aiLangIconValue);
        break;
      case "pascal":
        aiLangIconValue = 'pascal.png';
        updateMessage("How can I be of assistance with Pascal?", true, aiLangIconValue);
        break;
      case "dart":
        aiLangIconValue = 'dart.png';
        updateMessage("What would you like to with Dart?", true, aiLangIconValue);
        break;
      case "f#":
        aiLangIconValue = 'f#.png';
        updateMessage("Let's get started with F#.", true, aiLangIconValue);
        break;
      case "ruby":
        aiLangIconValue = 'ruby.png';
        updateMessage("How can I be of help in Ruby?", true, aiLangIconValue);
        break;
      default:
        aiLangIconValue = aiLangIcon;
        updateMessage('js', true, aiLangIconValue);
        break;
    }
    setAiLangIcon(aiLangIconValue);
    setUserOutput(`${consoleLanguage} mode active...`)
    modeSwitch && navigate('/')
    // add switch for nav
  }

  return (
    <>
      <div
        style={{ zIndex: '5', }}
      >
        <Select options={languages} value={userLang}
          placeholder={userLang}
          defaultValue={userLang}
          onChange={handleOptionSelection}
          isSearchable={false}
          styles={customStyles} />
      </div>

      <div
        style={{ zIndex: '3', }}
      >
        <Select options={themes} value={userTheme}
          onChange={handleThemeOptions}
          isSearchable={false}
          placeholder={userTheme}
          styles={customStyles} />
      </div>
    </>
  );
}

export default CodeOptions;

