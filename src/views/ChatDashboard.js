import React, { useState, useContext, useEffect } from "react";
import ChatProcessor from "components/ChatProcessor/ChatProcessor.js"
import ANavbar from "components/Navbars/Navbar";
import Footer from "components/Footer/Footer";
import { TextEditorContext } from '../context/textEditorContext';
import { ConsoleContext } from '../context/consoleContext';
import useLocalStorage from '../hooks/useLocalStorage';
import { FiMinimize, FiMaximize } from 'react-icons/fi';
import { MdClear } from 'react-icons/md';
import { NavLink, } from 'react-router-dom';
import { ChatContext } from '../context/chatContext';

import ChatView from "components/ChatView/ChatView";
import {
  Card,
  Container,
  Col,
} from "react-bootstrap";

function ChatDashboard() {

  const [storedAiLangIcon, setStoredAiLangIcon] = useLocalStorage('aiLangIcon', 'js.png');
  const [, , clearMessages, , , , , viewSwitch, setViewSwitch] = useContext(ChatContext)

  const {
    userLang, setUserLang,
    userTheme, setUserTheme,
    userCode, setUserCode,
    fontSize, setFontSize,
    aiLangIcon, setAiLangIcon,
  } = useContext(TextEditorContext);

  const { userInput, setUserInput,
    userOutput, setUserOutput
  } = useContext(ConsoleContext);

  let mentorName = 'Javascript';

  switch (aiLangIcon) {
    case 'js.png':
      mentorName = 'Javascript'
      break;
    case 'java.png':
      mentorName = 'Java'
      break;
    case "python.png":
      mentorName = 'Python'
      break;
    case "c++.png":
      mentorName = 'C++'
      break;
    case "c.png":
      mentorName = 'C'
      break;
    case 'perl.png':
      mentorName = 'Perl'
      break;
    case 'ruby.png':
      mentorName = 'Ruby'
      break;
    case "pascal.png":
      mentorName = 'Pascal'
      break;
    case "c#.png":
      mentorName = 'C#'
      break;
    case "f#.png":
      mentorName = 'F#'
      break;
    case "rust.png":
      mentorName = 'Rust'
      break;
    case "dart.png":
      mentorName = 'Dart'
      break;
    case "php.png":
      mentorName = 'PHP'
      break;
    case "go.png":
      mentorName = 'Go'
      break;
    default:
      mentorName = 'Javascript'
      break;
  }


  useEffect(() => {
  }, [aiLangIcon])

  useEffect(()=> {
    setViewSwitch(true)
  },[])

  return (
    <>
      <ANavbar />
      <Container  >
       
        <Col>
            <p className="card-category text-titles"
              style={{
                fontSize: '18px',
                textShadow: '0 0 2px #78c93e',
                color: '#efe774'

              }}
            > {mentorName} Mentor
              <NavLink 
              to='/#/'
              className="hovertext" data-hover="min">
                <FiMinimize size={32} color="#21b23e"
                  className="min-max"
                  style={{ cursor: 'pointer', height: '20px', marginLeft: '8px' }}
                />
              </NavLink>
              <span className="hovertext" data-hover="clear">

                <MdClear size={32} color="#b22621"
                  onClick={clearMessages}
                  className="min-max"
                  style={{ cursor: 'pointer', height: '20px' }}
                />
              </span>

            </p>
            <Card>
              <div>
                <Card.Body>
                  <div style={{ paddingBottom: '10px' }}>AI Output:
                  </div>
                  <div className="custom-ai-output2"
                        style={{
                          height: '480px'
                        }}
                  >
                    <ChatView
                    />
                  </div>
                </Card.Body>
              </div>
            </Card>
            <div style={{marginTop:'-20px'}}>
            <ChatProcessor
                  userLang={userLang}
                  setUserLang={setUserLang}
                  userTheme={userTheme}
                  setUserTheme={setUserTheme}
                />
                </div>
          </Col>
      </Container>
      <Footer />

    </>
  );
}

export default ChatDashboard;
