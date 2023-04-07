import React, { useState, useContext, useEffect } from 'react';
import Axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { ConsoleContext } from '../../context/consoleContext';
import { TextEditorContext } from '../../context/textEditorContext';
import { UserProfileContext } from '../../context/userProfileContext';
import { ChatContext } from '../../context/chatContext';
import { auth } from '../../firebase';
import useLocalStorage from '../../hooks/useLocalStorage';
import { consoleInitializer } from 'utilities/CompilerInitializers';

const MAX_TOKENS_PER_API_CALL = 2048;

const MAX_MESSAGE_HISTORY_LENGTH = 4;

function ChatProcessor() {
  const {
    userInput,
    setUserInput,
    userOutput,
    setUserOutput,
    loading,
    setLoading,
  } = useContext(ConsoleContext);
  const {
    userLang,
    userCode,
    setUserCode,
    aiLangIcon,
    setAiLangIcon,
  } = useContext(TextEditorContext);

  const navigate = useNavigate();

  const [messages, addMessage, setMessages, limit, setLimit, 
  thinking, setThinking, ,, loadingAPI, setLoadingAPI,
  iconLoaded, setIconLoaded] = useContext(ChatContext);

  const {email, setEmail} = useContext(UserProfileContext);

  const [displayNameLocal, setDisplayNameLocal] = useLocalStorage('displayName','');
  const [firebaseToken, setFirebaseToken] = useLocalStorage('token', '');
  const [messageHistory, setMessageHistory] = useState([]);

  useEffect(() => {
    console.log('fireBasetoken in chat process', firebaseToken)
    // Wait for authentication state to load before rendering component
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setEmail(user.email);
      }
    });

    return () => unsubscribe();
  }, []);


  useEffect(()=>{

  },[iconLoaded])

  function compile() {
    setLoading(true);
    setUserOutput('');

    Axios.post('https://compile.codewithai.org/compile', {
      code: userCode || consoleInitializer(userLang),
      language: userLang,
      input: userInput,
    })
      .then((res) => {
        const output =
          res.data.output.replace(/jdoodle/gi, 'codeWithAi') || res.data.error;
        setUserOutput(output);
        console.log('user data response:', output);
      })
      .catch((error) => {
        console.error('Error:', error);
      !userOutput ? setUserOutput(`Looks like you haven't typed any code in the text editor...`)
      : setUserOutput(`The compiler has experienced a processing error...`)

      })
      .finally(() => {
        setLoading(false);
      });
  }

  const updateMessage = (newValue, ai = false) => {
    const id = Date.now() + Math.floor(Math.random() * 1000000);
    const iconTag = ai ? aiLangIcon : 'human';
    const newMsg = {
      id: id,
      createdAt: Date.now(),
      text: newValue,
      ai: ai,
    };
    setThinking(false);
    addMessage(newMsg, iconTag);
  };

  const delayTyping = () => {
    setTimeout(()=>{
      setThinking(true)
    },100)
  }

  const sendMessage = async (e) => {
    e.preventDefault();
    if (loadingAPI) return;
    setLoadingAPI(true);
    console.log(email, 'email')

    if (!userCode && !userInput) {
      setLoadingAPI(false);
      updateMessage(
        "Please don't forget to ask a question and/or type some code into the text editor.",
        true
      );
      return;
    }

    // create message history
    const newMessage = `${userCode} ${userInput}`;
    let messageHistoryCopy = [...messageHistory, newMessage].map((msg) =>
      JSON.stringify(msg)
    );

    if (messageHistoryCopy.length > MAX_MESSAGE_HISTORY_LENGTH) {
      messageHistoryCopy = messageHistoryCopy.slice(-MAX_MESSAGE_HISTORY_LENGTH);
    }

    console.log(messageHistoryCopy, 'messageHistoryCopy');

    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const POST_URL = BASE_URL + 'davinci';

    let userName = displayNameLocal.split(' ')[0].charAt(0).toUpperCase() + displayNameLocal.split(' ')[0].slice(1);    
    
    !userInput ? updateMessage('Analyze the following...', false) : updateMessage(userInput, false);

    let aiMessage = userCode
    
      ? `this is additional code for context: ${userCode} and this is the question that needs to be answered: ${userInput}`
      : `this is the question that needs to be answered: ${userInput}`;

      setThinking(true);

    const response = await fetch(POST_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${firebaseToken}`,
      },
      body: JSON.stringify({
        prompt: `Respond in chat format with an explanation and code example or solution to the following message like you are a friendly and encouraging senior ${userLang} tutor speaking to ${userName}.  
        These questions should be based on the context of the following online coding lesson and conversation where ${aiMessage}. 
        IT IS VERY IMPORTANT THAT If the question and code is referring to a different coding language other than ${userLang} then also let ${userName}  know to select a different AI Mentor in the dropdown menu above, but if it's a library or framework that is part of the language selected then continue to provide detailed explanations and answers to their questions. 
        The following words are the message history wrapped in 5 asterixes of the conversation only to be used as reference and last priority if you are unsure of the general context: ***** ${messageHistoryCopy} *****`,
        email: email,
        userInput: userInput, // Include userInput in the request body
      }),
    }).then((res) => res.json());
    console.log('limit',response.limit);
    console.log('response', response)
    console.log(response.status, 'response statuss')
    if (response.status === 429) {
      updateMessage(
        "You have reached your limit of free test requests. In order to unlock the AI Mentor and use the App, please go to Account and click subscribe for unlimited access.",
        true
      );
      setThinking(false);
      setLoadingAPI(false);
      alert('You have reached your limit of free test requests. In order to unlock the AI Mentor and use the App, please go to Account and click subscribe for unlimited access.')
      navigate('/user');
      return;
    }
    compile();
    setThinking(false);
  updateMessage(response.bot, true); 

    setMessageHistory([
      ...messageHistoryCopy,
      {
        text: userInput,
        createdAt: Date.now(),
        ai: false,
      },
      {
        text: response.bot,
        createdAt: Date.now(),
        ai: true,
      },
    ]);

    setThinking(false);
    setLoadingAPI(false);
    setUserInput('');
  };

  function handleInputChange(event) {
    setUserInput(event.target.value);
  }

  return (
    <div style={{ margin: '30px 0 30px', width: '100%' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <textarea
          placeholder="Ask a question..."
          className="text-input"
          style={{ margin: '3px', width: '100%' }}
          value={userInput}
          onChange={handleInputChange}
        />
        <button className="custom-button" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatProcessor;