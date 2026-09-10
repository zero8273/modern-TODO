import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { useTodoHelpers } from './useTodoHelpers';
import { useTodoApi } from './useTodoApi';
import { useTodoActions } from './useTodoAction';

export const useTodoManagement = () => {
  const [todos, setTodos] = useState([]);
  const [delitingId, setDelitingID] = useState(null);
  const [deleteCompletedConfirm, setDeleteCompletedConfirm] = useState(false);
  const { loadFromLocalStorage, savetoLocalStorage } = useLocalStorage();
  const { createTodo, deleteTodo, fetchTodos, updateTodo } = useTodoApi();
  const { createNewTodo, sortTodos } = useTodoHelpers();
  const actions = useTodoActions({
    todos,
    setTodos,
    createNewTodo,
    createTodo,
    savetoLocalStorage,
    updateTodo,
    deleteTodo,
    setDeleteCompletedConfirm,
  });

  useEffect(() => {
    const loadingInitialData = async () => {
      const savedTodos = loadFromLocalStorage();
      const sortedSavedTodos = sortTodos(savedTodos);
      setTodos(sortedSavedTodos);
      try {
        const serverTodos = await fetchTodos();
        const sortServerTodos = sortTodos(serverTodos);
        setTodos(sortServerTodos);
        savetoLocalStorage(serverTodos);
      } catch (error) {
        console.error('помилка завантаження даних', error);
      }
    };
    loadingInitialData();
  }, []);

  return {
    todos,
    delitingId,
    setDelitingID,
    deleteCompletedConfirm,
    ...actions,
  };
};
