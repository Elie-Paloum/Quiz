import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";

const variants = {
  bottom: {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
  },
  left: {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7 } },
  },
  right: {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7 } },
  },
};

export default function Home() {
  return (
    <div className="text-foreground w-full min-h-screen transition-colors duration-300 relative">
      {/* Hero Section (from bottom) */}
      <motion.section
        className="relative flex flex-col items-center justify-center min-h-[70vh] px-4 pt-16 pb-24 overflow-hidden z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.5 }}
        variants={variants.bottom}
      >
        <div className="relative z-10 flex flex-col items-center">
          <Brain className="w-16 h-16 text-blue-500 dark:text-blue-300 mb-6" />
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 text-center drop-shadow-lg text-black dark:text-white">
            Explore Logic Tests & Computer Science Historians
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-200 mb-8 text-center max-w-xl">
            Welcome! Our platform is dedicated to sharpening your logical
            thinking and celebrating the pioneers of computer science. Take
            challenging logic quizzes, discover the stories of legendary
            computer scientists, and track your learning journey.
          </p>
          <Button
            asChild
            variant="default"
            className="px-8 py-4 text-xl font-bold rounded-md dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            <Link to="/login+register">Get Started</Link>
          </Button>
        </div>
      </motion.section>

      {/* Logic Tests Section (from left) */}
      <motion.section
        className="w-full py-20 px-4 transition-colors duration-300 z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
        variants={variants.left}
      >
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-10 bg-white/20 dark:bg-black/20 rounded-2xl shadow-lg p-8 backdrop-blur-md border border-white/30 dark:border-black/30">
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-4 text-black dark:text-white">
              Sharpen Your Logic
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-200 mb-4">
              Dive into a variety of logic tests designed to challenge your
              reasoning and problem-solving skills. Our quizzes range from
              classic logic puzzles to modern brainteasers, suitable for all
              levels.
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-200 space-y-2">
              <li>Interactive, timed quizzes</li>
              <li>Immediate feedback and explanations</li>
              <li>Progressive difficulty</li>
            </ul>
          </div>
          <div className="flex-1 flex justify-center">
            <Button asChild variant="default">
              <Link to="/quiz">Take a Quiz</Link>
            </Button>
          </div>
        </div>
      </motion.section>

      {/* Historians Section (from right) */}
      <motion.section
        className="w-full py-20 px-4 transition-colors duration-300 z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
        variants={variants.right}
      >
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row-reverse items-center gap-10 bg-white/20 dark:bg-black/20 rounded-2xl shadow-lg p-8 backdrop-blur-md border border-white/30 dark:border-black/30">
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-4 text-black dark:text-white">
              Meet the Historians of Computer Science
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-200 mb-4">
              Discover the stories and achievements of the greatest minds in
              computer science. Learn about their groundbreaking work, their
              impact on technology, and how their ideas shape our world today.
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-200 space-y-2">
              <li>Biographies of key figures</li>
              <li>Milestones in computer science history</li>
              <li>Fun facts and trivia</li>
            </ul>
          </div>
          <div className="flex-1 flex justify-center">
            <Button asChild variant="default">
              <Link to="/quiz" className="text-white">
                Historians
              </Link>
            </Button>
          </div>
        </div>
      </motion.section>

      {/* Progress Tracking Section (from left) */}
      <motion.section
        className="w-full py-20 px-4 transition-colors duration-300 z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
        variants={variants.left}
      >
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-10 bg-white/20 dark:bg-black/20 rounded-2xl shadow-lg p-8 backdrop-blur-md border border-white/30 dark:border-black/30">
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-4 text-black dark:text-white">
              Track Your Progress (Coming Soon)
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-200 mb-4">
              Monitor your improvement over time. Our platform provides detailed
              stats, achievements, and personalized recommendations to help you
              grow.
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-200 space-y-2">
              <li>Score history and analytics</li>
              <li>Achievements and badges</li>
              <li>Personalized quiz suggestions</li>
            </ul>
          </div>
          <div className="flex-1 flex justify-center">
            <img
              src="https://img.icons8.com/color/144/combo-chart--v1.png"
              alt="Progress Tracking"
              className="rounded-xl shadow bg-white/30 dark:bg-black/30 p-4"
            />
          </div>
        </div>
      </motion.section>

      {/* Call to Action Section (from right) */}
      <motion.section
        className="w-full py-20 px-4 flex flex-col items-center bg-background z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
        variants={variants.right}
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-black dark:text-white">
          Ready to Start Your Journey?
        </h2>
        <p className="text-lg text-gray-700 dark:text-gray-200 mb-8 text-center max-w-2xl">
          Join our community of learners and thinkers. Whether you want to
          challenge your mind or explore the history of computing, there's
          something here for you.
        </p>
        <Button
          asChild
          variant="default"
          className="px-8 py-4 text-xl font-bold rounded-md dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          <Link to="/login+register">Get Started</Link>
        </Button>
      </motion.section>
    </div>
  );
}
