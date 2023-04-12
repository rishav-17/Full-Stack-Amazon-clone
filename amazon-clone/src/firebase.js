// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from "firebase/compat/app";
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
const firebaseConfig = {
    apiKey: "AIzaSyAAtoR80SD98_5ussLaPGjy71iVbMabreg",
    authDomain: "challange-de07c.firebaseapp.com",
    projectId: "challange-de07c",
    storageBucket: "challange-de07c.appspot.com",
    messagingSenderId: "858151248923",
    appId: "1:858151248923:web:abfb609038a2b9264104be",
    measurementId: "G-01Y1WSSRPL"
  };

  const firebaseApp = firebase.initializeApp(firebaseConfig);

  const db = firebaseApp.firestore();
  const auth = firebase.auth();

  export { db,auth };

export default firebase;