import React, { useState, useRef, useEffect, useContext } from 'react'

import { Container, Row, Col, Card } from "react-bootstrap";
import { getAuth, updateProfile } from "firebase/auth";
import { usersRef, getPhotoURL } from "../../firebase";
import moment from 'moment';
import useLocalStorage from '../../hooks/useLocalStorage';
import ChatMessage from '../ChatMessage/ChatMessage.js'
import { ChatContext } from '../../context/chatContext'
import Typing from '../Typing/Typing.js';
import ImageIcon from '../../assets/img/faces/i.png'
import CodeAIImages from "../StorageImages/CodeAIImages";
import { TextEditorContext } from '../../context/textEditorContext';
import Receptionist from '../../assets/img/faces/receptionist.png'

const ChatView = () => {

  const chatWrapperRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [messages, addMessage, setMessages, , ,
    thinking, setThinking, viewSwitch, setViewSwitch] = useContext(ChatContext)
  const [displayNameLocal, setDisplayNameLocal] = useLocalStorage('displayName', '');
  const [profileImageLocal, setProfileImageLocal] = useLocalStorage('profileImage', '');
  const [emailLocal, setEmailLocal] = useLocalStorage('email', '');
  const { aiLangIcon, setAiLangIcon } = useContext(TextEditorContext);
  const [time, setTime] = useState(null);


  useEffect(() => {
  }, [displayNameLocal]);


  useEffect(() => {
    setTime(moment(new Date()).calendar());
  }, []); // 

  const userPhotoFirebase = async (userId) => {
    return await getPhotoURL(userId);
  }

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setEmailLocal(user.email);
        setDisplayNameLocal(user.displayName);
        setProfileImageLocal(user.photoURL);
        userPhotoFirebase(user.uid).then(url => {
          if (url) {
            setProfileImageLocal(url || ImageIcon);
          }
        });
      } else {
        setEmailLocal('');
        setDisplayNameLocal('friend');

      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(()=>{

  },[profileImageLocal])

  useEffect(() => {
    setTimeout(()=>{
      const container = chatWrapperRef.current;
      if(container) {
      const iconElements = container.querySelectorAll('.message__pic');
      if (iconElements.length) {
        const lastIconElement = iconElements[iconElements.length - 1];
        const lastIconPosition = lastIconElement.offsetTop;
        container.scrollTop = lastIconPosition;
      } else {
        container.scrollTop = container.scrollHeight;
      }
    }
    }, 900)
  }, [thinking, messages]);

  const chatWrapperStyle = {
    borderRadius: "15px",
    maxHeight: viewSwitch ? "450px" : "300px",
    overflowY: "scroll",
    overflowX: 'hidden',
    scrollbarWidth: "none",
    msOverflowStyle: "none",
  };


  
  let timeOfDay;
  const date = new Date();

  switch (true) {
    case (date.getHours() >= 3 && date.getHours() < 12):
      timeOfDay = 'morning';
      break;
    case (date.getHours() >= 12 && date.getHours() < 17):
      timeOfDay = 'afternoon';
      break;
    default:
      timeOfDay = 'evening';
  }

  let userName = displayNameLocal.split(' ')[0].charAt(0).toUpperCase() + displayNameLocal.split(' ')[0].slice(1);    
    
  return (
    <Container
    >
      <Row className="d-flex justify-content-center"

      >
        <Col>
          <div
            id="chat1"
            ref={chatWrapperRef}
            style={chatWrapperStyle}
          >
            <Card.Body>
              <div className="message__pic">
                <span>
                  <img
                  style={{ width: "45px",  marginRight: "10px"}}
                  src={Receptionist}/>
                </span>
              </div>
              <span className="message-initial mb-3">
                Good {timeOfDay}, {userName}. Please select a programming language and ask a question or type some code and click on Send.
              </span>
              <div className='text-left message__createdAt mt-3'>
        </div>
              {messages.map((message) => (
                <ChatMessage key={message.id} message={{ ...message }} />
              ))}
              {thinking && (
                <div style={{ paddingBottom: '20px' }}>
                  <div className="message__pic ">
                    <CodeAIImages imageName={aiLangIcon} />
                  </div>
                  <span className="message-typing2">
                    <Typing />
                  </span>
                </div>
              )}
              <div style={{ float: "left", clear: "both" }} ref={messagesEndRef}></div>
            </Card.Body>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default ChatView;