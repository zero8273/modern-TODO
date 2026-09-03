import { useCallback, useEffect, useRef, useState } from 'react';

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
          <div
            className="flex flex-col items-stretch gap-2 w-full"
            ref={editFormRef}
          >
            <input
              className="w-full px-2 py-1 border-2 focus:outline-none focus:border-blue-500 dark:text-gray-300 rounded text-sm text-gray-700 border-gray-400 "
              type="text"
              value={editText}
              onChange={(e) => {
                setEditText(e.target.value);
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
            <div className="flex flex-col xs:flex-row gap-2 w-full">
              <input
                value={editDeadline}
                onChange={(e) => setEditDeadline(e.target.value)}
                type="datetime-local"
                className="w-full px-2 py-1 border-2  border-gray-400 focus:outline-none focus:border-blue-500 dark:text-gray-300 rounded text-sm text-gray-700 sm:flex-1"
              />
              <button
                onClick={handleSave}
                className="flex items-center justify-center gap-1 px-2 py-1 sm:px-3 sm:py-1 text-green-600 hover:text-green-800 cursor-pointer bg-white dark:bg-transparent border-2 border-green-500 rounded hover:bg-green-100 dark:hover:bg-transparent dark:hover:border-green-800 transition-color text-sm sm:text-base"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  className="w-4 h-4 xs:w-5 xs:h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M5 10l4 4 8-8"
                  />
                </svg>
                <span className="sm:hidden">OK</span>
                <span className="hidden sm:inline">Готово</span>
              </button>
            </div>
          </div>
        ) : (
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
              Створено{' '}
              {new Date(todo.createdAt).toLocaleString('uk-UA', {
                date: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
            {todo.deadline && (
              <span
                className={`text-xs ${todo.completed ? 'text-gray-400' : new Date(todo.deadline) < new Date() ? 'text-red-500' : 'text-gray-500'} `}
              >
                Виконати до{' '}
                {new Date(todo.deadline).toLocaleString('uk-UA', {
                  date: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            )}
          </div>
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
