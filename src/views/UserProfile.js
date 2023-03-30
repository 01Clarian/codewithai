import React, { useState, useContext, useEffect, useRef } from "react";
import ANavbar from "components/Navbars/Navbar";
import Footer from "components/Footer/Footer";
import { NavLink, useNavigate } from 'react-router-dom';
import { getAuth, updateProfile, updateEmail, 
        EmailAuthProvider, reauthenticateWithCredential,
        GoogleAuthProvider, reauthenticateWithPopup,
        FacebookAuthProvider, GithubAuthProvider
       } from "firebase/auth";
import { doc, updateDoc, getFirestore, deleteDoc } from "firebase/firestore";
import { usersRef, getPhotoURL } from "../firebase";
import { Rings } from 'react-loader-spinner';
import { ChatContext } from '../context/chatContext'
import { loadStripe } from '@stripe/stripe-js';

import image from '../assets/img/faces/i.png'
import storage from '../firebase.js'
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import 'react-image-crop/dist/ReactCrop.css';
import useLocalStorage from '../hooks/useLocalStorage';

// react-bootstrap components
import {
  Button,
  Card,
  Form,
  Container,
  Row,
  Col,
  ProgressBar
} from "react-bootstrap";

const stripePromise = loadStripe('pk_test_51MnoGbGrQMzRMVY12ubI1U3PA0P56QPfuy9pwGh6t9q4nbpWPJiw25WHtZtFZiVLXOc3NtmLJj623yyrOhOYwclT00yTpQNSRN');

const User = () => {

  const [, , clearMessages] = useContext(ChatContext)

  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [userInfoChanged, setUserInfoChanged] = useState({ email: false, username: false });
  const [pageMessages, setPageMessages] = useState({ info: false, photo: false, error: false, errorFileSize: false });
  const [loaderTrigger, setLoaderTrigger] = useState(false);
  const [userSubscribed, setUserSubscribed] = useState(false);

  const usernameRef = useRef();
  const emailRef = useRef();

  const [file, setFile] = useState("");

  const [percent, setPercent] = useState(0);
  const [showPercent, setShowPercent] = useState(false); // State variable to toggle the visibility of the percentage text

  const [profileImageLocal, setProfileImageLocal] = useLocalStorage('profileImage', '');
  const [displayNameLocal, setDisplayNameLocal] = useLocalStorage('displayName', '');
  const [emailLocal, setEmailLocal] = useLocalStorage('email', '');

  const navigate = useNavigate();

  useEffect(() => {
  }, [loaderTrigger])

  const updateStripeEmail = async (updatedEmail) => {

    const stripe = await stripePromise;

    // Get the email associated with the logged-in user
    const auth = getAuth();
    const userEmail = auth.currentUser.email;
    console.log(userEmail, 'userEmail')

    try {
      const response = await fetch(`https://34.29.64.70:3002/customers/${userEmail}`);
      const data = await response.json();
      console.log('customer data', data.customer)
      const customer = data.customer;

      if (customer) {

        await fetch('https://34.29.64.70:3002/update-stripe-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customerId: customer.id,
            email: updatedEmail
          }),
        });

      } else {
        return;

      }

      if (!response.ok) {
        throw new Error('Failed to update email address in Stripe');
      }

    } catch (err) {
      console.log(err);
      alert('Error cancelling subscription');
    }
  };

  useEffect(() => {

    const checkSubscriptionStatus = async () => {
      const stripe = await stripePromise;
  
      // Get the email associated with the logged-in user
      const auth = getAuth();
      const userEmail = auth.currentUser.email;
      console.log(userEmail, 'userEmail')
  
      try {
        // Retrieve the customer object from the backend API using the email address
        const response = await fetch(`https://34.29.64.70:3002/customers/${userEmail}`);
        const data = await response.json();
        console.log(data, 'data')
        const customer = data.customer;
  
        const subResponse = await fetch(`https://34.29.64.70:3002/get-subscription-id?customerId=${customer.id}`);
        const subData = await subResponse.json();
        const subscriptionId = subData.subscriptionId;
        if (subscriptionId) {
          console.log('you are subscribed')
          setUserSubscribed(true);
        } else {
          console.log('you are not subscribed')
          setUserSubscribed(false);
        }
      } catch (err) {
        console.log(err)
      }
    }
  
    checkSubscriptionStatus();
  
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setPageMessages({ info: null, photo: null, error: null, errorFileSize: null });

    const auth = getAuth();
    const user = auth.currentUser;

    if ((!userInfoChanged.email && !userInfoChanged.username)) {
      setPageMessages(prevState => ({
        ...prevState,
        info: "User info is already up to date."
      }));

      return;
    }

    if (newUsername.trim() === '' && newEmail.trim() === '') {
      setPageMessages(prevState => ({
        ...prevState,
        error: "Both name and email cannot be empty."
      }));

      return;
    }

    setLoaderTrigger(true);

    console.log('username to verify against stripe', newEmail)

    await updateStripeEmail(newEmail);

    try {
      // database
      const newData = {};
      if (newUsername.trim() !== '') {
        newData.displayName = newUsername;
      }
      if (newEmail.trim() !== '') {
        newData.email = newEmail;
      }
      newData.photoURL = profileImageLocal; // add this line to store the URL in Firestore
      await updateDoc(doc(usersRef, user.uid), newData);

      // auth
      const newProfileData = {};
      if (newUsername.trim() !== '') {
        newProfileData.displayName = newUsername;
      }
      if (newEmail.trim() !== '') {
        const credential = promptForCredentials(); // prompt the user to re-authenticate
        await reauthenticateWithCredential(user, credential);
        await updateEmail(user, newEmail.trim()); // update the email in the authentication database
        newProfileData.email = newEmail.trim();
      }
      await updateProfile(user, newProfileData);

      setPageMessages({
        info: "Profile info updated successfully.", photo: null,
        error: null, errorFileSize: null
      });

      setLoaderTrigger(false);
      setShowPercent(false);
      setUserInfoChanged({ email: false, username: false });
      if (newUsername.trim() !== '') {
        setDisplayNameLocal(newUsername);
      }
      if (newEmail.trim() !== '') {
        setEmailLocal(newEmail);
      }
    } catch (error) {
      console.error(error);
      setPageMessages({ photo: null, info: null, error: "Failed to update profile", errorFileSize: null });
    }
  };

  // Helper function to prompt the user for their current credential
  const promptForCredentials = () => {
    const password = prompt("Please enter your current password to continue:");
    const auth = getAuth();
    const credential = EmailAuthProvider.credential(auth.currentUser.email, password);
    return credential;
  }

 // helper for users with no password access for changes
const reauthenticateUser = async (user) => {
  const auth = getAuth();
  const providerId = user.providerData[0].providerId;
  console.log('providerId', providerId);
  
  if (providerId === "password") {
    const credential = promptForCredentials();
    await reauthenticateWithCredential(user, credential);
  } else if (providerId === "google.com") {
    console.log('this works google.com');
    const provider = new GoogleAuthProvider();
    await reauthenticateWithPopup(user, provider);
  } else if (providerId === "facebook.com") {
    console.log('this works facebook.com');
    const provider = new FacebookAuthProvider();
    await reauthenticateWithPopup(user, provider);
  } else if (providerId === "github.com") {
    console.log('this works github.com');
    const provider = new GithubAuthProvider();
    await reauthenticateWithPopup(user, provider);
  } else {
    throw new Error(`Unsupported provider: ${providerId}`);
  }
};

  function handleFileChange(event) {
    setPageMessages({
      info: null, error: null, photo: null, errorFileSize: null
    });

    try {
      if (event.target.files[0].size > 3 * 1024 * 1024) {
        throw new Error("File size exceeds 3MB limit");
      }

      setFile(event.target.files[0]);

      setPercent(0); // Reset the progress bar
      setShowPercent(true);

      // Rest of the code...
    } catch (error) {
      console.error(error);
      setPageMessages({ info: null, error: null, photo: null, errorFileSize: error.message });
    }

    // Upload the selected image to Firebase storage
    const user = getAuth().currentUser;
    if (user) {
      const storageRef = ref(storage, `/users/${user.uid}/photoURL/${event.target.files[0].name}`);
      const uploadTask = uploadBytesResumable(storageRef, event.target.files[0]);

      // Track the upload progress
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setPercent(percent);
        },
        (error) => {
          console.error(error);
          alert("Failed to upload file");
        },
        async () => {
          // Get the URL of the uploaded file
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          setProfileImageLocal(url);
          setLoaderTrigger(false);
          setShowPercent(false);
          try {
            await updateDoc(doc(usersRef, user.uid), {
              displayName: usernameRef.current.value,
              email: emailRef.current.value,
              photoURL: url, // Update the URL in Firestore
            });

            await updateProfile(user, {
              displayName: usernameRef.current.value,
              email: emailRef.current.value,
            });

            setPageMessages({ error: null, info: null, photo: "Profile pic updated successfully.", errorFileSize: null })
            setDisplayNameLocal(usernameRef.current.value);

          } catch (error) {
            console.error(error);
            alert("Failed to update profile");
          }
        }
      );
    }
  }

  const handleChange = (e) => {

    const { name, value } = e.target;
    if (name === 'username') {
      setNewUsername(value);
      setUserInfoChanged({ ...userInfoChanged, username: true });
    } else if (name === 'email') {
      setNewEmail(value);
      setUserInfoChanged({ ...userInfoChanged, email: true });
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    const confirmed = window.confirm("Are you sure you want to delete your account?");
    if (confirmed) {
      const auth = getAuth();
      const user = auth.currentUser;
  
      // Re-authenticate the user based on their provider
      try {
        await reauthenticateUser(user);
      } catch (error) {
        console.error("Error re-authenticating user:", error);
        return;
      }
  
      // Continue with the rest of your handleDeleteAccount function
      try {
        // Retrieve the customer object from the backend API using the email address
        const response = await fetch(`https://34.29.64.70:3002/customers/${user.email}`);
        const data = await response.json();
        const customer = data.customer;
  
        const subResponse = await fetch(`https://34.29.64.70:3002/get-subscription-id?customerId=${customer.id}`);
        const subData = await subResponse.json();
        const subscriptionId = subData.subscriptionId;
        if (subscriptionId) {
          // Call your backend to cancel the subscription
          const cancelResponse = await fetch('https://34.29.64.70:3002/cancel-subscription', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              customerId: customer.id,
              subscriptionId: subscriptionId,
            }),
          });
          const cancelData = await cancelResponse.json();
          console.log('cancelData', cancelData);
        }
      } catch (e) {
        console.log(e);
      }
  
      try {
        // Delete the user data from Firestore
        const db = getFirestore();
        const userRef = doc(db, "users", user.uid);
        await deleteDoc(userRef);
  
        // Delete the user account
        await user.delete();
        setDisplayNameLocal("");
        setProfileImageLocal("");
        window.sessionStorage.clear();
        clearMessages();
        navigate("/");
  
        // Redirect to the login page
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleCheckoutClick = async (event) => {
    event.preventDefault();
    const auth = getAuth();
    const userEmail = auth.currentUser.email;
    const userName = auth.currentUser.displayName;
    console.log(userName);
    const stripe = await stripePromise;

    // Call your backend to create a checkout session and get the session ID
    const response = await fetch('https://34.29.64.70:3002/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: userEmail,
        name: userName
      }),
    });

    const data = await response.json();

    console.log('data', data)

    if (data.error === 'Customer already has an active subscription') {
      return alert('You already have an active subscription');
    }

    // Redirect to Stripe Checkout
    const result = await stripe.redirectToCheckout({
      sessionId: data.sessionId,
    });

    if (result.error) {
      console.error(result.error.message);
    }
  };

  const handleCancelSubscriptionClick = async (event) => {
    event.preventDefault();

    const stripe = await stripePromise;

    // Get the email associated with the logged-in user
    const auth = getAuth();
    const userEmail = auth.currentUser.email;
    console.log(userEmail, 'userEmail')

    try {
      // Retrieve the customer object from the backend API using the email address
      const response = await fetch(`https://34.29.64.70:3002/customers/${userEmail}`);
      const data = await response.json();
      console.log(data, 'data')
      const customer = data.customer;

      const subResponse = await fetch(`https://34.29.64.70:3002/get-subscription-id?customerId=${customer.id}`);
      const subData = await subResponse.json();
      const subscriptionId = subData.subscriptionId;

      // Call your backend to cancel the subscription
      const cancelResponse = await fetch('https://34.29.64.70:3002/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: customer.id,
          subscriptionId: subscriptionId,
        }),
      });

      const cancelData = await cancelResponse.json();

      console.log('cancelData', cancelData);
      if (cancelData.message === 'Error cancelling subscription') {
        return alert('You do not have a subscription to cancel.')
      }
      // Display a message to the user to confirm that their subscription has been cancelled
      alert('Your subscription has been cancelled.');
      setUserSubscribed(false);
      // You can also update your UI here to reflect that the user's subscription has been cancelled
    } catch (err) {
     // console.log(err);
      alert('You are currently not subscribed.');
    }
  };

  return (
    <>

      <ANavbar />
      <Container fluid>
        <Row>
          <Col md="8">
            <Card>
              <Card.Header>
                <Card.Title as="h4" className="mb-2">Edit Profile</Card.Title>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col className="pr-1" md="5">
                      <Form.Group>
                        <label>Username</label>
                        <Form.Control
                          defaultValue={displayNameLocal}
                          placeholder={displayNameLocal}
                          type="text"
                          name="username"
                          ref={usernameRef}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col className="pr-1" md="5">
                      <Form.Group>
                        <label htmlFor="exampleInputEmail1">Email address</label>
                        <Form.Control
                          defaultValue={emailLocal}
                          type="email"
                          name="email"
                          ref={emailRef}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md="12">
                      <Form.Group>
                        <label>Coding Objectives</label>
                        <Form.Control
                          cols="80"
                          placeholder="Let your AI mentors know your objectives to better guide you. Be as detailed as you would like."
                          rows="4"
                          as="textarea"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="clearfix mt-3">
                    <Button type="submit" style={{ color: "black" }}>
                      Update Info
                    </Button>
                    <span>
                      <span className="no-icon m-0 link-custom2"
                        style={{ color: 'blue', fontSize: '12px', padding: '10px', cursor: 'pointer' }}
                        onClick={handleDeleteAccount} to="/#/user">Delete Account</span>
                      {loaderTrigger && <Rings color="green" />}</span>

                    {pageMessages.info && (
                      <p style={{ color: "green", marginTop: "10px" }}>{pageMessages.info}</p>
                    )}
                    {pageMessages.error && (
                      <p style={{ color: "red", marginTop: "10px" }}>{pageMessages.error}</p>
                    )}
                  </div>
                </Form>
              </Card.Body>
            </Card>
            <Button
              onClick={handleCheckoutClick} style={{ color: "white" }}>
              Subscribe
            </Button>
            <Button
              className='m-3'
              onClick={handleCancelSubscriptionClick} style={{ color: "white" }}>
              Cancel Subscription
            </Button>
            {userSubscribed ? <p
            style={{ color: "#92ea92" }}
            >You are currently subscribed!</p> :
            <p
            style={{ color: "red" }}
            >You are currently not subscribed</p>
            }
          </Col>
          <Col md="4">
            <Card className="card-user">
              <div className="card-image"></div>
              <Card.Body>
                <div className="author">
                  <h4 style={{ color: 'black' }}>Update Profile Pic</h4>

                  <img
                    alt="..."
                    className="avatar custom-image border-gray"
                    src={profileImageLocal || image}
                  ></img>
                  <div className="file-input" style={{ justifyContent: "center", color: "black" }} className="clearfix">
                    <label className="custom-file-upload"
                      style={{ color: 'white' }}
                    >
                      <input
                        className="file-input__input "

                        type="file" accept="image/*" onChange={handleFileChange} />
                      <span>
                        <svg
                          width="20px"
                          aria-hidden="true"
                          focusable="false"
                          data-prefix="fas"
                          data-icon="upload"
                          className="svg-inline--fa fa-upload fa-w-16"
                          role="img"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 512 512"
                        >     <path
                          fill="currentColor"
                          d="M296 384h-80c-13.3 0-24-10.7-24-24V192h-87.7c-17.8 0-26.7-21.5-14.1-34.1L242.3 5.7c7.5-7.5 19.8-7.5 27.3 0l152.2 152.2c12.6 12.6 3.7 34.1-14.1 34.1H320v168c0 13.3-10.7 24-24 24zm216-8v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h136v8c0 30.9 25.1 56 56 56h80c30.9 0 56-25.1 56-56v-8h136c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z"
                        ></path>
                        </svg>
                      </span>
                    </label>
                    {showPercent && <div className="progress-container mt-2">
                      <span><ProgressBar
                        variant="info" now={percent} label={`${percent}%`} /> </span>
                    </div>
                    }
                  </div>
                  {pageMessages.photo && (
                    <p style={{ color: "green", marginTop: "10px" }}>{pageMessages.photo}</p>
                  )}

                  {pageMessages.errorFileSize && (
                    <p style={{ color: "red", marginTop: "10px" }}>{pageMessages.errorFileSize}</p>
                  )}
                </div>
              </Card.Body>
              <hr></hr>
            </Card>
          </Col>
        </Row>
      </Container>
      <br />
      <Footer />
    </>
  );
}

export default User;
