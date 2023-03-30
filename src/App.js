import React from "react";
import { Routes, Route } from "react-router-dom";
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from './firebase';
import Dashboard from "views/Dashboard.js";
import TextEditDashboard from "views/TextEditDashboard";
import ChatDashboard from "views/ChatDashboard";
import User from "./views/UserProfile.js";
import SignIn from "./views/auth-views/SignIn";
import SignUp from "./views/auth-views/SignUp";
import Terms from "./views/Terms.js";
import { ChatContextProvider } from './context/chatContext';
import { TextEditorProvider } from './context/textEditorContext';
import { ConsoleProvider } from './context/consoleContext';
import { UserProfileProvider } from './context/userProfileContext';
import {Rings} from 'react-loader-spinner';


import './assets/css/index.css';

const App = () => {
    const [user, loading] = useAuthState(auth)

    if (loading) {
        // Render a loading indicator or splash screen while waiting for auth state.
        return ( <div
        style={{marginTop:'360px',textAlign:'center', fontWeight:'bold'}}
        >        
        <h4 style={{fontWeight:'normal'}}
        >CODE WITH AI</h4>
        <div
        style={{
        position: "fixed", top: "69%", left: "50%", transform: "translate(-50%, -50%)" 
    }}
        ><Rings
        color="green"

      /></div>
        </div> );
      }

      return (
        <UserProfileProvider>
        <ConsoleProvider>
            <TextEditorProvider>
                <ChatContextProvider>
                        <Routes>
                            <Route path="signin" element={<SignIn />} />
                            <Route exact path='/' element={user ? <Dashboard /> : <SignIn />} />
                            <Route path="/codewithai/user" element={<User />} />
                            <Route path="/signup" element={<SignUp />} />
                            <Route path="/text-editor" element={<TextEditDashboard />} />
                            <Route path="/chatbox" element={<ChatDashboard />} />
                            <Route path="/terms-of-service" element={<Terms />} />
                        </Routes>
                </ChatContextProvider>
            </TextEditorProvider>
        </ConsoleProvider>
        </UserProfileProvider>

    )
}

export default App;