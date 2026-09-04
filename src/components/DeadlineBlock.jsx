const DeadlineBlock = ({
  showDeadlineInput,
  setShowDeadlineInput,
  deadline,
  setDeadline,
}) => {
  return (
    <>
      {showDeadlineInput && (
        <div className="flex items-center gap-2 mt-2">
          <input
            className="p-2 border rouded flex-1 border-blue-500"
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
          <button
            className="cursor-pointer p-2 text-gray-500 hover:text-gray-700"
            type="button"
            onClick={() => {
              setShowDeadlineInput(false);
              setDeadline('');
            }}
          >
            Відміна
          </button>
        </div>
      )}
      {!showDeadlineInput && (
        <button
          className="self-start text-blue-500 hover:text-blue-700"
          type="button"
          onClick={() => {
            setShowDeadlineInput(true);
          }}
        >
          додати дедлайн
        </button>
      )}
    </>
  );
};

export default DeadlineBlock;
