import { useState, useCallback, useMemo } from "react";
import { Input } from "@/components/ui/input";

interface UseNumQuestionsOptions {
  initialValue?: number;
  min?: number;
  max?: number;
}

export function useNumQuestions({
  initialValue = 5,
  min = 1,
  max = 20,
}: UseNumQuestionsOptions = {}) {
  const [numQuestions, setNumQuestions] = useState<number | string>(
    initialValue
  );

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setNumQuestions(e.target.value);
  }, []);

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value);
      if (isNaN(value) || value < min) {
        setNumQuestions(min);
      } else if (value > max) {
        setNumQuestions(max);
      } else {
        setNumQuestions(value);
      }
    },
    [min, max]
  );

  const NumQuestionsInput = useMemo(
    () => (
      <div className="space-y-2">
        <div className="text-lg font-semibold text-black dark:text-white">
          Number of questions:
        </div>
        <Input
          type="number"
          min={min}
          max={max}
          value={numQuestions}
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-32 mx-auto text-center text-lg"
        />
      </div>
    ),
    [numQuestions, handleChange, handleBlur, min, max]
  );

  return {
    numQuestions:
      typeof numQuestions === "number" ? numQuestions : initialValue,
    NumQuestionsInput,
  };
}
