import { useState } from 'react';
import { TodoItem } from './components/TodoItem';
import { AddTodo } from './components/AddTodo';
import ToggleTheme from './components/ToggleTheme';
import { getInitialTheme } from './helpers/getInitialTheme';
import { toggleTheme } from './helpers/toggleTheme';

function App() {
  // const initialTodos = [
  //   { id: 1, text: 'Изучить React' },
  //   { id: 2, text: 'Сделать TODO app' },
  //   { id: 3, text: 'Сделать деплой' },
  // ];
  const [todos, setTodos] = useState([]);
  const [theme, setTheme] = useState(getInitialTheme());

  const onAdd = (text, deadline) => {
    const newTodo = {
      id: Date.now(),
      text,
      complated: false,
      createdAt: new Date().toISOString(),
      deadline: deadline,
      order: todos.length + 1,
    };
    setTodos([...todos, newTodo]);
  };

  const onDelete = (id) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  const toggleCompleted = (id) => {
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
