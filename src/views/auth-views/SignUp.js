import React, { useState, useContext, useEffect } from 'react';
import { Rings } from 'react-loader-spinner';
import '../../assets/css/forms.css';
import AuthButtons from 'components/AuthButtons/authButtons';
import SignUpForm from 'components/Forms/signUpForm';

import {
  Container,
  Row,
  Col,
} from 'react-bootstrap';

import { FaKeyboard } from 'react-icons/fa';
import code4 from '../../assets/img/code4.jpg';
import Footer from "components/Footer/Footer";

import 'firebase/database';
import useLocalStorage from '../../hooks/useLocalStorage';
import { createUserDocument, getDisplayName } from '../../firebase';

import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';

const SignUp = () => {

  const [isVerified, setIsVerified] = useState(false);
  const [token, setToken] = useState("");
  const [displayNameLocal, setDisplayNameLocal] = useLocalStorage('displayName', '');
  const [firebaseToken, setFirebaseToken] = useLocalStorage('token', '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userNameSignUp, setUserNameSignUp] = useState('');
  const [errors, setErrors] = useState({ email: null, provider: null, password: null, forgotEmail: null });
  const [pageMSG, setPageMSG] = useState(null);  const auth = getAuth();
  const navigate = useNavigate();
  const [profileImageLocal, setProfileImageLocal] = useLocalStorage('profileImage', '');
  const [loading, setLoading] = useState();

  const handleSignUp = async (event) => {
    event.preventDefault();
    setErrors({});
    if (password !== confirmPassword) {
      setErrors(prevErrors => ({ ...prevErrors, password: 'The passwords you entered do not match. Please try again'}))
      return;
    }
    if (password == confirmPassword && password.length < 6) {
        setErrors(prevErrors => ({ ...prevErrors, password: 'The password is too short. Please make it at least 6 characters'}))
        return;
    }
    if (!isVerified) {
      // *change Don't allow sign-up if hCaptcha verification has not been completed
      return;
    }
    try {
      setLoading(true);
      // ...
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      const userSignUp = user.email;
      const displayNameSignUp = userNameSignUp;
      const authId = user.uid;
      const idToken = await user.getIdToken();
     // console.log(idToken, 'idtoken')
      setFirebaseToken(idToken); // Save the ID token
      setDisplayNameLocal(displayNameSignUp)
      await createUserDocument(userSignUp, displayNameSignUp, authId);
      await updateProfile(user, { displayName: userNameSignUp });
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setUserNameSignUp('');
      setLoading(false);
      navigate('/');
    } catch (error) {
      console.error(error);
      setLoading(false);
      setErrors(prevErrors => ({ ...prevErrors, email: 'The email you have entered is invalid or already exists. Please sign in or try again.' }));
    }
  };

  useEffect(() => {
  //  console.log('Updated firebaseToken:', firebaseToken);
  }, [firebaseToken]);

  const signInFormProps = {
    pageMSG,
    setPageMSG,
    handleSignUp,
    confirmPassword,
    setConfirmPassword,
    email,
    setEmail,
    password,
    setPassword,
    setErrors,
    auth,
    userNameSignUp,
    setUserNameSignUp,
    errors,
  };
  
  return (
    <div>
      <Container className="my-5 mr-4">
        <Row>
          <Col md={4}>
            <div className='d-flex flex-column'>
  
              <div className='d-flex mt-2 flex-column justify-content-center align-items-center'>
                <FaKeyboard className="me-1" style={{ color: 'a4f79f', fontSize: '3rem', marginBottom: '-32px' }} />
                <span className="h2 mb-2">CODE WITH AI</span>
              </div>
              <div style={{marginTop:'-20px'}}>
              <h5 className="fw-normal my-4 pb-3" style={{letterSpacing: '1px', color: '#4cb8df' }} >Create a new account</h5>
                  <SignUpForm
                  {...signInFormProps}
                  setIsVerified={setIsVerified}
                  token={token}
                  setToken={setToken}
                  /> 
                      {loading ? <Rings
                                color='green'/> : null}
              </div>
              <div className='d-flex flex-row justify-content-start'>
              <Link to="/terms-of-service" className="small text-muted me-1">Terms of use.</Link>
              </div>
              <p className="mb-2 pb-lg-2" style={{ color: 'white' }}>Already have an account? <Link to='/signin' style={{ color: '#f2fe85' }}>Sign In here</Link></p>
              <AuthButtons
                setDisplayNameLocal={setDisplayNameLocal}
                profileImageLocal={profileImageLocal}
                setProfileImageLocal={setProfileImageLocal}
                setErrors={setErrors}
                auth={auth}
              />
        
            </div>
          </Col>
          <Col md={6} style={{ margin: '15px' }}>
            <img
              src={code4}
              alt="login form"
              className='rounded-start w-100'
              style={{
                boxShadow: '0 0 10px 3px white'
              }}
            />
          </Col>
        </Row>
      </Container>
      <Footer />
    </div>
  );
}

export default SignUp;