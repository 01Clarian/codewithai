import { useEffect, useState } from 'react';

const useMessageCollection = (displayName) => {
  const [messages, setMessages] = useState([]);

  const addMessage = (message, aiLangIcon) => {
    setMessages(prevMessages => [...prevMessages, { ...message, aiLangIcon }]);
  };

  const clearMessages = () => setMessages([]);

  return [messages, addMessage, clearMessages];
};
export default useMessageCollection;