import Header from './Header';
import TodoList from './TodoList';
import { AddTodo } from './AddTodo';
import TodoFilter from './TodoFilter';
import { useState } from 'react';

const MainComponent = ({
  onAdd,
  handleUpdate,
  setDelitingID,
  todos,
  toggleCompleted,
}) => {
  const [filter, setFilter] = useState('all');
  const filteredTodos = todos.filter((todo) => {
    if (filter === 'completed') return todo.completed;
    if (filter === 'active') return !todo.completed;
    return true;
  });
  return (
    <div className="mx-auto flex flex-col gap-3">
      <Header />
      <AddTodo onAdd={onAdd} />
      <TodoFilter filter={filter} setFilter={setFilter} />
      <TodoList
        handleUpdate={handleUpdate}
        setDelitingID={setDelitingID}
        todos={filteredTodos}
        toggleCompleted={toggleCompleted}
      />
    </div>
  );
};

export default MainComponent;
