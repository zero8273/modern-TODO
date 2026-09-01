import { useEffect, useState } from 'react';
import { TodoItem } from './components/TodoItem';
import { AddTodo } from './components/AddTodo';
import ToggleTheme from './components/ToggleTheme';
import { getInitialTheme } from './helpers/getInitialTheme';
import { toggleTheme } from './helpers/toggleTheme';

const LOCAL_STORAGE_KEY = 'todos';
const API_URL = 'https://6a96e4990e3240db90617db5.mockapi.io/api/v1/todos';

function App() {
  // const initialTodos = [
  //   { id: 1, text: 'Изучить React' },
  //   { id: 2, text: 'Сделать TODO app' },
  //   { id: 3, text: 'Сделать деплой' },
  // ];
  const [todos, setTodos] = useState([]);
  const [theme, setTheme] = useState(getInitialTheme());

  useEffect(() => {
    const loadingInitialData = async () => {
      const savedTodos = JSON.parse(
        localStorage.getItem(LOCAL_STORAGE_KEY) || '[]',
      );
      setTodos(savedTodos);
      try {
        const response = await fetch(API_URL);
        if (response.ok) {
          const serverTodos = await response.json();
          setTodos(serverTodos);
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

  const onDelete = async (id) => {
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

  return (
    <div
      data-theme={theme}
      className="flex flex-col min-h-screen justify-center items-center bg-page-light dark:bg-page-dark p-6"
    >
      <ToggleTheme theme={theme} toggleTheme={() => toggleTheme(setTheme)} />
      <div className="mx-auto flex flex-col gap-3">
        <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-8">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
            My Todo App
          </span>
        </h1>
        <AddTodo onAdd={onAdd} />
        <div className="flex flex-col gap-3">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onDelete={onDelete}
              onToggleCompleted={toggleCompleted}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
