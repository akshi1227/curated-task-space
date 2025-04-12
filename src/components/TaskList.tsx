
import { Task } from '@/types';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onCompleteTask: (id: string, completed: boolean) => void;
  onUpdateTask: (id: string, task: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
}

const TaskList = ({ tasks, onCompleteTask, onUpdateTask, onDeleteTask }: TaskListProps) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No tasks found. Create a new task to get started!</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskItem
          key={task._id || task.id}
          task={task}
          onComplete={onCompleteTask}
          onUpdate={onUpdateTask}
          onDelete={onDeleteTask}
        />
      ))}
    </div>
  );
};

export default TaskList;
