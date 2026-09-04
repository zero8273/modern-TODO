const DeleteCompletedButton = ({ hasCompleted, onClick }) => {
  if (!hasCompleted) return null;
  return (
    <button
      className="bg-red-500 hover:bg-red-600 text-white rounded transition-colors cursor-pointer px-4 py-2 mt-4"
      onClick={onClick}
    >
      Видалити виконані
    </button>
  );
};

export default DeleteCompletedButton;
