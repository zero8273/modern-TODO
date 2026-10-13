export const useTodoActions = ({
  todos,
  setTodos,
  createNewTodo,
  createTodo,
  savetoLocalStorage,
  updateTodo,
  deleteTodo,
  setDeleteCompletedConfirm,
}) => {
  const onAdd = async (text, deadline) => {
    const newTodo = createNewTodo(text, deadline, todos.length + 1);

    const updatedTodos = [...todos, newTodo];
    setTodos(updatedTodos);
    try {
      const createdTodo = await createTodo(newTodo);
      const syncedTodos = updatedTodos.map((todo) =>
        todo.id === newTodo.id ? createdTodo : todo,
      );
      setTodos(syncedTodos);
      savetoLocalStorage(syncedTodos);
    } catch (error) {
      console.error('помилка додавання', error);
      setTodos(todos);
    }
  };

  const handleDelete = async (id) => {
    const prevTodos = todos;
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
    savetoLocalStorage(updatedTodos);
    console.log(updatedTodos);
    try {
      await deleteTodo(id);
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
      await updateTodo(id, updatedTodo);
      savetoLocalStorage(updatedTodoList);
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
    try {
      updateTodo(id, updatedTodo);
      savetoLocalStorage(updatedTodoList);
    } catch (error) {
      console.error('помилка оновлення', error);
      setTodos(todos);
    }
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
        await deleteTodo(id);
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
    savetoLocalStorage(todos);
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

    savetoLocalStorage(updatedTodos);

    try {
      for (const todo of updatedTodos) {
        await updateTodo(todo.id, {
          order: todo.order,
        });
      }
    } catch (error) {
      console.error('Помилка сортування:', error);
    }
  };
  const hasCompleted = todos.some((todo) => todo.completed);
  const handleDeleteCompleted = () => {
    if (!hasCompleted) return;
    setDeleteCompletedConfirm(true);
  };

  return {
    onAdd,
    handleDelete,
    handleUpdate,
    toggleCompleted,
    onReorder,
    confirmDeleteCompleted,
    handleDeleteCompleted,
    hasCompleted,
  };
};
