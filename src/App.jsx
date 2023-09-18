import React, { useEffect, useState } from 'react';
import localforage from 'localforage';
import CustomForm from './components/CustomForm';
import TaskList from './components/TaskList';
import EditForm from './components/EditForm';

function App() {
  const [tasks, setTasks] = useState([]);
  const [editedTask, setEditedTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Initialize localforage (usually in your app's entry point)
  localforage.config({
    name: 'my-tasks-app', // Name for the database
    storeName: 'tasks',   // Name for the store
  });

  // Function to save tasks to local storage
  const saveTasksToLocalStorage = (tasks) => {
    localforage.setItem('tasks', tasks);
  };

  // Function to get tasks from local storage
  const getTasksFromLocalStorage = async () => {
    try {
      const savedTasks = await localforage.getItem('tasks');
      return savedTasks || []; // Return an empty array if no tasks are found
    } catch (error) {
      console.error('Error getting tasks from local storage:', error);
      return [];
    }
  };

  // Function to remove tasks from local storage
  const removeTasksFromLocalStorage = () => {
    localforage.removeItem('tasks');
  };

  const addTask = (task) => {
    setTasks((prevState) => [...prevState, task]);
  };

  const deleteTask = (id) => {
    setTasks((prevState) => prevState.filter((t) => t.id !== id));
  };

  const toggleTask = (id) => {
    setTasks((prevState) =>
      prevState.map((t) => (t.id === id ? { ...t, checked: !t.checked } : t))
    );
  };

  const updateTask = (task) => {
    setTasks((prevState) =>
      prevState.map((t) => (t.id === task.id ? { ...t, name: task.name } : t))
    );
    closeEditMode();
  };

  const closeEditMode = () => {
    setIsEditing(false);
  };

  const enterEditMode = (task) => {
    setEditedTask(task);
    setIsEditing(true);
  };

  // Load tasks from local storage when the component mounts
  useEffect(() => {
    const loadTasks = async () => {
      const savedTasks = await getTasksFromLocalStorage();
      setTasks(savedTasks);
    };
    loadTasks();
  }, []);

  // Save tasks to local storage whenever they change
  useEffect(() => {
    saveTasksToLocalStorage(tasks);
  }, [tasks]);

  return (
    <div className="container">
      <header>
        <h1>My Tasks</h1>
      </header>
      {isEditing && <EditForm editedTask={editedTask} updateTask={updateTask} />}

      <CustomForm addTask={addTask} />
      {tasks && (
        <TaskList
          tasks={tasks}
          deleteTask={deleteTask}
          toggleTask={toggleTask}
          enterEditMode={enterEditMode}
        />
      )}
    </div>
  );
}

export default App;
