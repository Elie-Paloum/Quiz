import { useEffect, useState } from "react";
import { columns, type User } from "./columns";
import { DataTable } from "./components/ui/data-table";
import { getApiBase } from "./utils/api";
import { useAuth } from "./auth-context";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";

function MyTable() {
  const [users, setUsers] = useState<User[]>([]);

  const { isLoggedIn, user } = useAuth();

  if (!isLoggedIn || user?.role !== "admin") {
    return <Navigate to="/about" replace />;
  }

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch(`${getApiBase()}/index.php/admin/users`);
      const data = await response.json();
      setUsers(data.users);
      console.log(data.users);
    };
    fetchUsers();
  }, []);

  const handleDataUpdate = (newData: User[]) => {
    setUsers(newData);
  };

  return (
    <motion.div
      className="container mx-auto py-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
      >
        <DataTable
          columns={columns}
          data={users}
          onDataUpdate={handleDataUpdate}
        />
      </motion.div>
    </motion.div>
  );
}

export default MyTable;
