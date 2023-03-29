import React, {useContext, useEffect, useState} from 'react';
import moment from 'moment';
import Image from '../../assets/img/faces/i.png';
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkGfm from 'remark-gfm'
import { ChatContext } from '../../context/chatContext';
import useLocalStorage from '../../hooks/useLocalStorage';
import CodeAIImages from "../StorageImages/CodeAIImages";

import { usersRef, getPhotoURL, auth } from "../../firebase";
import { getAuth, updateProfile } from "firebase/auth";


const ChatMessage = (props) => {
  
  const { id, createdAt, text, ai = false, picUrl, aiLangIcon, aiStream = false } = props.message;
  const [, , , , , thinking, setThinking, ,,,, iconLoaded, setIconLoaded] = useContext(ChatContext)
  const [profileImageLocal, setProfileImageLocal] = useLocalStorage('profileImage', '');
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const userPhotoFirebase = async (userId) => {
    const auth = getAuth();
    return await getPhotoURL(userId);
  }

  useEffect(()=> {
    if (iconLoaded) {
      setTimeout(()=> {
        setIsImageLoaded(true);
      },200)
    }
},[iconLoaded])


  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user && !profileImageLocal) {
        userPhotoFirebase(user.uid).then(url => setProfileImageLocal(url || null));
      } 
    });
    return () => unsubscribe();
  }, []);

  return (
    <div key={id} className={`${ai ? 'flex-row-reverse' : ''} `}>
      {ai && aiLangIcon && (
        <div className="message__pic ">
          <CodeAIImages imageName={aiLangIcon}

          />
        </div>
      )}
      {!ai && (
        <div className="message__pic text-right">
          <img
            className=" mx-auto avatar border-gray"
            src={profileImageLocal || Image}
            alt="profile pic"
            style={{ marginLeft: "10px" }}

          />
        </div>
      )}
      <div>
      <div className="code-container" >
      {isImageLoaded && (
        <ReactMarkdown
          className={`message__markdown ${ai ? 'text-left' : 'text-right '} ${
            ai ? ' message-ai' : 'message-human human-time'
          }`}
          children={text}
          remarkPlugins={[[remarkGfm, { singleTilde: false }]]}
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || 'language-js ');
              return !inline && match ? (

                <div style={{ maxWidth: '100%' }}>
                <SyntaxHighlighter
                  children={String(children).replace(/\n$/, '')}
                  style={atomDark}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                />
              </div>
              ) : (
                <code className={className} {...props}
                >
                  {children}{" "}
                </code>
              );
            },
          }}
          style={{ overflowWrap: 'break-word' }}
          />
      )}
            {isImageLoaded && (
        <div className={`${ai ? 'text-left' : 'text-right '} message__createdAt mt-3`}>
          {moment(createdAt).calendar()}
        </div>
            )}
      </div>
      </div>
    </div>
  );
};

export default ChatMessage;