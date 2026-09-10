export const useTodoHelpers = () => {
  const createNewTodo = (text, deadline, order) => {
    return {
      id: `temp_${Date.now()}`,
      text,
      completed: false,
      createdAt: new Date().toISOString(),
      deadline: deadline || null,
      order,
    };
  };

  const sortTodos = (todo) => {
    return [...todo].sort((a, b) => a.order - b.order);
  };
  return { createNewTodo, sortTodos };
};
