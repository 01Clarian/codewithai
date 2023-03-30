import React, {useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import HCaptcha from '@hcaptcha/react-hcaptcha';

import {
    Button,
    Form,
    InputGroup,
} from 'react-bootstrap';


function SignUpForm({
    pageMSG,
    setPageMSG,
    handleSignUp,
    setIsVerified,
    confirmPassword,
    setConfirmPassword,
    email,
    setEmail,
    password,
    setPassword,
    userNameSignUp,
    setUserNameSignUp,
    setErrors,
    auth,
    errors,
  }) {

    const onVerify = (token, ekey) => {
      if (ekey) {
        // handle error
        setIsVerified(false);
      } else {
    
        // handle success
        setIsVerified(true);
      }
    };

    return (
        <>
                        <Form 
              style={{marginTop:'-20px',
              }} onSubmit={handleSignUp}>
                <Form.Group className='mb-4 mt-9'>
                  <Form.Label>Name</Form.Label>
                  <InputGroup size="lg">
                    <Form.Control
                      name="username"
                      type="text"
                      value={userNameSignUp}
                      onChange={(event) => setUserNameSignUp(event.target.value)}
                      required
                    />
                  </InputGroup>
                </Form.Group>
  
                <Form.Group className='mb-4'>
                  <Form.Label>Email address</Form.Label>
                  <InputGroup size="lg">
                    <Form.Control
                      type="text"
                      name="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                    />
                  </InputGroup>
                </Form.Group>
                <Form.Group className='mb-4'>
                  <Form.Label>Password</Form.Label>
                  <InputGroup size="lg">
                    <Form.Control
                      type="password"
                      name="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                    />
                  </InputGroup>
                </Form.Group>
  
                <Form.Group className='mb-4'>
                  <Form.Label>Confirm Password</Form.Label>
                  <InputGroup size="lg">
                    <Form.Control
                      name="confirm_password"
                      type="password"
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      required
                    />
                  </InputGroup>
                </Form.Group>
                {errors.email &&
                <p style={{ color: 'yellow', marginTop: '10px' }}>
                    {errors.email}
                </p>
            }

            {errors.password &&
                <p style={{ color: 'yellow', marginTop: '10px' }}>
                    {errors.password}
                </p>
            }
            {errors.provider &&
                <p style={{ color: 'yellow', marginTop: '10px' }}>
                    {errors.provider}
                </p>
            }
            <div
                  className="my-hcaptcha"
                  style={{marginBottom:'10px'}}
                  ><HCaptcha
                  size={userNameSignUp !== '' ? 'normal' : 'invisible'}
                  theme='dark'
                  width='10'
                  data-image-selection='3'
                  data-error-callback='onError'
                  data-tabindex='1'
  sitekey="356460e2-c367-466f-87cc-3229e62a97aa"
  onVerify={(token,ekey) => onVerify(token, ekey)}
  /></div>
                <Button type="submit" className="mb-4 px-5" variant='dark' size='lg'>Sign Up</Button>
              </Form>
        </>
    );
}

export default SignUpForm;