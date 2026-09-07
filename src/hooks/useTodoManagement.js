import { useState, useEffect } from 'react';
export const useTodoManagement = () => {
  const LOCAL_STORAGE_KEY = 'todos';
  const API_URL = 'https://6a96e4990e3240db90617db5.mockapi.io/api/v1/todos';

  const [todos, setTodos] = useState([]);
  const [delitingId, setDelitingID] = useState(null);
  const [deleteCompletedConfirm, setDeleteCompletedConfirm] = useState(false);

  useEffect(() => {
    const loadingInitialData = async () => {
      const savedTodos = JSON.parse(
        localStorage.getItem(LOCAL_STORAGE_KEY) || '[]',
      );
      const sortedSavedTodos = [...savedTodos].sort(
        (a, b) => a.order - b.order,
      );
      setTodos(sortedSavedTodos);
      try {
        const response = await fetch(API_URL);
        if (response.ok) {
          const serverTodos = await response.json();
          const sortServerTodos = [...serverTodos].sort(
            (a, b) => a.order - b.order,
          );
          setTodos(sortServerTodos);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(serverTodos));
        }
      } catch (error) {
        console.error('помилка завантаження даних', error);
      }
    };
    loadingInitialData();
  }, []);

  const onAdd = async (text, deadline) => {
    const newTodo = {
      id: `temp_${Date.now()}`,
      text,
      completed: false,
      createdAt: new Date().toISOString(),
      deadline: deadline,
      order: todos.length + 1,
    };
    const updatedTodos = [...todos, newTodo];
    setTodos(updatedTodos);
    // localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedTodos));
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(newTodo),
      });
      const createdTodo = await response.json();
      const syncedTodos = updatedTodos.map((todo) =>
        todo.id === newTodo.id ? createdTodo : todo,
      );
      setTodos(syncedTodos);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(syncedTodos));
    } catch (error) {
      console.error('помилка додавання', error);
      setTodos(todos);
    }
  };
  const handleDelete = async (id) => {
    const prevTodos = todos;
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);

    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedTodos));
    } catch (error) {
      console.error('помилка видалення', error);
      setTodos(prevTodos);
    }
  };

  const handleUpdate = async (id, newText, newDeadline) => {
    const todoForUpdate = todos.find((todo) => todo.id === id);
    if (!todoForUpdate) return;
    const updatedTodo = {
      ...todoForUpdate,
      text: newText,
      deadline: newDeadline,
    };
    const updatedTodoList = todos.map((todo) =>
      todo.id === id ? updatedTodo : todo,
    );
    setTodos(updatedTodoList);
    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(updatedTodo),
      });
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedTodoList));
    } catch (error) {
      console.error('помилка оновлення', error);
      setTodos(todos);
    }
  };

  const toggleCompleted = async (id) => {
    const todoForUpdate = todos.find((todo) => todo.id === id);

    if (!todoForUpdate) return;

    const updatedTodo = {
      ...todoForUpdate,
      completed: !todoForUpdate.completed,
    };

    const updatedTodoList = todos.map((todo) =>
      todo.id === id ? updatedTodo : todo,
    );
    setTodos(updatedTodoList);
    // localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedTodoList));
    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(updatedTodo),
      });
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedTodoList));
    } catch (error) {
      console.error('помилка оновлення', error);
      setTodos(todos);
    }
  };

  const hasCompleted = todos.some((todo) => todo.completed);
  const handleDeleteCompleted = () => {
    if (!hasCompleted) return;
    setDeleteCompletedConfirm(true);
  };
  const confirmDeleteCompleted = async () => {
    const originalTodos = [...todos];
    setTodos(originalTodos.filter((todo) => !todo.completed));
    setDeleteCompletedConfirm(false);
    const completedIds = [...originalTodos]
      .filter((todo) => todo.completed)
      .map((todo) => todo.id);

    const failedDeletingIds = [];
    for (const id of completedIds) {
      try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      } catch (error) {
        console.error('помилка видалення', error);
        failedDeletingIds.push(id);
      }
    }
    if (failedDeletingIds.length > 0) {
      setTodos(
        originalTodos.filter(
          (todo) => !todo.completed || failedDeletingIds.includes(todo.id),
        ),
      );
    }

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
  };
  const onReorder = async (activeID, overId) => {
    if (!overId) return;

    const activeIndex = todos.findIndex((todo) => todo.id === activeID);
    const overIndex = todos.findIndex((todo) => todo.id === overId);

    if (activeIndex === -1 || overIndex === -1 || activeIndex === overIndex) {
      return;
    }

    const newTodos = [...todos];

    const [movedTodo] = newTodos.splice(activeIndex, 1);

    newTodos.splice(overIndex, 0, movedTodo);

    const updatedTodos = newTodos.map((todo, index) => ({
      ...todo,
      order: index + 1,
    }));

    setTodos(updatedTodos);

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedTodos));

    try {
      for (const todo of updatedTodos) {
        const response = await fetch(`${API_URL}/${todo.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            order: todo.order,
          }),
        });

        if (!response.ok) {
          throw new Error(`Не вдалося оновити todo ${todo.id}`);
        }
      }
    } catch (error) {
      console.error('Помилка сортування:', error);
    }
  };

  return {
    todos,
    delitingId,
    setDelitingID,
    deleteCompletedConfirm,
    setDeleteCompletedConfirm,
    onAdd,
    handleDeleteCompleted,
    confirmDeleteCompleted,
    handleDelete,
    toggleCompleted,
    handleUpdate,
    hasCompleted,
    onReorder,
  };
};
