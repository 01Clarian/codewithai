const MAX_MESSAGE_HISTORY_LENGTH = 4;

export const debugCompiler = async (userLang, userInput, userOutput, userCode, setThinking, setUserInput,
  email, messageHistory, setMessageHistory, addMessage, loadingAPI, setLoadingAPI,
    aiLangIcon) => {

    const updateMessage = (newValue, ai = false) => {
    const id = Date.now() + Math.floor(Math.random() * 1000000);
    const iconTag = ai ? aiLangIcon : 'human';
    const newMsg = {
        id: id,
        createdAt: Date.now(),
        text: newValue,
        ai: ai,
    };

    addMessage(newMsg, iconTag);
    };

    const delayTyping = () => {
      setTimeout(()=>{
        setThinking(true)
      },500)
    }

    const promptError = `Provide a solution of the code from the error in the console compiler of the language ${userLang} caused by the following code ${userCode}. that it can work in the compiler. Also provide a written explanation. This is the error: ${userOutput}`;


    if (loadingAPI) return;
    setLoadingAPI(true);

    let messageHistoryCopy = [...messageHistory, userCode].map((msg) =>
      JSON.stringify(msg)
    );

    if (messageHistoryCopy.length > MAX_MESSAGE_HISTORY_LENGTH) {
      messageHistoryCopy = messageHistoryCopy.slice(-MAX_MESSAGE_HISTORY_LENGTH);
    }

   // console.log(messageHistoryCopy, 'messageHistoryCopy');
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const POST_URL = BASE_URL + 'davinci';

    setThinking(true);
    updateMessage('Debug the console...', false);

    console.log('debug email', email)

    const response = await fetch(POST_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        prompt: userOutput ? promptError : 'write a very short and funny message explaining that there is nothing compiled in the compiler and nothing to debug at this time.',
        messageHistory: messageHistoryCopy,
        email:email,
        userInput: userInput, // Include userInput in the request body
      }),

    }).then((res) => res.json());

    if (response.status === 429) {
      updateMessage(
        "You have reached your limit of free test requests. In order to unlock the AI Mentor and use the App, please go to Account and click subscribe for unlimited access.",
        true
      );
      setThinking(false);
      setLoadingAPI(false);
      alert('You have reached your limit of free test requests. In order to unlock the AI Mentor and use the App, please go to Account and click subscribe for unlimited access.')
      return;
    }
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
    console.log("userOutput aaa", userOutput)
    setThinking(false);
    setLoadingAPI(false);
    setUserInput('');
  };
