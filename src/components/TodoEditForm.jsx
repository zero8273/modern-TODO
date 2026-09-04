const TodoEditForm = ({
  setEditDeadline,
  setEditText,
  editDeadline,
  editText,
  innerRef,
  handleSave,
}) => {
  return (
    <div className="flex flex-col items-stretch gap-2 w-full" ref={innerRef}>
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
  );
};

export default TodoEditForm;
