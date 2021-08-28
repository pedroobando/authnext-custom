import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/client';
import Layout from '../components/layout';
import AccessDenied from '../components/access-denied';
import Image from 'next/image';

const srcImage =
  'https://cdn.pixabay.com/photo/2021/08/04/21/26/ocean-6522657_960_720.jpg';

export default function Page() {
  const [session, loading] = useSession();
  const [content, setContent] = useState();

  // Fetch content from protected route
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/examples/protected');
      const json = await res.json();

      if (json.content) {
        setContent(json.content);
      }
    };
    fetchData();
  }, [session]);

  // When rendering client side don't display anything until loading is complete
  if (typeof window !== 'undefined' && loading) return null;

  // If no session exists, display access denied message
  if (!session) {
    return (
      <Layout>
        <AccessDenied />
      </Layout>
    );
  }

  // If session exists, display content
  return (
    <Layout>
      <h1>Protected Page</h1>
      {content && (
        <>
          <p>
            <strong>{content || '\u00a0'}</strong>
          </p>
          <Image src={srcImage} alt="preuba" width="300" height="200"></Image>
        </>
      )}
    </Layout>
  );
}
