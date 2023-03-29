import React, { useState, useEffect } from 'react';

const Typing = () => {
  const [text, setText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const message = "Typing...";

  useEffect(() => {
    let timerId;
    if (currentIndex < message.length) {
      timerId = setTimeout(() => {
        setText(text + message[currentIndex]);
        setCurrentIndex(currentIndex + 1);
      }, 100);
    } else {
      setText("");
      setCurrentIndex(0);
    }
    return () => clearTimeout(timerId);
  }, [text, currentIndex, message]);

  return (
    <div>
        {text}
    </div>
  );
};

export default Typing;