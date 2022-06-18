import React, { useState, FormEvent } from 'react';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import styles from './styles.module.scss';
import { FiPlus, FiCalendar, FiEdit2, FiTrash, FiX } from 'react-icons/fi';
import { getSession } from 'next-auth/react';
import { BoardProps, TaskList } from '../../interface/Board';
import firebase from '../../services/firebase.config';
import { format } from 'date-fns';
import Link from 'next/link';

export default function Board({ user, data }: BoardProps) {
  const [task, setTask] = useState('');
  const [taskList, setTaskList] = useState<TaskList[]>(JSON.parse(data));
  const [taskEdit, setTaskEdit] = useState<TaskList | null>(null);

  const handleAddTask = async (e: FormEvent) => {
    e.preventDefault();

    if (task === '') {
      alert('Preencha alguma tarefa!');
    }

    if (taskEdit) {
      await firebase
        .firestore()
        .collection('tarefas')
        .doc(taskEdit.id)
        .update({
          tarefa: task,
        })
        .then(() => {
          const data = taskList;
          const taskIndex = taskList.findIndex(
            (item) => item.id === taskEdit.id,
          );
          data[taskIndex].tarefa = task;

          setTaskList(data);
          setTaskEdit(null);
          setTask('');
        });
      return;
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
      .then((doc) => {
        const data = {
          id: doc.id,
          created: new Date(),
          createdFormated: format(new Date(), 'dd MMMM yyyy'),
          tarefa: task,
          userId: user.id,
          nome: user.nome,
        };
        setTaskList([...taskList, data]);
        setTask('');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDelete = async (id: string) => {
    await firebase
      .firestore()
      .collection('tarefas')
      .doc(id)
      .delete()
      .then(() => {
        const taskDeleted = taskList.filter((item) => {
          return item.id !== id;
        });
        setTaskList(taskDeleted);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleEditTask = (task: TaskList) => {
    setTaskEdit(task);
    setTask(task.tarefa);
  };

  const handleCancelEdit = () => {
    setTask('');
    setTaskEdit(null);
  };

  return (
    <>
      <Head>
        <title>Minhas tarefas - Board</title>
      </Head>
      <main className={styles.container}>
        {taskEdit && (
          <span className={styles.warnText}>
            <button type="button" onClick={handleCancelEdit}>
              <FiX size={30} color="#FF3636" />
            </button>
            Você está editando uma tarefa!
          </span>
        )}
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
        <h1>
          Você tem {taskList.length}{' '}
          {taskList.length === 1 ? 'tarefa' : 'tarefas'}!
        </h1>
        <section>
          {taskList.map((task) => (
            <article key={task.id} className={styles.taskList}>
              <Link href={`/board/${task.id}`}>
                <p>{task.tarefa}</p>
              </Link>
              <div className={styles.actions}>
                <div>
                  <div>
                    <FiCalendar size={20} color="#FFB800" />
                    <time>{task.createdFormated}</time>
                  </div>
                  <button onClick={() => handleEditTask(task)}>
                    <FiEdit2 size={20} color="#FFB800" />
                    <span>Editar</span>
                  </button>
                </div>

                <button onClick={() => handleDelete(task.id)}>
                  <FiTrash size={20} color="#FF3636" />
                  <span>Excluir</span>
                </button>
              </div>
            </article>
          ))}
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

  const tasks = await firebase
    .firestore()
    .collection('tarefas')
    .where('userId', '==', session?.id)
    .orderBy('created', 'asc')
    .get();

  const data = JSON.stringify(
    tasks.docs.map((item) => {
      return {
        id: item.id,
        createdFormated: format(item.data().created.toDate(), 'dd MMMM yyyy'),
        ...item.data(),
      };
    }),
  );

  const user = {
    nome: session?.user.name,
    id: session?.id,
  };
  return {
    props: {
      user,
      data,
    },
  };
};
