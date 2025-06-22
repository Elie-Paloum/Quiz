import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { getApiBase } from "../utils/api";

interface Question {
  question: string;
  true: boolean;
}

export function TrueFalseQuiz() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const startGame = async () => {
    setCurrent(0);
    setScore(0);
    setFeedback("");
    setResult("");
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${getApiBase()}/index.php/admin/questions?nb_questions=10`
      );
      const data = await response.json();

      if (data.return !== 0) {
        setError("Error loading questions.");
        setLoading(false);
        return;
      }

      setQuestions(data.questions);
      setLoading(false);
    } catch (err) {
      setError(
        `Network error: ${err instanceof Error ? err.message : "Unknown error"}`
      );
      setLoading(false);
    }
  };

  const showQuestion = () => {
    if (current < questions.length) {
      setFeedback("");
    } else {
      showResult();
    }
  };

  const submitAnswer = (userAnswer: boolean) => {
    const correct = questions[current].true === userAnswer;

    if (correct) {
      setScore((prev) => prev + 1);
      setFeedback("✅ Correct answer!");
    } else {
      setFeedback("❌ Wrong answer.");
    }

    setCurrent((prev) => prev + 1);

    setTimeout(() => {
      showQuestion();
    }, 3000);
  };

  const showResult = () => {
    setResult(`Score: ${score} / ${questions.length}`);
  };

  useEffect(() => {
    startGame();
  }, []);

  useEffect(() => {
    if (questions.length > 0) {
      showQuestion();
    }
  }, [questions]);

  useEffect(() => {
    if (current >= questions.length && questions.length > 0) {
      showResult();
    }
  }, [current, questions.length]);

  if (loading) {
    return (
      <Card className="bg-background/80 backdrop-blur-lg border border-white/20 dark:border-black/30 shadow-2xl w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-black dark:text-white">
            True or False Quiz
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 items-center">
          <div className="text-lg text-black dark:text-white">
            Loading questions...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-background/80 backdrop-blur-lg border border-white/20 dark:border-black/30 shadow-2xl w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-black dark:text-white">
            True or False Quiz
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 items-center">
          <div className="text-lg text-red-600 dark:text-red-400 text-center">
            {error}
          </div>
          <Button
            onClick={startGame}
            className="w-full text-lg font-bold bg-cyan-500 hover:bg-cyan-600"
          >
            Try Again 🔄
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-background/80 backdrop-blur-lg border border-white/20 dark:border-black/30 shadow-2xl w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl text-center text-black dark:text-white">
          True or False Quiz
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 items-center">
        {current < questions.length ? (
          <>
            <div className="text-xl font-semibold mb-4 text-black dark:text-white text-center">
              Question {current + 1}: {questions[current].question}
            </div>
            <div className="flex gap-4 w-full">
              <Button
                onClick={() => submitAnswer(true)}
                className="flex-1 text-lg font-bold bg-green-600 hover:bg-green-700 text-white"
              >
                True
              </Button>
              <Button
                onClick={() => submitAnswer(false)}
                className="flex-1 text-lg font-bold bg-red-600 hover:bg-red-700 text-white"
              >
                False
              </Button>
            </div>
            {feedback && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <div
                  className={`text-lg font-semibold ${
                    feedback.includes("Correct")
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {feedback}
                </div>
              </motion.div>
            )}
            <div className="space-y-2">
              <div className="text-center space-y-1">
                <div className="text-base text-black dark:text-white">
                  Question {current + 1} / {questions.length}
                </div>
                <div className="text-base text-black dark:text-white">
                  Score: {score}
                </div>
              </div>
              <Progress
                value={Math.min((current / (questions.length - 1)) * 80, 80)}
                className="w-full"
              />
            </div>
          </>
        ) : (
          <div className="text-center space-y-4">
            <div className="text-2xl font-bold text-black dark:text-white">
              Quiz Completed!
            </div>
            <div className="text-lg text-black dark:text-white">{result}</div>
          </div>
        )}
      </CardContent>
      {current >= questions.length && (
        <div className="flex flex-col gap-2 items-center p-6 pt-0">
          <Button
            onClick={startGame}
            className="w-full text-lg font-bold bg-cyan-500 hover:bg-cyan-600"
          >
            New Game 🔄
          </Button>
        </div>
      )}
    </Card>
  );
}
