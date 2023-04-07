import React, { useState, useContext, useEffect } from 'react';
import '../../assets/css/forms.css';

import AuthButtons from 'components/AuthButtons/authButtons';
import SignInForm from 'components/Forms/signInForm';
import {
  Container, Row, Col,
} from 'react-bootstrap';
import { FaKeyboard } from 'react-icons/fa';
import code3 from '../../assets/img/code3.jpg'
import Footer from "components/Footer/Footer";

import 'firebase/database'
import useLocalStorage from '../../hooks/useLocalStorage';
import { createUserDocument, getDisplayName, getPhotoURL } from '../../firebase'

import {
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';

function SignIn() {

  const [displayNameLocal, setDisplayNameLocal] = useLocalStorage('displayName', '');

  const [profileImageLocal, setProfileImageLocal] = useLocalStorage('profileImage', '');
  const [runDisplayLocalTest, setRunDisplayLocalTest] = useLocalStorage('getNameTest', '');
  const [firebaseToken, setFirebaseToken] = useLocalStorage('token', '');

  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotPasswordForm, setForgotPasswordForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userNameSignUp, setUserNameSignUp] = useState('');
  const auth = getAuth();
  const [errors, setErrors] = useState({ email: null, provider: null, password: null, forgotEmail: null });
  const [pageMSG, setPageMSG] = useState(null);
  const navigate = useNavigate();

  const handleSignIn = async (event) => {
    event.preventDefault();
    setErrors({});
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      console.log('user uid', user.uid);
      const userMatchUIDDisplayName = await getDisplayName(user.uid);
      const userPhotoURL = await getPhotoURL(user.uid);
    //  console.log( 'user photo url',userPhotoURL)

    //  console.log( 'usdf',userMatchUIDDisplayName)
      await setDisplayNameLocal(userMatchUIDDisplayName);
      console.log(displayNameLocal, 'displayNameLocal');
      await setRunDisplayLocalTest(userMatchUIDDisplayName);
      setProfileImageLocal(userPhotoURL);
      await updateProfile(user, { displayName: userMatchUIDDisplayName });
      const idToken = await user.getIdToken();
      setFirebaseToken('test this out'); // Save the ID token
      console.log('firebaseToken',firebaseToken)
      setEmail('');
      setPassword('');
      setUserNameSignUp('');
      navigate('/');
    } catch (error) {
      console.error(error);
      setErrors(prevErrors => ({ ...prevErrors, email: 'The email and/or password you have provided is incorrect or does not exist. Please create a new accout or click on forgot password.' }));
    }
  };

  const signInFormProps = {
    pageMSG,
    setPageMSG,
    handleSignIn,
    forgotEmail,
    email,
    setEmail,
    setForgotEmail,
    password,
    setPassword,
    sendPasswordResetEmail,
    setErrors,
    auth,
    errors,
    forgotPasswordForm,
    setForgotPasswordForm
  };

  useEffect(() => {
    console.log('Updated firebaseToken:', firebaseToken);
    console.log('idTOKEN',idToken)
  }, [firebaseToken]);


  return (
    <div>
      <Container className="my-5">
        <Row>
          <Col md={6}>
            <img
              src={code3}
              alt="login form"
              className='rounded-start w-100'
            />
          </Col>
          <Col md={4}    >
            <div className='d-flex flex-column'>

              <div className='d-flex flex-row mt-2'>
                <FaKeyboard className="me-1" style={{ color: 'a4f79f', fontSize: '3rem' }} />
                <span className="h3 mb-0">CODE WITH AI</span>
              </div>

              <h5 className="fw-normal my-3 pb-3" style={{ letterSpacing: '1px', color: '#fffe80' }} >Sign into your account</h5>

              <SignInForm
                {...signInFormProps}
              />
              <AuthButtons
                setDisplayNameLocal={setDisplayNameLocal}
                setProfileImageLocal={setProfileImageLocal}
                profileImageLocal={profileImageLocal}
                setErrors={setErrors}
                auth={auth}
              />
              <div className='d-flex flex-row justify-content-start'>
                <Link to="/terms-of-service" className="small text-muted me-1">Terms of use.</Link>
              </div>

            </div>
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
}

export default SignIn;