import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MentalMathQuiz from "./components/MentalMathQuiz";
import { ComparisonQuiz } from "./components/ComparisonQuiz";
import { TrueFalseQuiz } from "./components/TrueFalseQuiz";
import { LogicalSequencesQuiz } from "./components/LogicalSequencesQuiz";
import { NumberGuessingGame } from "./components/NumberGuessingGame";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

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
  const [mode, setMode] = useState<
    "classic" | "mental" | "comparison" | "truefalse" | "sequences" | "guessing"
  >("classic");

  const current = questions[currentIndex];

  const handleAnswer = (option: string) => {
    setSelected(option);
    if (option === current.answer) {
      setScore(score + 1);
    }
    setTimeout(() => {
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(currentIndex + 1);
        setSelected(null);
      } else {
        setShowScore(true);
      }
    }, 3000);
  };

  const modeDropdown = (
    <div className="mb-6 flex flex-col gap-2 items-center">
      <Select
        value={mode}
        onValueChange={(v) =>
          setMode(
            v as
              | "classic"
              | "mental"
              | "comparison"
              | "truefalse"
              | "sequences"
              | "guessing"
          )
        }
      >
        <SelectTrigger className="w-56">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="classic">Classic Quiz</SelectItem>
          <SelectItem value="mental">Mental Math</SelectItem>
          <SelectItem value="comparison">Comparison Quiz</SelectItem>
          <SelectItem value="truefalse">True or False Quiz</SelectItem>
          <SelectItem value="sequences">Logical Sequences Quiz</SelectItem>
          <SelectItem value="guessing">Number Guessing Game</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <div className="flex justify-center items-center min-h-[70vh] w-full px-2 py-8">
      <div className="w-full max-w-md flex flex-col items-center">
        {modeDropdown}
        <AnimatePresence mode="wait">
          {mode === "mental" ? (
            <motion.div
              key="mental"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={sectionVariants}
              className="w-full"
            >
              <MentalMathQuiz />
            </motion.div>
          ) : mode === "comparison" ? (
            <motion.div
              key="comparison"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={sectionVariants}
              className="w-full"
            >
              <ComparisonQuiz />
            </motion.div>
          ) : mode === "truefalse" ? (
            <motion.div
              key="truefalse"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={sectionVariants}
              className="w-full"
            >
              <TrueFalseQuiz />
            </motion.div>
          ) : mode === "sequences" ? (
            <motion.div
              key="sequences"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={sectionVariants}
              className="w-full"
            >
              <LogicalSequencesQuiz />
            </motion.div>
          ) : mode === "guessing" ? (
            <motion.div
              key="guessing"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={sectionVariants}
              className="w-full"
            >
              <NumberGuessingGame />
            </motion.div>
          ) : (
            <motion.div
              key="classic"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={sectionVariants}
              className="w-full"
            >
              <Card className="bg-background/80 backdrop-blur-lg border border-white/20 dark:border-black/30 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-2xl text-center text-black dark:text-white">
                    Classic Quiz
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4 items-center">
                  {showScore ? (
                    <div className="mb-2 text-lg text-center">
                      <div className="text-2xl font-bold mb-4">
                        Quiz Completed!
                      </div>
                      <div className="mb-2">
                        Your score: <strong>{score}</strong> /{" "}
                        <strong>{questions.length}</strong>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="text-xl font-semibold mb-4 text-black dark:text-white">
                        {current.question}
                      </div>
                      <div className="flex flex-col gap-2 w-full">
                        {current.options.map((option) => {
                          let btnClass =
                            "w-full text-base font-semibold transition-all ";
                          if (selected) {
                            if (option === current.answer) {
                              btnClass +=
                                "!bg-green-500 !text-white !border-green-600 dark:!bg-green-600 dark:!border-green-400";
                            } else if (option === selected) {
                              btnClass +=
                                "!bg-red-500 !text-white !border-red-600 dark:!bg-red-600 dark:!border-red-400";
                            } else {
                              btnClass +=
                                "bg-gray-200 dark:bg-gray-700 text-black dark:text-white";
                            }
                          } else {
                            btnClass +=
                              "bg-gray-100 hover:bg-blue-200 dark:bg-gray-800 dark:hover:bg-blue-700 text-black dark:text-white";
                          }
                          return (
                            <Button
                              key={option}
                              onClick={() => handleAnswer(option)}
                              disabled={!!selected}
                              className={btnClass}
                              variant="default"
                            >
                              {option}
                            </Button>
                          );
                        })}
                      </div>
                      <div className="space-y-2 w-full">
                        <div className="text-center space-y-1">
                          <div className="text-base text-black dark:text-white">
                            Question {currentIndex + 1} / {questions.length}
                          </div>
                          <div className="text-base text-black dark:text-white">
                            Score: {score}
                          </div>
                        </div>
                        <Progress
                          value={Math.min(
                            (currentIndex / (questions.length - 1)) * 80,
                            80
                          )}
                          className="w-full"
                        />
                      </div>
                    </>
                  )}
                </CardContent>
                <CardFooter className="flex flex-col gap-2 items-center">
                  {showScore && (
                    <Button
                      onClick={() => {
                        setShowScore(false);
                        setCurrentIndex(0);
                        setScore(0);
                        setSelected(null);
                      }}
                      className="w-full text-lg font-bold bg-cyan-500 hover:bg-cyan-600"
                    >
                      New Game 🔄
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Quiz;
