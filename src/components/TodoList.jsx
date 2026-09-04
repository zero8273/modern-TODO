import { TodoItem } from './TodoItem';
const TodoList = ({ todos, toggleCompleted, handleUpdate, setDelitingID }) => {
  return (
    <div className="flex flex-col gap-3">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={() => {
            setDelitingID(todo.id);
          }}
          onToggleCompleted={toggleCompleted}
          onUpdate={handleUpdate}
        />
      ))}
    </div>
  );
};

export default TodoList;
