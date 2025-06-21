import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

// Define the type for a math question
interface MathQuestion {
  expr: string;
  result: number;
}

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function MentalMathQuiz() {
  const [step, setStep] = useState<"setup" | "quiz" | "summary">("setup");
  const [nbQuestions, setNbQuestions] = useState<number>(5);
  const [level, setLevel] = useState<number>(1);
  const [questions, setQuestions] = useState<MathQuestion[]>([]);
  const [current, setCurrent] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [answer, setAnswer] = useState<string>("");
  const [countdown, setCountdown] = useState<number>(10);
  const [feedback, setFeedback] = useState<string>("");
  const timer = useRef<NodeJS.Timeout | null>(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertDescription, setAlertDescription] = useState("");

  useEffect(() => {
    if (step === "quiz" && countdown > 0) {
      timer.current = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => {
        if (timer.current) clearInterval(timer.current);
      };
    } else if (countdown <= 0 && step === "quiz") {
      handleAnswer(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countdown, step]);

  const rand = (min: number, max: number): number =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const createQuestion = (level: number): MathQuestion => {
    let expr = "";
    let result = 0;

    if (level === 1) {
      const a = rand(1, 20),
        b = rand(1, 20);
      const op = Math.random() > 0.5 ? "+" : "-";
      expr = `${a} ${op} ${b}`;
      result = eval(expr);
    } else if (level === 2) {
      const a = rand(1, 20),
        b = rand(1, 20),
        c = rand(1, 20);
      const ops = [
        Math.random() > 0.5 ? "+" : "-",
        Math.random() > 0.5 ? "+" : "-",
      ];
      expr = `${a} ${ops[0]} ${b} ${ops[1]} ${c}`;
      result = eval(expr);
    } else if (level === 3) {
      const a = rand(2, 12),
        b = rand(2, 12);
      const op = Math.random() > 0.5 ? "*" : "/";
      if (op === "*") {
        expr = `${a} * ${b}`;
        result = a * b;
      } else {
        expr = `${a * b} / ${b}`;
        result = a;
      }
    } else {
      const a = rand(1, 10),
        b = rand(1, 10),
        c = rand(1, 10);
      const ops = ["+", "-", "*", "/"];
      const op1 = ops[rand(0, 3)];
      const op2 = ops[rand(0, 3)];
      const expr1 = `${a} ${op1} ${b}`;
      let tempResult = eval(expr1);
      if (op2 === "/") {
        const safeC = c === 0 ? 1 : c;
        expr = `(${expr1}) ${op2} ${safeC}`;
        result = Math.floor(tempResult / safeC);
      } else {
        expr = `(${expr1}) ${op2} ${c}`;
        result = eval(expr);
      }
    }
    return { expr, result: Math.round(result) };
  };

  const generateQuestions = (total: number, level: number): MathQuestion[] => {
    return Array.from({ length: total }, () => createQuestion(level));
  };

  const startQuiz = () => {
    if (nbQuestions <= 0) {
      setAlertTitle("Invalid number");
      setAlertDescription("Please enter a valid number of questions.");
      setAlertOpen(true);
      return;
    }
    const q = generateQuestions(nbQuestions, level);
    setQuestions(q);
    setScore(0);
    setCurrent(0);
    setCountdown(10);
    setFeedback("");
    setStep("quiz");
  };

  const submitAnswer = () => {
    if (answer === "") {
      setAlertTitle("No answer");
      setAlertDescription("Please enter an answer before submitting.");
      setAlertOpen(true);
      return;
    }
    if (timer.current) clearInterval(timer.current);
    handleAnswer(parseInt(answer));
  };

  const handleAnswer = (userAns: number | null) => {
    const correct = userAns === questions[current].result;
    if (correct) {
      setScore((prev) => prev + 1);
      setFeedback("✅ Correct!");
    } else {
      setFeedback(
        `❌ Incorrect. The correct answer was: ${questions[current].result}`
      );
    }
    setTimeout(() => {
      if (current + 1 >= questions.length) {
        setStep("summary");
      } else {
        setCurrent((prev) => prev + 1);
        setCountdown(10);
        setAnswer("");
        setFeedback("");
      }
    }, 1500);
  };

  const resetGame = () => {
    setStep("setup");
    setNbQuestions(5);
    setLevel(1);
    setAnswer("");
  };

  return (
    <>
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{alertTitle}</AlertDialogTitle>
            <AlertDialogDescription>{alertDescription}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogAction onClick={() => setAlertOpen(false)} autoFocus>
            OK
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
      <AnimatePresence mode="wait">
        {step === "setup" && (
          <motion.div
            key="setup"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={sectionVariants}
            className="w-full"
          >
            <Card className="bg-background/80 backdrop-blur-lg border border-white/20 dark:border-black/30 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-2xl text-center text-black dark:text-white">
                  🧮 Mental Math Quiz
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div>
                  <Label className="mb-1 font-semibold text-gray-700 dark:text-gray-200">
                    Number of questions:
                  </Label>
                  <Input
                    type="number"
                    value={nbQuestions}
                    min={1}
                    max={50}
                    onChange={(e) => setNbQuestions(parseInt(e.target.value))}
                    className="bg-white/80 dark:bg-black/40 border border-gray-300 dark:border-gray-700 text-black dark:text-white"
                  />
                </div>
                <div>
                  <Label className="mb-1 font-semibold text-gray-700 dark:text-gray-200">
                    Level:
                  </Label>
                  <Select
                    value={level.toString()}
                    onValueChange={(v) => setLevel(Number(v))}
                  >
                    <SelectTrigger className="w-full p-2 rounded-md bg-white/80 dark:bg-black/40 border border-gray-300 dark:border-gray-700 text-black dark:text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">
                        Level 1 (add/subtract - 2 numbers)
                      </SelectItem>
                      <SelectItem value="2">
                        Level 2 (add/subtract - 3 numbers)
                      </SelectItem>
                      <SelectItem value="3">
                        Level 3 (multiply/divide - 2 numbers)
                      </SelectItem>
                      <SelectItem value="4">
                        Level 4 (all operations - 3 numbers)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2 items-center">
                <Button
                  onClick={startQuiz}
                  className="w-full text-lg font-bold"
                >
                  Start Quiz
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}

        {step === "quiz" && (
          <motion.div
            key="quiz"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={sectionVariants}
            className="w-full"
          >
            <Card className="bg-background/80 backdrop-blur-lg border border-white/20 dark:border-black/30 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-xl text-center text-black dark:text-white">
                  Question {current + 1} / {questions.length}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 items-center">
                <div className="text-2xl font-mono font-bold text-blue-700 dark:text-blue-300 mb-2">
                  {questions[current]?.expr}
                </div>
                <Input
                  type="number"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Your answer"
                  className="bg-white/80 dark:bg-black/40 border border-gray-300 dark:border-gray-700 text-black dark:text-white text-lg text-center"
                  autoFocus
                />
                <Button
                  onClick={submitAnswer}
                  className="w-full text-lg font-bold"
                >
                  Submit
                </Button>
                <div className="w-full flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Time left:
                  </span>
                  <span className="text-lg font-bold text-yellow-500">
                    {countdown}s
                  </span>
                </div>
                <div className="text-lg font-semibold text-yellow-400 min-h-[2rem]">
                  {feedback}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === "summary" && (
          <motion.div
            key="summary"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={sectionVariants}
            className="w-full"
          >
            <Card className="bg-background/80 backdrop-blur-lg border border-white/20 dark:border-black/30 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-2xl text-center text-black dark:text-white">
                  Result 🏆
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 items-center">
                <div className="mb-2 text-lg text-center">
                  You answered correctly <strong>{score}</strong> out of{" "}
                  <strong>{questions.length}</strong> questions.
                  <br />
                  Final score:{" "}
                  <strong>
                    {Math.round((score / questions.length) * 100)}%
                  </strong>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2 items-center">
                <Button
                  onClick={resetGame}
                  className="w-full text-lg font-bold bg-cyan-500 hover:bg-cyan-600"
                >
                  New Game 🔄
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
