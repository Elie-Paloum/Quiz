import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";

export function NumberGuessingGame() {
  const [gameState, setGameState] = useState<"setup" | "game" | "result">(
    "setup"
  );
  const [minBound, setMinBound] = useState("");
  const [maxBound, setMaxBound] = useState("");
  const [secretNumber, setSecretNumber] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [message, setMessage] = useState("");
  const [userGuess, setUserGuess] = useState("");
  const [result, setResult] = useState("");

  const startGame = () => {
    const min = parseInt(minBound);
    const max = parseInt(maxBound);

    if (isNaN(min) || isNaN(max) || min >= max) {
      setMessage("Please enter valid bounds (min < max).");
      return;
    }

    const secret = Math.floor(Math.random() * (max - min + 1)) + min;
    setSecretNumber(secret);
    setAttempts(0);
    setStartTime(new Date());
    setEndTime(null);
    setMessage(`Guess a number between ${min} and ${max}`);
    setResult("");
    setUserGuess("");
    setGameState("game");
  };

  const checkGuess = () => {
    const guess = parseInt(userGuess);
    const min = parseInt(minBound);
    const max = parseInt(maxBound);

    if (isNaN(guess) || guess < min || guess > max) {
      setMessage(`Please enter a valid number between ${min} and ${max}.`);
      return;
    }

    setAttempts((prev) => prev + 1);

    if (guess === secretNumber) {
      const end = new Date();
      setEndTime(end);
      const timeTaken = Math.floor(
        (end.getTime() - (startTime?.getTime() || 0)) / 1000
      );
      setResult(`🎉 Congratulations! You found the number ${secretNumber}.`);
      setMessage(
        `Number of attempts: ${attempts + 1} | Time taken: ${timeTaken} seconds`
      );
      setGameState("result");
    } else if (guess > secretNumber) {
      setMessage("Too high! Guess lower 🔽");
    } else {
      setMessage("Too low! Guess higher 🔼");
    }

    setUserGuess("");
  };

  const resetGame = () => {
    setGameState("setup");
    setMinBound("");
    setMaxBound("");
    setSecretNumber(0);
    setAttempts(0);
    setStartTime(null);
    setEndTime(null);
    setMessage("");
    setUserGuess("");
    setResult("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (gameState === "setup") {
        startGame();
      } else if (gameState === "game") {
        checkGuess();
      }
    }
  };

  return (
    <Card className="bg-background/80 backdrop-blur-lg border border-white/20 dark:border-black/30 shadow-2xl w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl text-center text-black dark:text-white">
          🔢 Guess the Number!
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 items-center">
        {gameState === "setup" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4 w-full"
          >
            <div className="text-lg font-semibold text-black dark:text-white">
              Choose your bounds:
            </div>
            <div className="flex gap-2 justify-center">
              <Input
                type="number"
                value={minBound}
                onChange={(e) => setMinBound(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Min"
                className="w-24 text-center"
              />
              <Input
                type="number"
                value={maxBound}
                onChange={(e) => setMaxBound(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Max"
                className="w-24 text-center"
              />
            </div>
            {message && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 font-semibold"
              >
                {message}
              </motion.div>
            )}
            <Button
              onClick={startGame}
              className="w-full text-lg font-bold bg-cyan-500 hover:bg-cyan-600"
            >
              Start Game
            </Button>
          </motion.div>
        )}

        {gameState === "game" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4 w-full"
          >
            <div className="text-lg font-semibold text-black dark:text-white text-center">
              {message}
            </div>

            <div className="space-y-2">
              <Input
                type="number"
                value={userGuess}
                onChange={(e) => setUserGuess(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter a number"
                className="text-center text-lg"
              />
              <Button
                onClick={checkGuess}
                className="w-full text-lg font-bold bg-gray-100 hover:bg-blue-200 dark:bg-gray-800 dark:hover:bg-blue-700 text-black dark:text-white"
              >
                Check
              </Button>
            </div>

            <div className="text-center space-y-1">
              <div className="text-base text-black dark:text-white">
                Attempts: {attempts}
              </div>
              <Progress
                value={Math.min((attempts / 10) * 80, 80)}
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
              <div className="text-2xl font-bold mb-4 text-green-600 dark:text-green-400">
                {result}
              </div>
              <div className="mb-2 text-black dark:text-white">{message}</div>
            </div>
          </motion.div>
        )}
      </CardContent>
      {(gameState === "result" || gameState === "game") && (
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
