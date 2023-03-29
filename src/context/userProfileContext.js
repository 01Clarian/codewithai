import React, { createContext, useState} from 'react'
import Image from '../assets/img/faces/i.png'

export const UserProfileContext = createContext({})

export const UserProfileProvider = (props) => {
    const [profileImage, setProfileImage,] = useState(Image || "")
    const [email, setEmail] = useState(null);
    


  return (
    <UserProfileContext.Provider value={{
            profileImage,
            setProfileImage,
            email,
            setEmail
         }}> 
      {props.children}

    </UserProfileContext.Provider>
  )
}