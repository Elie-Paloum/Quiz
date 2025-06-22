import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
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

interface Sequence {
  sequence: number[];
  correctAnswer: number;
  explanation: string;
}

export function LogicalSequencesQuiz() {
  const [gameState, setGameState] = useState<"setup" | "game" | "result">(
    "setup"
  );
  const [level, setLevel] = useState(1);
  const { numQuestions, NumQuestionsInput } = useNumQuestions();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [currentSequence, setCurrentSequence] = useState<Sequence | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [result, setResult] = useState("");
  const [showResult, setShowResult] = useState(false);

  const generateSequence = (): Sequence => {
    let seq: number[] = [];
    let correctAnswer = 0;
    let explanation = "";
    const n = 4;

    if (level === 1) {
      // Arithmetic sequence
      let a = Math.floor(Math.random() * 20);
      let d = Math.floor(Math.random() * 10 + 1);
      for (let i = 0; i < n; i++) seq.push(a + i * d);
      correctAnswer = a + n * d;
      explanation = `Arithmetic sequence: each term increases by ${d}.`;
    } else if (level === 2) {
      // Geometric sequence
      let a = Math.floor(Math.random() * 5 + 1);
      let r = Math.floor(Math.random() * 3 + 2);
      for (let i = 0; i < n; i++) seq.push(a * Math.pow(r, i));
      correctAnswer = a * Math.pow(r, n);
      explanation = `Geometric sequence: each term is multiplied by ${r}.`;
    } else if (level === 3) {
      // Alternating sequence
      let a = Math.floor(Math.random() * 20);
      let d = Math.floor(Math.random() * 5 + 1);
      for (let i = 0; i < n; i++) seq.push(a + (i % 2 === 0 ? d * i : -d * i));
      correctAnswer = a + (n % 2 === 0 ? d * n : -d * n);
      explanation = `Alternating sequence: add ${d}, then subtract ${d} alternately.`;
    } else if (level === 4) {
      // Complex sequences
      const types = ["square", "cube", "fibonacci"];
      const choice = types[Math.floor(Math.random() * types.length)];

      if (choice === "square") {
        for (let i = 1; i <= n; i++) seq.push(i * i);
        correctAnswer = (n + 1) * (n + 1);
        explanation = `Perfect squares: ${seq
          .map((v, i) => i + 1 + "²")
          .join(", ")}`;
      } else if (choice === "cube") {
        for (let i = 1; i <= n; i++) seq.push(i * i * i);
        correctAnswer = (n + 1) * (n + 1) * (n + 1);
        explanation = `Perfect cubes: ${seq
          .map((v, i) => i + 1 + "³")
          .join(", ")}`;
      } else {
        // Fibonacci
        seq = [1, 1];
        for (let i = 2; i < n; i++) seq.push(seq[i - 1] + seq[i - 2]);
        correctAnswer = seq[n - 1] + seq[n - 2];
        explanation = `Fibonacci sequence: each term is the sum of the two previous terms.`;
      }
    }

    return { sequence: seq, correctAnswer, explanation };
  };

  const startQuiz = () => {
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
    setUserAnswer("");
    const sequence = generateSequence();
    setCurrentSequence(sequence);
    setCurrentQuestion((prev) => prev + 1);
  };

  const submitAnswer = () => {
    const userAns = parseInt(userAnswer);
    if (isNaN(userAns)) {
      setResult("Please enter a valid number.");
      return;
    }

    if (currentSequence && userAns === currentSequence.correctAnswer) {
      setScore((prev) => prev + 1);
      setResult("✅ Correct answer!");
    } else if (currentSequence) {
      setResult(
        `❌ Wrong answer. The correct answer was ${currentSequence.correctAnswer}. ${currentSequence.explanation}`
      );
    }

    setShowResult(true);

    setTimeout(() => {
      setShowResult(false);
      nextQuestion();
    }, 3000);
  };

  const resetQuiz = () => {
    setGameState("setup");
    setCurrentQuestion(0);
    setScore(0);
    setResult("");
    setShowResult(false);
    setUserAnswer("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      submitAnswer();
    }
  };

  return (
    <Card className="bg-background/80 backdrop-blur-lg border border-white/20 dark:border-black/30 shadow-2xl w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl text-center text-black dark:text-white">
          🔢 Logical Sequences Quiz
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 items-center">
        {gameState === "setup" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4 w-full"
          >
            <div className="space-y-2">
              <div className="text-lg font-semibold text-black dark:text-white">
                Select level:
              </div>
              <Select
                value={level.toString()}
                onValueChange={(v) => setLevel(parseInt(v))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Level 1: Arithmetic</SelectItem>
                  <SelectItem value="2">Level 2: Geometric</SelectItem>
                  <SelectItem value="3">Level 3: Alternating</SelectItem>
                  <SelectItem value="4">Level 4: Complex</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {NumQuestionsInput}

            <Button
              onClick={startQuiz}
              className="w-full text-lg font-bold bg-cyan-500 hover:bg-cyan-600"
            >
              Start 🚀
            </Button>
          </motion.div>
        )}

        {gameState === "game" && currentSequence && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4 w-full"
          >
            <div className="text-xl font-semibold text-black dark:text-white text-center">
              Complete the sequence:
            </div>
            <div className="text-2xl font-mono text-center text-black dark:text-white bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
              {currentSequence.sequence.join(", ")}, ?
            </div>

            <div className="space-y-2">
              <Input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Your answer"
                className="text-center text-lg"
              />
              <Button
                onClick={submitAnswer}
                className="w-full text-lg font-bold bg-gray-100 hover:bg-blue-200 dark:bg-gray-800 dark:hover:bg-blue-700 text-black dark:text-white"
              >
                Submit
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
            onClick={resetQuiz}
            className="w-full text-lg font-bold bg-cyan-500 hover:bg-cyan-600"
          >
            New Game 🔄
          </Button>
        </div>
      )}
    </Card>
  );
}
