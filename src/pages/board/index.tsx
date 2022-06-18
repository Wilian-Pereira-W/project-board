import React, { useState, FormEvent } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import styles from './styles.module.scss';
import { FiPlus, FiCalendar, FiEdit2, FiTrash } from 'react-icons/fi';
import { getSession } from 'next-auth/react';
import { BoardProps } from '../../interface/Board';
import firebase from '../../services/firebaseConnection';

export default function Board({ user }: BoardProps) {
  const [task, setTask] = useState('');

  const handleAddTask = async (e: FormEvent) => {
    e.preventDefault();

    if (task === '') {
      alert('Preencha alguma tarefa!');
    }

    await firebase
      .firestore()
      .collection('tarefas')
      .add({
        created: new Date(),
        tarefa: task,
        userId: user.id,
        nome: user.nome,
      })
      .then(() => {
        console.log('sucesso');
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <>
      <Head>
        <title>Minhas tarefas - Board</title>
      </Head>
      <main className={styles.container}>
        <form onSubmit={handleAddTask}>
          <input
            type="text"
            placeholder="Digite sua tarefa..."
            value={task}
            onChange={({ target }) => setTask(target.value)}
          />
          <button type="submit">
            <FiPlus size={25} color="#17181F" />
          </button>
        </form>
        <h1>Você tem 2 tarefas!</h1>
        <section>
          <article className={styles.taskList}>
            <p>Aprender criar projetos usando Next JS</p>
            <div className={styles.actions}>
              <div>
                <div>
                  <FiCalendar size={20} color="#FFB800" />
                  <time>07 Junho 2022</time>
                </div>
                <button>
                  <FiEdit2 size={20} color="#FFB800" />
                  <span>Editar</span>
                </button>
              </div>

              <button>
                <FiTrash size={20} color="#FF3636" />
                <span>Excluir</span>
              </button>
            </div>
          </article>
        </section>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

  if (!session?.id) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const user = {
    nome: session?.user.name,
    id: session?.id,
  };
  return {
    props: {
      user,
    },
  };
};
