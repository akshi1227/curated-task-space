
import { Task, TaskFormData } from '../types';

// Use localStorage for storing tasks instead of a backend API
const STORAGE_KEY = 'taskmate_tasks';

// Helper functions for localStorage
const getTasks = async (): Promise<Task[]> => {
  try {
    const tasksJson = localStorage.getItem(STORAGE_KEY);
    if (tasksJson) {
      return JSON.parse(tasksJson);
    }
    return [];
  } catch (error) {
    console.error('Error fetching tasks from localStorage:', error);
    return [];
  }
};

const createTask = async (taskData: TaskFormData): Promise<Task> => {
  try {
    const tasks = await getTasks();
    const uniqueId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newTask: Task = {
      ...taskData,
      id: uniqueId,
      _id: uniqueId, // Keep both ID formats for compatibility
      completed: false
    };
    
    tasks.push(newTask);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return newTask;
  } catch (error) {
    console.error('Error creating task in localStorage:', error);
    throw error;
  }
};

const updateTask = async (id: string, updates: Partial<Task>): Promise<Task> => {
  try {
    const tasks = await getTasks();
    const taskIndex = tasks.findIndex(task => task.id === id || task._id === id);
    
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }
    
    const updatedTask = { ...tasks[taskIndex], ...updates };
    tasks[taskIndex] = updatedTask;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    
    return updatedTask;
  } catch (error) {
    console.error('Error updating task in localStorage:', error);
    throw error;
  }
};

const deleteTask = async (id: string): Promise<void> => {
  try {
    const tasks = await getTasks();
    const filteredTasks = tasks.filter(task => task.id !== id && task._id !== id);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredTasks));
  } catch (error) {
    console.error('Error deleting task from localStorage:', error);
    throw error;
  }
};

export { getTasks, createTask, updateTask, deleteTask };
