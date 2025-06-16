import ProfileCard from "./ProfileCard";
import Elie from "./assets/Elie.jpeg";
import { motion } from "framer-motion";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./components/ui/drawer";
import { Button } from "./components/ui/button";

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
        <div className="max-w-sm max-h-[380px] mx-auto bg-white shadow-lg rounded-lg overflow-hidden neon-hover">
          <Drawer>
            <DrawerTrigger>
              <ProfileCard
                image={Elie}
                name="Elie Bou Zeid"
                role="Front-End Dev"
              ></ProfileCard>
            </DrawerTrigger>
            <DrawerContent className="h-screen bg-background p-6 flex flex-col p-0 m-[0]">
              <DrawerHeader>
                <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                <DrawerDescription>
                  This action cannot be undone.
                </DrawerDescription>
              </DrawerHeader>
              <DrawerFooter>
                <Button>Submit</Button>
                <DrawerClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
        <ProfileCard name="Paloum" role="Back-End Dev"></ProfileCard>
      </div>
    </motion.div>
  );
}
