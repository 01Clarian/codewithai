import React, {useContext, useEffect} from 'react';
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-ruby";
import "ace-builds/src-noconflict/mode-php";
import "ace-builds/src-noconflict/mode-golang";
import "ace-builds/src-noconflict/mode-perl";
import "ace-builds/src-noconflict/mode-dart";
import "ace-builds/src-noconflict/mode-csharp";
import "ace-builds/src-noconflict/mode-fsharp";
import "ace-builds/src-noconflict/mode-rust";
import "ace-builds/src-noconflict/mode-pascal";


import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-ambiance";
import "ace-builds/src-noconflict/theme-dawn";
import "ace-builds/src-noconflict/theme-chaos";
import "ace-builds/src-noconflict/theme-chrome";

import "ace-builds/src-noconflict/ext-language_tools";

import { TextEditorContext } from '../../context/textEditorContext';

const TextEditor = () => {

    const { 
        userLang, setUserLang, 
        userTheme, setUserTheme, 
        userCode, setUserCode, 
        fontSize, setFontSize
      } = useContext(TextEditorContext);
    
      const editorStyle = { fontSize: `${fontSize}px` };


      // ace converters

      let aceLangConverter = userLang 

  if(userLang == 'c' || userLang == 'c++') {
    aceLangConverter = 'c_cpp'
  }

  if(userLang == 'go') {
    aceLangConverter = 'golang'
  }

  useEffect(() => {
    console.log(userCode);
  }, [userCode]);

  const handleChange = (newValue) => {
    setUserCode(newValue);
};
    return (
        <>
                          <AceEditor
                    className="custom-editor"
                    mode={aceLangConverter}
                    theme={userTheme}
                    value={userCode}                    
                    setOptions={{
                      useWorker: false,
                      wrap: true,
                      wrapBehavioursEnabled: true,
                      autoScrollEditorIntoView: true,
       
                    }}                    fontSize={'18px'}
                    height={'110%'}
                    width={'100%'}
                    style={editorStyle}
                    onChange={handleChange}
                  />
        </>
    )
}

export default TextEditor;