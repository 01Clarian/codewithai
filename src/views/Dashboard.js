import React, { useState, useContext, useEffect } from "react";
import ChatProcessor from "components/ChatProcessor/ChatProcessor.js"
import ANavbar from "components/Navbars/Navbar";
import Footer from "components/Footer/Footer";
import ConsoleMonitor from "components/Monitors/consoleMonitor";
import { TextEditorContext } from '../context/textEditorContext';
import { ConsoleContext } from '../context/consoleContext';
import TextEditor from "components/TextEditor/textEditor";
import useLocalStorage from '../hooks/useLocalStorage';
import { FiMaximize } from 'react-icons/fi';
import { MdClear } from 'react-icons/md';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import ChatView from "components/ChatView/ChatView";
import { ChatContext } from '../context/chatContext';
import { debugCompiler } from "utilities/ai-requests/DebugCompilerRequest";
import { UserProfileContext } from '../context/userProfileContext';

import {
  Card,
  Container,
  Row,
  Col
} from "react-bootstrap";

function Dashboard() {

  const [messages, addMessage, clearMessages, setMessages, , 
    thinking, setThinking, viewSwitch, setViewSwitch,
    loadingAPI, setLoadingAPI] =
    useContext(ChatContext);
    
  const {
    userLang, setUserLang,
    userTheme, setUserTheme,
    userCode, setUserCode,
    fontSize, setFontSize,
    aiLangIcon, setAiLangIcon,
  } = useContext(TextEditorContext);

  const {email, setEmail} =
  useContext(UserProfileContext);

  const {  userInput, setUserInput, userOutput, setUserOutput,
    loading, setLoading, modeSwitch, setModeSwitch
  } = useContext(ConsoleContext);

  const [messageHistory, setMessageHistory] = useState([]);

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
    setViewSwitch(false)
    setModeSwitch(false)
  })

  useEffect(() => {
  }, [userOutput]);
  

 const handleClearCode = () => {
    setUserCode('')
 }

 const handleDebug = (e) => {
  e.preventDefault()
  debugCompiler(userLang, userInput, userOutput, userCode, setThinking, setUserInput,
    email, messageHistory, setMessageHistory, addMessage, loadingAPI, setLoadingAPI,
    aiLangIcon
    )
 }

 const handleClear = (e) => {
  e.preventDefault()
  setUserOutput('')
 }

  return (
    <>
      <ANavbar />
      <Container fluid>
        <Row className="custom-row" >
          <Col md="6 " >
            <p className="card-category"
              style={{
                marginLeft: '20px',
                fontSize: '18px',
                textShadow: '0 0 2px #C8C8C8',
                color: '#efe774'
              }}
            >
              Text Editor      <input
                className="custom-input"
                type="range" min="18" max="30"
                value={fontSize} step="2"
                onChange={(e) => { setFontSize(e.target.value) }} />
              <NavLink
                to="#/text-editor"
                className="hovertext"
                data-hover="max">
                <FiMaximize size={32} color="#21b23e"
                  className="min-max"
                  style={{ cursor: 'pointer', height: '20px' }}
                />
              </NavLink>
              <span className="hovertext" data-hover="clear">

                <MdClear 
                  onClick={handleClearCode}
                  size={32} color="#b22621"
                  className="min-max"
                  style={{ cursor: 'pointer', height: '20px' }}
                />
              </span>

            </p>
            <Card className="custom-card" >
              <Card.Body style={{ position: "relative", top: "-20px" }}>
                <div id="chartHours"
                  style={{
                    height: '480px'
                  }}
                >
                  <TextEditor
                    height={'400px'}
                  />
                </div>
              </Card.Body>
              <Card.Footer>
                <ChatProcessor
                  userLang={userLang}
                  setUserLang={setUserLang}
                  userTheme={userTheme}
                  setUserTheme={setUserTheme}
                />
              </Card.Footer>
            </Card>
          </Col>
          <Col md="6">

            <p className="card-category text-titles"
              style={{
                fontSize: '18px',
                textShadow: '0 0 2px #78c93e',
                color: '#efe774'

              }}
            > {mentorName} Mentor
              <NavLink
                to="#/chatbox"
                className="hovertext"
                data-hover="max">
                <FiMaximize size={32} color="#21b23e"
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
            <Card >
              <div>
                <Card.Body>
           
                  <div style={{ paddingBottom: '20px' }}>AI Output:
                  </div>
                  <div className="custom-ai-output"
                  >
                    <ChatView />
                  </div>
                  <hr></hr>
                  <div>
                    Console Output:
                    <div className="custom-console-output"
                    >
                      <ConsoleMonitor />
                    </div>
                    <button
                    className="custom-button-console" size='sm'
                    onClick={handleDebug}
                    style={{margin:'5px'}}
                    >DEBUG</button>
                    <button
                    className="custom-button-console" size='sm'
                    onClick={handleClear}
                    >CLEAR</button>
                  </div>
 
                </Card.Body>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
      <Footer />

    </>
  );
}

export default Dashboard;
