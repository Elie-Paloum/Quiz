import ProfileCard from "./ProfileCard";
import Elie from "./assets/Elie.jpeg";
import { motion } from "framer-motion";

export function About() {
  return (
    <motion.div
      className="flex flex-1"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex-1 flex flex-row flex-wrap justify-center align-center items-center gap-4">
        <ProfileCard
          image={Elie}
          name="Elie Bou Zeid"
          role="Front-End Dev"
        ></ProfileCard>
        <ProfileCard name="Paloum" role="Back-End Dev"></ProfileCard>
      </div>
    </motion.div>
  );
}
