
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import SearchAndFilter from "@/components/SearchAndFilter";
import { Task, TaskFormData } from "@/types";
import { createTask, deleteTask, getTasks, updateTask } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle } from "lucide-react";

const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showDialog, setShowDialog] = useState(false);
  const { toast } = useToast();

  // Load tasks on initial render
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const data = await getTasks();
        setTasks(data);
        setFilteredTasks(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load tasks",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, [toast]);

  // Filter tasks whenever search query or category changes
  useEffect(() => {
    let result = tasks;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter((task) => task.category === selectedCategory);
    }

    setFilteredTasks(result);
  }, [tasks, searchQuery, selectedCategory]);

  const handleAddTask = async (taskData: TaskFormData) => {
    try {
      const newTask = await createTask(taskData);
      setTasks((prevTasks) => [...prevTasks, newTask]);
      setShowDialog(false);
      toast({
        title: "Success",
        description: "Task added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add task",
        variant: "destructive",
      });
    }
  };

  const handleCompleteTask = async (id: string, completed: boolean) => {
    try {
      await updateTask(id, { completed });
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id || task._id === id ? { ...task, completed } : task
        )
      );
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task status",
        variant: "destructive",
      });
    }
  };

  const handleUpdateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const updatedTask = await updateTask(id, updates);
      setTasks((prevTasks) =>
        prevTasks.map((task) => 
          task.id === id || task._id === id ? updatedTask : task
        )
      );
      toast({
        title: "Success",
        description: "Task updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask(id);
      setTasks((prevTasks) => 
        prevTasks.filter((task) => task.id !== id && task._id !== id)
      );
      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container px-4 mx-auto max-w-4xl">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
            Task Mate
          </h1>
          <p className="text-muted-foreground">
            Your advanced task management solution
          </p>
        </header>

        <div className="mb-6 flex flex-col md:flex-row gap-4 md:items-center justify-between">
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <PlusCircle className="mr-2 h-5 w-5" />
                Add New Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <TaskForm onSubmit={handleAddTask} />
            </DialogContent>
          </Dialog>

          <SearchAndFilter
            searchQuery={searchQuery}
            category={selectedCategory}
            onSearchChange={setSearchQuery}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {isLoading ? (
          <div className="text-center py-10">
            <p>Loading tasks...</p>
          </div>
        ) : (
          <TaskList
            tasks={filteredTasks}
            onCompleteTask={handleCompleteTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
          />
        )}
      </div>
    </div>
  );
};

export default TasksPage;
