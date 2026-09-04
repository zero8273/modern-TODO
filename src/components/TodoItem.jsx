import { useCallback, useEffect, useRef, useState } from 'react';
import TodoInformation from './TodoInformation';

export const TodoItem = ({ todo, onDelete, onToggleCompleted, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editDeadline, setEditDeadline] = useState(todo.deadline || '');
  const editFormRef = useRef(null);

  const handleToggle = () => {
    onToggleCompleted(todo.id);
  };
  const handleSave = useCallback(() => {
    if (editText.trim()) {
      onUpdate(todo.id, editText, editDeadline);
    }
    setIsEditing(false);
  }, [editText, editDeadline, todo.id, onUpdate]);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (editFormRef.current && !editFormRef.current.contains(e.target)) {
        handleSave();
      }
    };

    if (isEditing) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isEditing, handleSave]);
  return (
    <div
      className="group flex items-center 
    justify-between p-4 gap-3 bg-white dark:bg-page-dark rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
    >
      <div className="flex items-center gap-3">
        <button
          onClick={handleToggle}
          className={`p-1 rounded-full border-2 cursor-pointer ${
            todo.completed
              ? 'border-green-500 bg-green-500'
              : 'border-gray-300 hover:border-gray-400'
          } transition-colors duration-300`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4 ${
              todo.completed ? 'text-white' : 'text-transparent'
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </button>
        {isEditing ? (
          <TodoEditForm
            setEditDeadline={setEditDeadline}
            setEditText={setEditText}
            editDeadline={editDeadline}
            editText={editText}
            innerRef={editFormRef}
            handleSave={handleSave}
          />
        ) : (
          <TodoInformation todo={todo} setIsEditing={setIsEditing} />
        )}
      </div>
      <button
        onClick={() => onDelete(todo.id)}
        className="cursor-pointer opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all duration-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>
  );
};
