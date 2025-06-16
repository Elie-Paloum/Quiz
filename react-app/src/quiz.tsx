import { useState } from "react";
import { motion } from "framer-motion";

type Question = {
  question: string;
  options: string[];
  answer: string;
};

const questions: Question[] = [
  {
    question: "What is the capital of France?",
    options: ["Madrid", "Berlin", "Paris", "Rome"],
    answer: "Paris",
  },
  {
    question: "Which language runs in a web browser?",
    options: ["Java", "C", "Python", "JavaScript"],
    answer: "JavaScript",
  },
  {
    question: "What does CSS stand for?",
    options: [
      "Central Style Sheets",
      "Cascading Style Sheets",
      "Computer Style Sheets",
      "Creative Style Sheets",
    ],
    answer: "Cascading Style Sheets",
  },
];

function Quiz() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showScore, setShowScore] = useState(false);

  const current = questions[currentIndex];

  const handleAnswer = (option: string) => {
    setSelected(option);
    if (option === current.answer) {
      setScore(score + 1);
    }

    // Wait then go to next
    setTimeout(() => {
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(currentIndex + 1);
        setSelected(null);
      } else {
        setShowScore(true);
      }
    }, 1000);
  };

  return (
    <motion.div
      className="flex-1"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.4 }}
    >
      <div className="max-w-lg mx-auto mt-10 p-6 bg-white dark:bg-gray-900 shadow-lg rounded-lg text-center">
        {showScore ? (
          <div>
            <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
            <p className="text-lg">
              Your score: {score} / {questions.length}
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4">{current.question}</h2>
            <div className="space-y-2">
              {current.options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  disabled={!!selected}
                  className={`w-full py-2 px-4 rounded border transition ${
                    selected
                      ? option === current.answer
                        ? "bg-green-500 text-white"
                        : option === selected
                        ? "bg-red-500 text-white"
                        : "bg-gray-200 dark:bg-gray-700"
                      : "bg-gray-100 hover:bg-blue-200 dark:bg-gray-800 dark:hover:bg-blue-700"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}

export default Quiz;
