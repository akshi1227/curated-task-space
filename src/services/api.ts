
import { Task, TaskFormData } from '../types';

// This is a mock API service that simulates backend calls
// In a real app, you would replace these with actual API calls to your Node.js backend

// Mock data
const MOCK_TASKS: Task[] = [
  {
    id: '1',
    title: 'Complete React project',
    description: 'Finish implementing the Task Mate application',
    dueDate: '2025-04-18',
    category: 'work',
    completed: false
  },
  {
    id: '2',
    title: 'Go grocery shopping',
    description: 'Buy fruits, vegetables, and milk',
    dueDate: '2025-04-13',
    category: 'shopping',
    completed: true
  },
  {
    id: '3',
    title: 'Gym workout',
    description: 'Complete 30 minutes of cardio and strength training',
    dueDate: '2025-04-14',
    category: 'personal',
    completed: false
  }
];

// Store tasks in local storage
const loadTasks = (): Task[] => {
  const saved = localStorage.getItem('tasks');
  if (saved) {
    return JSON.parse(saved);
  }
  // Initialize with mock data if empty
  localStorage.setItem('tasks', JSON.stringify(MOCK_TASKS));
  return MOCK_TASKS;
};

const saveTasks = (tasks: Task[]): void => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

// API functions
export const getTasks = async (): Promise<Task[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(loadTasks());
    }, 300);
  });
};

export const createTask = async (task: TaskFormData): Promise<Task> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const tasks = loadTasks();
      const newTask: Task = {
        ...task,
        id: Date.now().toString(),
        completed: false
      };
      
      tasks.push(newTask);
      saveTasks(tasks);
      resolve(newTask);
    }, 300);
  });
};

export const updateTask = async (id: string, updates: Partial<Task>): Promise<Task> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const tasks = loadTasks();
      const taskIndex = tasks.findIndex(t => t.id === id);
      
      if (taskIndex === -1) {
        reject(new Error('Task not found'));
        return;
      }
      
      tasks[taskIndex] = { ...tasks[taskIndex], ...updates };
      saveTasks(tasks);
      resolve(tasks[taskIndex]);
    }, 300);
  });
};

export const deleteTask = async (id: string): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const tasks = loadTasks();
      const updatedTasks = tasks.filter(t => t.id !== id);
      saveTasks(updatedTasks);
      resolve();
    }, 300);
  });
};
