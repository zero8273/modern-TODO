import { useEffect, useRef, useState } from 'react';
import DeadlineBlock from './DeadlineBlock';
import MicrophoneIcon from '../assets/micro.png';

export function AddTodo({ onAdd }) {
  const [text, setText] = useState('');
  const [deadline, setDeadline] = useState('');
  const [showDeadlineInput, setShowDeadlineInput] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const finalTextRef = useRef('');

  const startListening = () => {
    if (recognition) {
      recognition.start();
      setIsListening(true);
    }
  };

  const stopListenin = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
      setText(finalTextRef.current);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListenin();
    } else {
      startListening();
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const speechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (speechRecognition) {
        // eslint-disable-next-line no-undef
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = true;
        recognitionInstance.lang = 'uk-UA';
        recognitionInstance.interimResults = true;
        recognitionInstance.onresult = (e) => {
          let finalTranscript = '';
          let intermScript = '';
          for (let i = e.resultIndex; i < e.results.length; i++) {
            const transcript = e.results[i][0].transcript;
            if (e.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              intermScript += transcript;
            }
            if (finalTranscript) {
              finalTextRef.current =
                finalTextRef.current + ' ' + finalTranscript;
              setText(finalTextRef.current);
            } else if (intermScript) {
              setText(finalTextRef.current + ' ' + intermScript);
            }
          }
        };

        recognitionInstance.onerror = (e) => {
          console.error('Помилка розпізнавання', e.error);
          stopListenin();
        };

        recognitionInstance.onend = () => {
          if (isListening) {
            recognitionInstance.start();
          }
        };

        setRecognition(recognitionInstance);
      }
    }
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [isListening]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text, deadline);
      setText('');
      setDeadline('');
      setShowDeadlineInput(false);
      finalTextRef.current = '';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex items-center bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 focus-within:ring-2 focus-within:ring-blue-500">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Добавить задачу..."
          className="flex-1 p-3 text-gray-700 dark:bg-page-dark dark:text-txt-dark outline-none placeholder-gray-400"
        />
        <button
          type="submit"
          className={`p-3  text-white  transition-colors duration-300  ${isListening ? 'bg-gray-300 cursor-not-allowed dark:bg-gray-600' : 'bg-btn-light hover:bg-btn-light-hv dark:bg-btn-dark hover:dark:bg-btn-dark-hv cursor-pointer'}`}
          disabled={isListening}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={toggleListening}
          className={`cursor-pointer p-3 ${isListening ? 'bg-red-500' : 'bg-gray-300'} flex items-center justify-center`}
          title={isListening ? 'Зупинити запис' : 'Почати запис'}
        >
          <img src={MicrophoneIcon} alt="microphone" className="w-6 h-6 " />
        </button>
      </div>
      <DeadlineBlock
        deadline={deadline}
        setDeadline={setDeadline}
        showDeadlineInput={showDeadlineInput}
        setShowDeadlineInput={setShowDeadlineInput}
      />
      {isListening && (
        <div className="mt-2 text-l flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse mr-2"></div>
          <span className="dark:text-gray-100">Йде запис...</span>
        </div>
      )}
    </form>
  );
}
