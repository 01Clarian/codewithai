import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
    Button,
    Form,
    InputGroup,
} from 'react-bootstrap';

function SignInForm({
    pageMSG,
    setPageMSG,
    signInAll,
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
    setForgotPasswordForm,
  }) {

    const handleForgotPassword = async (event) => {
        event.preventDefault();
        try {
            await sendPasswordResetEmail(auth, forgotEmail);
            setPageMSG("An email has been sent to reset your password.");
        } catch (error) {
            console.error(error);
            setErrors(prevErrors => ({ ...prevErrors, password: 'The email you have provided does not exist. Please create a new accout and try again.' }));

        }
    };

    return (
        <>
            <Form onSubmit={handleSignIn}>
                <Form.Group className='mb-3'>
                    <Form.Label>Email address</Form.Label>
                    <InputGroup size="lg">
                        <Form.Control
                            type="text"
                            value={email}
                            name="email"
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
                <Button type="submit" className="mb-4 px-5" variant='dark' size='lg'>Login</Button>
            </Form>

            {pageMSG &&
                <p style={{ color: 'yellow', marginTop: '10px' }}>
                    {pageMSG}
                </p>
            }

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

            <a className="small mb-2"
                style={{ color: '#83d3e5' }}
                href="#!"
                onClick={() => setForgotPasswordForm(true)}>Forgot password?</a>

            {errors.provider &&
                <p style={{ color: 'yellow', marginTop: '10px' }}>
                    {errors.provider}
                </p>
            }

            {forgotPasswordForm &&
                <Form onSubmit={handleForgotPassword}>
                    <Form.Group className='mb-4'>
                        <InputGroup size="lg">
                            <Form.Control
                                type="email"
                                name="forgot_email"
                                onChange={(event) => setForgotEmail(event.target.value)}
                                required
                            />
                        </InputGroup>
                    </Form.Group>
                    <Button type="submit" 
                    style={{backgroundColor:'purple'}}
                    className="mb-4 px-5" variant='dark' size='lg'>Reset Password</Button>
                </Form>
            }
            <p className="mb-2 pb-lg-2" style={{ color: 'white' }}>Don't have an account? <Link to='/signup' style={{ color: '#f2fe85' }}>Sign Up here</Link></p>
        </>
    );
}

export default SignInForm;