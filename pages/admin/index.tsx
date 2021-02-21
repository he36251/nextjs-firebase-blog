import styles from "../../styles/Admin.module.css";

import React, { useContext, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import toast from "react-hot-toast";
import AuthCheck from "../../components/AuthCheck";
import Metatags from "../../components/Metatags";
import PostFeed from "../../components/PostFeed";
import { UserContext } from "../../lib/context";
import { auth, firestore, serverTimestamp } from "../../lib/firebase";
import kebabCase from "lodash.kebabcase";
import { useRouter } from "next/router";
import { Breadcrumbs } from "nextjs-breadcrumbs";

export default function AdminPage() {
  const breadcrumbs = Breadcrumbs();

  return (
    <>
      <div className="breadcrumb-container">{breadcrumbs}</div>

      <main>
        <h3>Create your new post</h3>
        <Metatags title="admin page" />

        <AuthCheck>
          <CreateNewPost />

          <hr />

          <PostList />
        </AuthCheck>
      </main>
    </>
  );
}

function PostList() {
  const ref = firestore
    .collection("users")
    .doc(auth.currentUser.uid)
    .collection("posts");
  const query = ref.orderBy("createdAt");
  const [querySnapshot] = useCollection(query);

  const posts = querySnapshot?.docs.map((doc) => doc.data());

  return (
    <>
      <h1>Manage your Posts</h1>
      <PostFeed posts={posts} admin />
    </>
  );
}

function CreateNewPost() {
  const router = useRouter();
  const { username } = useContext(UserContext);
  const [title, setTitle] = useState("");

  const slug = encodeURI(kebabCase(title));

  const isValid = title.length > 3 && title.length < 100;

  const createPost = async (e) => {
    e.preventDefault();

    const uid = auth.currentUser.uid;
    const ref = firestore
      .collection("users")
      .doc(uid)
      .collection("posts")
      .doc(slug);

    const data = {
      title,
      slug,
      uid,
      username,
      published: false,
      content: "Empty content",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0,
      randArray: [1, 2, 3],
    };

    await ref.set(data);

    toast.success("post created!");

    router.push(`/admin/${slug}`);
  };

  return (
    <div className={styles.createPost}>
      <form onSubmit={createPost}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title of your new post"
          className={styles.input}
        />
        <p>
          <strong>Slug:</strong> {slug}
        </p>
        <button type="submit" disabled={!isValid} className="btn-green">
          Create New Post
        </button>
      </form>
    </div>
  );
}
