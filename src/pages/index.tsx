import React from 'react';
import Head from 'next/head';
import styles from '../styles/styles.module.scss';

export default function Home() {
  return (
    <>
      <Head>
        <title>Board - Organizando suas tarefas</title>
      </Head>
      <div className={styles.container}>
        <h1>Primeiro</h1>
      </div>
    </>
  );
}
