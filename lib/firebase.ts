import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "firebase_apikey",
  authDomain: "firebase_authdomain",
  projectId: "firebase_projectid",
  storageBucket: "firebase_storagebucket",
  messagingSenderId: "firebase_messagingsenderid",
  appId: "firebase_appid",
  measurementId: "firebase_measurementid",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

//Auth
export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
export const facebookAuthProvider = new firebase.auth.FacebookAuthProvider();
export const emailAuthProvider = new firebase.auth.EmailAuthProvider();

//Firestore
export const firestore = firebase.firestore();
export const fromMillis = firebase.firestore.Timestamp.fromMillis;
export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;
export const increament = firebase.firestore.FieldValue.increment;

//Firebase storage
export const storage = firebase.storage();
export const STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED;

/**
 * Get username from firestore
 * @param username
 */
export async function getUserWithUsername(username) {
  const usersRef = firestore.collection("users");
  const query = usersRef.where("username", "==", username).limit(1);
  const userDoc = (await query.get()).docs[0];

  return userDoc;
}

/**
 * Map firestore to json
 * @param doc
 */
export function postToJSON(doc) {
  const data = doc.data();

  return {
    ...data,
    createdAt: data.createdAt.toMillis(),
    updatedAt: data.updatedAt.toMillis(),
  };
}
