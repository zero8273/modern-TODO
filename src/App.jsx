import { useState } from 'react';

import ToggleTheme from './components/ToggleTheme';
import { getInitialTheme } from './helpers/getInitialTheme';
import { toggleTheme } from './helpers/toggleTheme';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import { useTodoManagement } from './hooks/useTodoManagement';
import DeleteCompletedButton from './components/DeleteCompletedButton';
import MainComponent from './components/MainComponent';

function App() {
  // const [todos, setTodos] = useState([]);
  const [theme, setTheme] = useState(getInitialTheme());
  // const [delitingId, setDelitingID] = useState(null);
  // const [deleteCompletedConfirm, setDeleteCompletedConfirm] = useState(false);

  const {
    todos,
    delitingId,
    setDelitingID,
    deleteCompletedConfirm,
    setDeleteCompletedConfirm,
    onAdd,
    handleDeleteCompleted,
    confirmDeleteCompleted,
    handleDelete,
    toggleCompleted,
    handleUpdate,
    hasCompleted,
  } = useTodoManagement();

  return (
    <div
      data-theme={theme}
      className="flex flex-col min-h-screen justify-center items-center bg-page-light dark:bg-page-dark p-6"
    >
      <ToggleTheme theme={theme} toggleTheme={() => toggleTheme(setTheme)} />
      <MainComponent
        onAdd={onAdd}
        handleUpdate={handleUpdate}
        setDelitingID={setDelitingID}
        todos={todos}
        toggleCompleted={toggleCompleted}
      />
      {delitingId && (
        <DeleteConfirmModal
          onCancel={() => {
            setDelitingID(null);
          }}
          onConfirm={() => {
            handleDelete(delitingId);
            setDelitingID(null);
          }}
          message={'Ви впевнені що хочете видалити цю задачу ?'}
        />
      )}
      {deleteCompletedConfirm && (
        <DeleteConfirmModal
          onCancel={() => setDeleteCompletedConfirm(false)}
          onConfirm={confirmDeleteCompleted}
          message={`Ви впевнені що хочете видалити всі виконані задачі (${todos.filter((todo) => todo.completed).length})?`}
        />
      )}
      <DeleteCompletedButton
        hasCompleted={hasCompleted}
        onClick={handleDeleteCompleted}
      />
    </div>
  );
}

export default App;
