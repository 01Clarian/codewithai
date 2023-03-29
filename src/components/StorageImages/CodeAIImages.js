import React, { useState, useEffect, useContext } from "react";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { json } from "react-router-dom";
import { ChatContext } from "../../context/chatContext";

const CodeAIImages = ({ imageName, className }) => {
  const [imageUrl, setImageUrl] = useState("");
  const storage = getStorage();
  const defaultIconRef = imageName || 'js.png'
  const imageRef = ref(storage, `coding-icons/${defaultIconRef}`);
  const [, , , , , , , , , , , iconLoaded, setIconLoaded] = useContext(ChatContext)
  useEffect(() => {
    getDownloadURL(imageRef)
      .then((url) => {
        // `url` contains the download URL for the image
        // You can now use this URL to display the image in an `img` tag
        setImageUrl(url);
      })
      .catch((error) => {
        // Handle any errors
        console.error(error);
      });
  }, []);

  return  (
  <>  <img 
  className="cover w-10 h-10 rounded-full mx-auto"
  style={{ width: "45px",  marginRight: "10px"}}
  src={imageUrl}  onLoad={()=> setIconLoaded(true)} />
  </>
  )
};

export default CodeAIImages;