import React, { useEffect, useState } from 'react';
import Layout from '../components/layout';
import AccessDenied from '../components/access-denied';
import { useSession } from 'next-auth/client';

const PageUsuarios = () => {
  const [session, loading] = useSession();
  const [content, setContent] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/examples/gentoken');
      const json = await res.json();

      if (json.token) {
        setContent(json.token);
      }
    };
    fetchData();
  }, [session]);

  // When rendering client side don't display anything until loading is complete
  if (typeof window !== 'undefined' && loading) return null;

  // if (content) responsex().then((retv) => console.log(retv));

  // If no session exists, display access denied message
  if (!session) {
    return (
      <Layout>
        <AccessDenied />
      </Layout>
    );
  }

  return (
    <Layout>
      <h2>Usuarios 3 - {sss}</h2>
      {content && (
        <>
          <p>
            <strong>{content || '\u00a0'}</strong>
          </p>
        </>
      )}
    </Layout>
  );
};

export default PageUsuarios;
