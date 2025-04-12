
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TaskFormData } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { X } from 'lucide-react';

interface TaskFormProps {
  initialData?: TaskFormData;
  onSubmit: (data: TaskFormData) => void;
  onCancel?: () => void;
}

const defaultFormData: TaskFormData = {
  title: '',
  description: '',
  dueDate: new Date().toISOString().split('T')[0],
  category: 'personal'
};

const TaskForm = ({ initialData, onSubmit, onCancel }: TaskFormProps) => {
  const [formData, setFormData] = useState<TaskFormData>(initialData || defaultFormData);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Task title is required",
        variant: "destructive"
      });
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-xl border border-border p-5 shadow-sm">
      {onCancel && (
        <div className="flex justify-end">
          <Button 
            type="button" 
            variant="ghost" 
            size="icon"
            onClick={onCancel} 
            className="h-8 w-8 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      <div className="space-y-2">
        <Input
          name="title"
          placeholder="Task title"
          value={formData.title}
          onChange={handleChange}
          className="text-lg font-medium"
        />
      </div>
      
      <div className="space-y-2">
        <Textarea
          name="description"
          placeholder="Task description (optional)"
          value={formData.description}
          onChange={handleChange}
          className="min-h-[100px] resize-none"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Due Date</label>
          <Input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Category</label>
          <Select value={formData.category} onValueChange={handleCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="work">Work</SelectItem>
              <SelectItem value="personal">Personal</SelectItem>
              <SelectItem value="important">Important</SelectItem>
              <SelectItem value="shopping">Shopping</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="pt-2">
        <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
          {initialData ? 'Update Task' : 'Add Task'}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
