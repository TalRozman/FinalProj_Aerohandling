import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

export const MY_SERVER = "https://aerohandling.onrender.com/"

export const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'auto',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    margin: 'auto',
    backgroundColor:'white',
  };

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAj3tlKNVRLUlMX60yyoUc4kZi6VstIH9c",
  authDomain: "myfirstproject-38539.firebaseapp.com",
  databaseURL: "https://myfirstproject-38539-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "myfirstproject-38539",
  storageBucket: "myfirstproject-38539.appspot.com",
  messagingSenderId: "323476997395",
  appId: "1:323476997395:web:fd1a6b489120c62bc706e6",
  measurementId: "G-TEX024WCY0"
};

const app = initializeApp (firebaseConfig);
export const storage = getStorage(app);