import type { Historian } from "../data/historians";
import { motion } from "framer-motion";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { Button } from "./ui/button";
import { X } from "lucide-react";

interface HistorianCardProps {
  historian: Historian;
  index: number;
}

export function HistorianCard({ historian, index }: HistorianCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      className="w-full max-w-sm mx-auto"
    >
      <Drawer>
        <DrawerTrigger asChild>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition-transform hover:scale-105">
            <div className="relative h-64">
              <img
                src={historian.image}
                alt={historian.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="text-xl font-bold">{historian.name}</h3>
                <p className="text-sm opacity-90">{historian.role}</p>
              </div>
            </div>
          </div>
        </DrawerTrigger>
        <DrawerContent className="h-screen bg-background">
          <div className="h-full container mx-auto px-4 py-6 max-w-4xl overflow-y-auto">
            <DrawerHeader className="flex justify-between items-center">
              <div>
                <DrawerTitle className="text-3xl font-bold">
                  {historian.name}
                </DrawerTitle>
                <p className="text-lg text-muted-foreground mt-2">
                  {historian.role}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {historian.birthDeath}
                </p>
              </div>
            </DrawerHeader>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative h-[400px] rounded-lg overflow-hidden">
                <img
                  src={historian.image}
                  alt={historian.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-xl font-semibold mb-2">Biography</h4>
                  <p className="text-muted-foreground">
                    {historian.description}
                  </p>
                </div>

                <div>
                  <h4 className="text-xl font-semibold mb-2">
                    Key Achievements
                  </h4>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    {historian.achievements.map((achievement, index) => (
                      <li key={index}>{achievement}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </motion.div>
  );
}
