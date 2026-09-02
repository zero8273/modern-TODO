const DeleteConfirmModal = ({ onCancel, onConfirm, message }) => {
  return (
    <>
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-black/50 z-4 backdrop-blur-xs"></div>
        <div className="relative flex justify-center items-center h-full  z-5 px-4 py-2">
          <div className="p-6 rounded-lg shadow-xl max-w-md w-full mx-4 bg-white text-gray-800 dark:bg-gray-800 dark:text-white">
            <h3 className="text-xl font-bold mb-2">Підтвердження видалення</h3>
            <p className="mb-6">{message}</p>
            <div className="flex justify-end gap-4">
              <button
                className="min-w-26 rounded bg-red-500 py-2 px-4 hover:bg-red-600 transition-colors cursor-pointer"
                onClick={onConfirm}
              >
                Видалити
              </button>
              <button
                className="min-w-26 rounded py-2 px-4 bg-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 dark:bg-gray-600 transition-colors cursor-pointer"
                onClick={onCancel}
              >
                Відміна
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteConfirmModal;
