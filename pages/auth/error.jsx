import React from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/layout';

const Error = () => {
  const router = useRouter();
  const { error } = router.query;
  return (
    <Layout>
      <h1>Erorror</h1>
      <h3>{error}</h3>
    </Layout>
  );
};

export default Error;
