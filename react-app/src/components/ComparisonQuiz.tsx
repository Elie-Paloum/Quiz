import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useNumQuestions } from "../hooks/useNumQuestions";

interface Expression {
  expr: string;
  value: number;
}

export function ComparisonQuiz() {
  const [gameState, setGameState] = useState<"setup" | "game" | "result">(
    "setup"
  );
  const { numQuestions, NumQuestionsInput } = useNumQuestions();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [leftValue, setLeftValue] = useState(0);
  const [rightValue, setRightValue] = useState(0);
  const [leftExpr, setLeftExpr] = useState("");
  const [rightExpr, setRightExpr] = useState("");
  const [result, setResult] = useState("");
  const [showResult, setShowResult] = useState(false);

  const randomOperator = () => {
    const operators = ["+", "-", "*", "/"];
    return operators[Math.floor(Math.random() * operators.length)];
  };

  const generateExpression = (): Expression => {
    let num1 = Math.floor(Math.random() * 50) + 1;
    let num2 = Math.floor(Math.random() * 50) + 1;
    let op = randomOperator();

    // avoid division by zero
    if (op === "/" && num2 === 0) num2 = 1;

    let expression = `${num1} ${op} ${num2}`;
    let result;

    // Safe calculation
    switch (op) {
      case "+":
        result = num1 + num2;
        break;
      case "-":
        result = num1 - num2;
        break;
      case "*":
        result = num1 * num2;
        break;
      case "/":
        result = Math.floor(num1 / num2);
        break;
      default:
        result = 0;
    }

    return { expr: expression, value: result };
  };

  const startGame = () => {
    setGameState("game");
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    nextQuestion();
  };

  const nextQuestion = () => {
    if (currentQuestion >= numQuestions) {
      setGameState("result");
      return;
    }

    setResult("");
    const left = generateExpression();
    const right = generateExpression();

    setLeftValue(left.value);
    setRightValue(right.value);
    setLeftExpr(left.expr);
    setRightExpr(right.expr);
    setCurrentQuestion((prev) => prev + 1);
  };

  const submitAnswer = (choice: ">" | "<") => {
    const correct =
      (leftValue > rightValue && choice === ">") ||
      (leftValue < rightValue && choice === "<");

    if (correct) {
      setScore((prev) => prev + 1);
      setResult("Correct!");
    } else {
      setResult(`Incorrect. ${leftValue} vs ${rightValue}`);
    }

    setShowResult(true);

    setTimeout(() => {
      setShowResult(false);
      nextQuestion();
    }, 3000);
  };

  const resetGame = () => {
    setGameState("setup");
    setCurrentQuestion(0);
    setScore(0);
    setResult("");
    setShowResult(false);
  };

  return (
    <Card className="bg-background/80 backdrop-blur-lg border border-white/20 dark:border-black/30 shadow-2xl w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl text-center text-black dark:text-white">
          🔢 Comparison Quiz
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 items-center">
        {gameState === "setup" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4 w-full"
          >
            {NumQuestionsInput}
            <Button
              onClick={startGame}
              className="w-full text-lg font-bold bg-cyan-500 hover:bg-cyan-600"
            >
              Start 🚀
            </Button>
          </motion.div>
        )}

        {gameState === "game" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4 w-full"
          >
            <div className="flex justify-around items-center space-x-2">
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg min-w-[120px] text-center border">
                <span className="text-xl font-mono text-black dark:text-white">
                  {leftExpr}
                </span>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg min-w-[120px] text-center border">
                <span className="text-xl font-mono text-black dark:text-white">
                  {rightExpr}
                </span>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <Button
                onClick={() => submitAnswer(">")}
                className="text-lg font-bold bg-gray-100 hover:bg-blue-200 dark:bg-gray-800 dark:hover:bg-blue-700 text-black dark:text-white px-8 py-3"
              >
                &gt;
              </Button>
              <Button
                onClick={() => submitAnswer("<")}
                className="text-lg font-bold bg-gray-100 hover:bg-blue-200 dark:bg-gray-800 dark:hover:bg-blue-700 text-black dark:text-white px-8 py-3"
              >
                &lt;
              </Button>
            </div>

            {showResult && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <div
                  className={`text-lg font-semibold ${
                    result.includes("Correct")
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {result.includes("Correct") ? "✔ " : "❌ "}
                  {result}
                </div>
              </motion.div>
            )}

            <div className="space-y-2">
              <div className="text-center space-y-1">
                <div className="text-base text-black dark:text-white">
                  Question {currentQuestion} / {numQuestions}
                </div>
                <div className="text-base text-black dark:text-white">
                  Score: {score}
                </div>
              </div>
              <Progress
                value={Math.min(
                  ((currentQuestion - 1) / (numQuestions - 1)) * 80,
                  80
                )}
                className="w-full"
              />
            </div>
          </motion.div>
        )}

        {gameState === "result" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4 w-full"
          >
            <div className="mb-2 text-lg text-center">
              <div className="text-2xl font-bold mb-4 text-black dark:text-white">
                ✅ Quiz Completed!
              </div>
              <div className="mb-2 text-black dark:text-white">
                Your score: <strong>{score}</strong> /{" "}
                <strong>{numQuestions}</strong> (
                {Math.round((score / numQuestions) * 100)}%)
              </div>
            </div>
          </motion.div>
        )}
      </CardContent>
      {gameState === "result" && (
        <div className="flex flex-col gap-2 items-center p-6 pt-0">
          <Button
            onClick={resetGame}
            className="w-full text-lg font-bold bg-cyan-500 hover:bg-cyan-600"
          >
            New Game 🔄
          </Button>
        </div>
      )}
    </Card>
  );
}
