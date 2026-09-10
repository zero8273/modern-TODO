import { API_URL } from '../constants/todos';

export const useTodoApi = () => {
  const fetchTodos = async () => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('failed to fetch todos');
    return response.json();
  };

  const createTodo = async (todo) => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(todo),
    });
    if (!response.ok) throw new Error('failed to create todo');
    return response.json();
  };

  const updateTodo = async (id, todo) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(todo),
    });
    if (!response.ok) throw new Error('failed to update todo');
    return response.json();
  };

  const deleteTodo = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('failed to dlete todo');
    return response;
  };
  return {
    fetchTodos,
    createTodo,
    updateTodo,
    deleteTodo,
  };
};
