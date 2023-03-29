import { getAuth, browserPopupRedirectResolver } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { initializeApp } from 'firebase/app'
import { doc, getDoc, setDoc, collection } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app, { popupRedirectResolver: browserPopupRedirectResolver })
const firestore = getFirestore(app)
const db = getFirestore(app);
const usersRef = collection(db, `users`);
const storage = getStorage(app);

export default storage;

export { usersRef };


export { firebaseConfig, app, auth, firestore }

export const createUserDocument = async(user, additionalData, googleAuthId) => {
  if(!user) return;
  const docRef = doc(db, `users/${user.uid}`)
  const docSnap = await getDoc(docRef);
  const googleAuthIdCaptured = googleAuthId;
//  console.log('docSnap',docSnap)
//  console.log('uid',docSnap._userDataWriter.firestore._firestoreClient.user.uid)
//  console.log('within createUserDoc', googleAuthIdCaptured)
  if (!googleAuthIdCaptured.exists) {
    const email = user;
  //  console.log('from the function createUser', user)
    const displayName = additionalData;
    try {
      await setDoc(doc(usersRef, googleAuthIdCaptured),{
        displayName: displayName,
        email: email,
        createdAt: new Date(),
      });
    } catch (error) {
      console.log('Error in creating user', error);
    }
  }
};

export const getDisplayName = async (uid) => {
  const userRef = doc(db, `users/${uid}`);
  const userSnapshot = await getDoc(userRef);
 // console.log('snapshot',userSnapshot.data().displayName)
  if (userSnapshot.exists) {
    let x = userSnapshot.data().displayName || 'friend';
    return x;
  } else {
    return "my friend";
  }
};

export const getPhotoURL = async (uid) => {
  const userRef = doc(db, `users/${uid}`);
  const userSnapshot = await getDoc(userRef);
//  console.log('photoURL',userSnapshot.data().photoURL)
  if (userSnapshot.exists) {
    let x = userSnapshot.data().photoURL;
    return x;
  } else {
    return "my friend";
  }
};

export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      unsubscribe();
      resolve(user);
    }, reject);
  });
};

