
export interface Task {
  _id?: string;
  id?: string; // Keep for compatibility with existing code
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
