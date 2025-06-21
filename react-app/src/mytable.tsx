import { useEffect, useState } from "react";
import { columns, type User } from "./columns";
import { DataTable } from "./components/ui/data-table";

function MyTable() {
  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch(
        "http://localhost:8085/index.php/admin/users"
      );
      const data = await response.json();
      setUsers(data.users);
      console.log(data.users);
    };
    fetchUsers();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={users} />
    </div>
  );
}

export default MyTable;
