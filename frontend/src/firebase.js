import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBPftkVSaEHp4NIFUnAaa6A8J21escgMfE",

  authDomain: "prepai-38233.firebaseapp.com",

  projectId: "prepai-38233",

  storageBucket:
    "prepai-38233.firebasestorage.app",

  messagingSenderId: "472447961958",

  appId:
    "1:472447961958:web:bdfc792493f312917d56a7",

  measurementId: "G-RW4D2GSB9H",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);