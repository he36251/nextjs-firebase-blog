import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDTTGhf-XrNrVLiCG5scBdlmd4BgcMlJ8o",
  authDomain: "nextjs-firebase-blog-318f5.firebaseapp.com",
  projectId: "nextjs-firebase-blog-318f5",
  storageBucket: "nextjs-firebase-blog-318f5.appspot.com",
  messagingSenderId: "904512650332",
  appId: "1:904512650332:web:6f2dd86b3ec80f9cc43a99",
  measurementId: "G-XPEJJY16X4",
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
