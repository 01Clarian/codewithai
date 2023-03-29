import React, {useEffect} from 'react';
import {
  Button,
} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

import 'firebase/database'
import { createUserDocument, getDisplayName } from '../../firebase'
import { FcGoogle } from 'react-icons/fc'
import { FaFacebook } from 'react-icons/fa';
import { FaGithub } from "react-icons/fa";
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,

} from 'firebase/auth';
const AuthButtons = (props) => {
  const { setDisplayNameLocal,
    profileImageLocal, setProfileImageLocal,
    setErrors, auth } = props;
  const navigate = useNavigate();

  const SignUpWithGoogle = async (event) => {
    event.preventDefault();
    setDisplayNameLocal("");
    setErrors({});
    const provider = new GoogleAuthProvider();
    
    try {
      const result = await signInWithPopup(auth, provider);
      const userName = result.user.displayName
      const photoURL = result.user.photoURL
      setProfileImageLocal(photoURL);


      setDisplayNameLocal(userName)
      const user = result.user.email;
      const googleAuthId = result.user.uid;
      await createUserDocument(user, userName, googleAuthId);
      navigate('/');
    } catch (error) {
      console.error(error);
      setErrors(prevErrors => ({ ...prevErrors, provider: 'Looks like you have already logged in before with a different provider. Please use that one instead.' }));
    }
  }

  const SignUpWithFacebook = async (event) => {
    event.preventDefault();
    setDisplayNameLocal("");
    setErrors({});
    const provider = new FacebookAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const userName = result.user.displayName;
      const photoURL = result.user.photoURL
      setProfileImageLocal(photoURL);
      setDisplayNameLocal(userName);
      const user = result.user.email;
      const facebookAuthId = result.user.uid;
      await createUserDocument(user, userName, facebookAuthId);
      navigate('/');
    } catch (error) {
      console.error(error);
      setErrors(prevErrors => ({ ...prevErrors, provider: 'Looks like you have already logged in before with a different provider. Please use that one instead.' }));
    }
  };

  const SignUpWithGitHub = async (event) => {
    event.preventDefault();
    setDisplayNameLocal("");
    setErrors({});
    const provider = new GithubAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const userName = result.additionalUserInfo.username;
      const photoURL = result.additionalUserInfo.photoURL
      setProfileImageLocal(photoURL);
      setDisplayNameLocal(userName);
      const user = result.user.email;
      const githubAuthId = result.user.uid;
      await createUserDocument(user, userName, githubAuthId);
      navigate("/");
    } catch (error) {
      console.error(error);
      setErrors(prevErrors => ({ ...prevErrors, provider: 'Looks like you have already logged in before with a different provider. Please use that one instead.' }));
    }
  };

  return (
    <>
      <Button className="px-5 mb-4" variant='dark' size='lg' onClick={SignUpWithGoogle}>
        <FcGoogle />
        Continue with Google
      </Button>
      <Button className="px-5 mb-4" variant='dark' size='lg' onClick={SignUpWithFacebook}>
        <FaFacebook className='m-1' />
        Continue with Facebook
      </Button>
      <Button className="px-5 mb-4" variant='dark' size='lg' onClick={SignUpWithGitHub}>
        <FaGithub className="m-1" />
        Continue with Github
      </Button>
    </>
  )
}

export default AuthButtons;