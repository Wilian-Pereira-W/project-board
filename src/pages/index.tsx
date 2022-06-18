import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import boardUser from '../../public/images/board-user.svg';
import styles from '../styles/styles.module.scss';
import { GetStaticProps } from 'next';

export default function Home() {
  return (
    <>
      <Head>
        <title>Board - Organizando suas tarefas</title>
      </Head>
      <main className={styles.contentContainer}>
        <div>
          <Image src={boardUser} alt="Ferramenta board" />
        </div>

        <section className={styles.callToAction}>
          <h1>
            Uma ferramenta para seu dia a dia. Escreva, planeje e organize-se..
          </h1>
          <p>
            <span>100% Gratuita</span> e online.
          </p>
        </section>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
    revalidate: 60 * 60,
  };
};
