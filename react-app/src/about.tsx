import { motion } from "framer-motion";
import { historians } from "./data/historians";
import { HistorianCard } from "./components/HistorianCard";
import { Input } from "./components/ui/input";
import { Search } from "lucide-react";
import { useState, useMemo, useCallback } from "react";

export function About() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const filteredHistorians = useMemo(() => {
    const searchLower = searchQuery.toLowerCase();
    return historians.filter(
      (historian) =>
        historian.name.toLowerCase().includes(searchLower) ||
        historian.role.toLowerCase().includes(searchLower) ||
        historian.description.toLowerCase().includes(searchLower) ||
        historian.achievements.some((achievement) =>
          achievement.toLowerCase().includes(searchLower)
        )
    );
  }, [searchQuery]);

  return (
    <motion.div
      className="flex-1"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.4 }}
    >
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          Pioneers of Computer Science
        </h1>

        <div className="max-w-2xl mx-auto mb-12 relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search historians by name, role, or achievements..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          {searchQuery && (
            <p className="text-sm text-muted-foreground mt-2 text-center">
              Found {filteredHistorians.length} historian
              {filteredHistorians.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredHistorians.map((historian, index) => (
            <HistorianCard
              key={historian.id}
              historian={historian}
              index={index}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
