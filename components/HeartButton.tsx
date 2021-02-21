import { auth, firestore, increament } from "../lib/firebase";
import { useDocument } from "react-firebase-hooks/firestore";

export default function Heart({ postRef }) {
  const heartRef = postRef.collection("hearts").doc(auth.currentUser.uid);
  const [heartDoc] = useDocument(heartRef);

  //Create user-to-post relationship
  const addHeart = async () => {
    const uid = auth.currentUser.uid;

    //Firestore transaction
    const batch = firestore.batch();

    batch.update(postRef, { heartCount: increament(1) });
    batch.set(heartRef, { uid });

    await batch.commit();
  };

  const removeHeart = async () => {
    const batch = firestore.batch();

    batch.update(postRef, { heartCount: increament(-1) });
    batch.delete(heartRef);

    await batch.commit();
  };

  return heartDoc?.exists ? (
    <button onClick={removeHeart}>💔 Unheart</button>
  ) : (
    <button onClick={addHeart}>💗 Heart</button>
  );
}
