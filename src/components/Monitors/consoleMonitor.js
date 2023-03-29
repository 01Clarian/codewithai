import React, { useContext, useState, useEffect } from 'react';
import { ConsoleContext } from '../../context/consoleContext';

const ConsoleMonitor = () => {
  const { userInput, setUserInput, userOutput, setUserOutput, loading, setLoading } = useContext(ConsoleContext);

  const [currentText, setCurrentText] = useState('');

  useEffect(() => {
    let intervalId;
  
    if (loading) {
      let index = 0;
      const text = '  Processing..';
  
      intervalId = setInterval(() => {
        setCurrentText((prevText) => {
          const newText = prevText + text[index];
  
          if (newText === text) {
            return '';
          } else {
            return newText;
          }
        });
  
        index = (index + 1) % text.length;
        
      }, 90);
    } else {
      setCurrentText('');
    }
  
    return () => {
      clearInterval(intervalId);
    };
  }, [loading]);

  useEffect(() => {
}, [userOutput]);

  return (
    <>
      {loading ? (
        <span style={{ color: 'yellow' }}>{currentText}</span>
      ) : userOutput ? (
        userOutput
          .split(/([.?!])\s+(?=[a-z])/)
          .filter((sentence) => sentence.trim() !== '')
          .map((sentence, sentenceIndex) => {
            const words = sentence.split(' ');
            let highlightedWords = words.reduce((acc, word, wordIndex) => {
              switch (true) {
                case word.toLowerCase().includes('error'):
                  acc.push(
                    <span key={`${sentenceIndex}-${wordIndex}`} style={{ color: 'red' }}>
                      {word}{' '}
                    </span>
                  );
                  break;
                case word.toLowerCase().includes('warning'):
                  acc.push(
                    <span key={`${sentenceIndex}-${wordIndex}`} style={{ color: 'light-red' }}>
                      {word}{' '}
                    </span>
                  );
                  break;
                case word.toLowerCase().includes('function'):
                  acc.push(
                    <span key={`${sentenceIndex}-${wordIndex}`} style={{ color: 'white' }}>
                      {word}{' '}
                    </span>
                  );
                  break;
                case word.toLowerCase().includes('modules'):
                  acc.push(
                    <span key={`${sentenceIndex}-${wordIndex}`} style={{ color: 'yellow' }}>
                      {word}{' '}
                    </span>
                  );
                  break;
                default:
                  acc.push(word + ' ');
              }
              return acc;
            }, []);

            return <span key={sentenceIndex}>{highlightedWords}</span>;
          })
      ) : (
        'Nothing to show here...'
      )}
    </>
  );
};

export default ConsoleMonitor;