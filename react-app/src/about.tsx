import { motion } from "framer-motion";

import { HistorianCard } from "./components/HistorianCard";
import { Input } from "./components/ui/input";
import { Search } from "lucide-react";
import { useState, useMemo, useCallback, useEffect } from "react";
import type { Historian } from "./data/historians";

const getApiBase = () => {
  if (import.meta.env.DEV) {
    const isMobile =
      window.location.hostname !== "localhost" &&
      window.location.hostname !== "127.0.0.1";
    return isMobile ? "http://172.20.10.3:8085" : "http://localhost:8085";
  }
  return "https://logicalquiz.free.nf";
};

export function About() {
  const [historians, setHistorians] = useState<Historian[]>([]);
  useEffect(() => {
    fetch(`${getApiBase()}/index.php/admin/authors`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch historians");
        return res.json();
      })
      .then((data: Historian[]) => {
        setHistorians(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const filteredHistorians = useMemo(() => {
    const searchLower = searchQuery.toLowerCase();

    return historians.filter(
      (historian) =>
        historian.name?.toLowerCase().includes(searchLower) ||
        historian.role?.toLowerCase().includes(searchLower) ||
        historian.description?.toLowerCase().includes(searchLower) ||
        historian.achievements?.some((achievement: any) =>
          achievement.toLowerCase().includes(searchLower)
        )
    );
  }, [searchQuery, historians]);

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
