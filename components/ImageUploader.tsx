import { useState } from "react";
import { auth, serverTimestamp, STATE_CHANGED, storage } from "../lib/firebase";
import Loader from "./Loader";

export default function ImageUploader() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState(null);

  const uploadFile = async (e) => {
    //get file
    const file = Array.from(e.target.files)[0] as File;
    const extension = file.type.split("/")[1];

    //Create reference to storage bucket location
    const ref = storage.ref(
      `uploads/${auth.currentUser.uid}/${serverTimestamp}.${extension}`
    );

    //Start upload
    const task = ref.put(file);

    task.on(STATE_CHANGED, (snapshot) => {
      console.log('upload state changed')

      const percentUploaded = Number((
        (snapshot.bytesTransferred / snapshot.totalBytes) *
        100
      ).toFixed(0));

      setProgress(percentUploaded);

      //Get download url after upload complete
      task
        .then((doc) => ref.getDownloadURL())
        .then((url) => {
          setDownloadURL(url);
          setUploading(false);
        });
    });
  };

  return (
    <div className="box">
      <Loader show={uploading} />
      {uploading && <h3>{progress}%</h3>}

      {!uploading && (
        <label className="btn">
          📸 Upload img
          <input
            type="file"
            onChange={uploadFile}
            accept="image/x-png,image/gif,image/jpeg"
          />
        </label>
      )}

      {downloadURL && (
        <code className="upload-snippet">{`![image url](${downloadURL})`}</code>
      )}
    </div>
  );
}
