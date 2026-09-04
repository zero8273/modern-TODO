import formatDateTime from '../helpers/dateUtils';
const TodoInformation = ({ todo, setIsEditing }) => {
  return (
    <div
      className="cursor-pointer gap-1 flex flex-col"
      onDoubleClick={() => setIsEditing(true)}
    >
      <span
        className={`text-xl ${
          todo.completed
            ? 'line-through text-gray-400'
            : 'text-gray-700 dark:text-gray-300'
        }`}
      >
        {todo.text}
      </span>

      <span className={`text-xs text-gray-400 `}>
        Створено {formatDateTime(todo.createdAt)}
      </span>
      {todo.deadline && (
        <span
          className={`text-xs ${todo.completed ? 'text-gray-400' : new Date(todo.deadline) < new Date() ? 'text-red-500' : 'text-gray-500'} `}
        >
          Виконати до {formatDateTime(todo.deadline)}
        </span>
      )}
    </div>
  );
};

export default TodoInformation;
