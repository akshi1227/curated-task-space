
export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  category: string;
  completed: boolean;
}

export interface TaskFormData {
  title: string;
  description: string;
  dueDate: string;
  category: string;
}
