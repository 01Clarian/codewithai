import { createContext, useState, useContext } from 'react';
import useMessageCollection from '../hooks/useMessageCollection';

import React from 'react'

const ChatContext = createContext({});


 const ChatContextProvider = (props) => {
  const messageCollection = useMessageCollection();
  const [limit, setLimit] = useState(-1);
  const [thinking, setThinking] = useState(false)
  const [viewSwitch, setViewSwitch] = useState(false)
  const [loadingAPI, setLoadingAPI] = useState(false);
  const [iconLoaded, setIconLoaded] = useState(false);



  return (
    <ChatContext.Provider value={[...messageCollection, limit, setLimit, thinking, setThinking,
    viewSwitch, setViewSwitch, loadingAPI, setLoadingAPI, iconLoaded, setIconLoaded]}>
      {props.children}
    </ChatContext.Provider>
  );
};

export { ChatContext, ChatContextProvider }


