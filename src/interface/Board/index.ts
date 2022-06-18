export type TaskList = {
  id: string;
  created: string | Date;
  createdFormated?: string;
  tarefa: string;
  userId: string;
  nome: string;
};

export interface BoardProps {
  user: {
    id: string;
    nome: string;
  };
  data: string;
}
