import { LOCAL_STORAGE_KEY } from '../constants/todos';
export const useLocalStorage = () => {
  const loadFromLocalStorage = () => {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  };

  const savetoLocalStorage = (todo) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todo));
  };
  return { loadFromLocalStorage, savetoLocalStorage };
};
