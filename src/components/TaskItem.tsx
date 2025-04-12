
import { useState } from 'react';
import { Task } from '@/types';
import { Calendar, Edit2, Trash2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { format, isValid, parseISO } from 'date-fns';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import TaskForm from './TaskForm';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface TaskItemProps {
  task: Task;
  onComplete: (id: string, completed: boolean) => void;
  onUpdate: (id: string, task: Partial<Task>) => void;
  onDelete: (id: string) => void;
}

const TaskItem = ({ task, onComplete, onUpdate, onDelete }: TaskItemProps) => {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      if (isValid(date)) {
        return format(date, 'PPP');
      }
      return dateString;
    } catch {
      return dateString;
    }
  };

  const getCategoryClass = () => {
    switch (task.category.toLowerCase()) {
      case 'work':
        return 'category-work';
      case 'personal':
        return 'category-personal';
      case 'important':
        return 'category-important';
      case 'shopping':
        return 'category-shopping';
      default:
        return 'category-other';
    }
  };

  const handleEditSubmit = (formData: Partial<Task>) => {
    onUpdate(task.id, formData);
    setShowEditDialog(false);
  };

  const handleDelete = () => {
    onDelete(task.id);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <div className={`task-card group ${task.completed ? 'completed' : ''}`}>
        <div className="flex items-start gap-3">
          <Checkbox
            checked={task.completed}
            onCheckedChange={(checked) => onComplete(task.id, checked as boolean)}
            className="mt-1"
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
              <h3 className={`font-medium text-lg ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                {task.title}
              </h3>
              
              <div className="flex items-center space-x-2 task-actions sm:opacity-100">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowEditDialog(true)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {task.description && (
              <p className={`text-sm text-muted-foreground mt-1 ${task.completed ? 'line-through' : ''}`}>
                {task.description}
              </p>
            )}
            
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className={`task-category ${getCategoryClass()}`}>
                {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
              </span>
              
              {task.dueDate && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {formatDate(task.dueDate)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <TaskForm
            initialData={{
              title: task.title,
              description: task.description,
              dueDate: task.dueDate,
              category: task.category
            }}
            onSubmit={handleEditSubmit}
            onCancel={() => setShowEditDialog(false)}
          />
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the task.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TaskItem;
