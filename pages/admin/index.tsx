import Head from "next/head";
import Metatags from "../../components/Metatags";

export default function AdminPage() {
    return (
        <main>
            <Metatags title="admin page" />
            <h1>Admin posts</h1>
        </main>
    );
}