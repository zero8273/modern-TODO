const TodoFilter = ({ setFilter, filter }) => {
  const buttonClasses = (currentFilter) =>
    `px-4 py-2 rounded transition-color cursor-pointer   ${filter === currentFilter ? 'bg-blue-500 text-white' : 'bg-blue-200 dark:bg-gray-700 haver:bg-gray-300 dark:hover:bg-gray-600'}`;

  return (
    <div className="flex flex-col gap-2 mb-4  sm:flex-row ">
      <button onClick={() => setFilter('all')} className={buttonClasses('all')}>
        Всі
      </button>
      <button
        onClick={() => setFilter('active')}
        className={buttonClasses('active')}
      >
        Не виконані
      </button>
      <button
        onClick={() => setFilter('completed')}
        className={buttonClasses('completed')}
      >
        Виконані
      </button>
    </div>
  );
};

export default TodoFilter;
