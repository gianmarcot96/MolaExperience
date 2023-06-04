// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// Firebase App (the core Firebase SDK) is always required and must be listed first
import "https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js";
// If you are using v7 or any earlier version of the JS SDK, you should import firebase using namespace import
// import * as firebase from "firebase/app"

// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import "https://www.gstatic.com/firebasejs/8.10.0/firebase-analytics.js";

// Add the Firebase products that you want to use
import "https://www.gstatic.com/firebasejs/8.10.0/firebase-auth.js";
import "https://www.gstatic.com/firebasejs/8.10.0/firebase-firestore.js";
import "https://www.gstatic.com/firebasejs/8.10.0/firebase-storage.js";

  var firebaseConfig = {
    apiKey: "AIzaSyDWGQpUS-PiyaGfUh6q6PSNg7FEZp1Qy9k",
    authDomain: "molaexperience-170196.firebaseapp.com",
    databaseURL: "https://molaexperience-170196-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "molaexperience-170196",
    storageBucket: "molaexperience-170196.appspot.com",
    messagingSenderId: "993916577338",
    appId: "1:993916577338:web:66715f5f26d979035ef703",
    measurementId: "G-MRL4VLKW3W"
  };
  // Initialize Firebase

  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
