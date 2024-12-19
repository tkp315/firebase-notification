// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getMessaging, getToken, isSupported } from "firebase/messaging";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC7eoKFwpeXNH0KfP5uXzjh1NCmZ4kXXdo",
  authDomain: "fir-61f66.firebaseapp.com",
  projectId: "fir-61f66",
  storageBucket: "fir-61f66.firebasestorage.app",
  messagingSenderId: "731456850392",
  appId: "1:731456850392:web:56db706c0e3de305078aad",
  measurementId: "G-QMQVRQWP4V"
};

// Initialize Firebase
const app = getApps().length===0?initializeApp(firebaseConfig):getApp();

const messaging = async()=>{
    const supported = await isSupported();
    return supported? getMessaging(app):null;
}

export const fetchToken = async ()=>{
    try {
        const fcmMessaging = await messaging();
        if(fcmMessaging){
            const token = await getToken(fcmMessaging,{vapidKey:process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY})
          return token
        }
        return null;
    } catch (error) {
        console.log('an error occured',error);
        return null;
    }
}

export {app,messaging}
