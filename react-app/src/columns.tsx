import type { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./components/ui/alert-dialog";
import { Button } from "./components/ui/button";
import { ArrowUpDown, MoreHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { getApiBase } from "./utils/api";

// Extend TableMeta to include updateData
declare module "@tanstack/table-core" {
  interface TableMeta<TData> {
    updateData?: (newData: TData[]) => void;
  }
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  dob: string;
  gender: string;
  country: string;
  full_address: string;
  street_number: string;
  street_name: string;
  city: string;
  state: string;
  postal_code: string;
  role: string;
}

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown />
        </Button>
      );
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Role
          <ArrowUpDown />
        </Button>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const [open, setOpen] = useState(false);
      const [isDeleting, setIsDeleting] = useState(false);

      const handleDelete = async () => {
        setIsDeleting(true);
        try {
          const response = await fetch(
            `${getApiBase()}/index.php/admin/users/delete?id=${
              row.original.id
            }`,
            {
              method: "GET",
            }
          );
          const data = await response.json();

          if (data.return === 0) {
            // Remove the user from the table data without refreshing
            const currentData = table.options.data as User[];
            const updatedData = currentData.filter(
              (user) => user.id !== row.original.id
            );
            (table.options.meta as any)?.updateData?.(updatedData);
            toast.success("User deleted successfully");
          } else {
            toast.error(
              "Failed to delete user: " + (data.message || "Unknown error")
            );
          }
        } catch (error) {
          toast.error("Error deleting user: " + error);
        } finally {
          setIsDeleting(false);
        }
      };

      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setOpen(true)}>
                View user details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={async () => {
                  try {
                    const response = await fetch(
                      `${getApiBase()}/index.php/admin/users/toggle-role?id=${
                        row.original.id
                      }`,
                      {
                        method: "POST",
                      }
                    );
                    const data = await response.json();

                    if (data.return === 0) {
                      toast.success(data.message);
                      // Update the user's role in the table data without refreshing
                      const currentData = table.options.data as User[];
                      const updatedData = currentData.map((user) =>
                        user.id === row.original.id
                          ? { ...user, role: data.newRole }
                          : user
                      );
                      (table.options.meta as any)?.updateData?.(updatedData);
                    } else {
                      toast.error(
                        "Failed to update user role: " +
                          (data.message || "Unknown error")
                      );
                    }
                  } catch (error) {
                    toast.error("Error updating user role: " + error);
                  }
                }}
              >
                {row.original.role === "admin" ? "Make user" : "Make admin"}
              </DropdownMenuItem>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete user
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      the user "{row.original.first_name}{" "}
                      {row.original.last_name}" and remove their data from the
                      database.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>User Details</DialogTitle>
                <DialogDescription>
                  Complete information for {row.original.first_name}{" "}
                  {row.original.last_name}
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground">
                    Basic Information
                  </h4>
                  <div className="space-y-2 mt-2">
                    <div>
                      <span className="text-sm font-medium">ID:</span>
                      <span className="ml-2 text-sm">{row.original.id}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Email:</span>
                      <span className="ml-2 text-sm">{row.original.email}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium">First Name:</span>
                      <span className="ml-2 text-sm">
                        {row.original.first_name}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Last Name:</span>
                      <span className="ml-2 text-sm">
                        {row.original.last_name}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium">
                        Date of Birth:
                      </span>
                      <span className="ml-2 text-sm">{row.original.dob}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Gender:</span>
                      <span className="ml-2 text-sm">
                        {row.original.gender}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Role:</span>
                      <span className="ml-2 text-sm">{row.original.role}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground">
                    Address Information
                  </h4>
                  <div className="space-y-2 mt-2">
                    <div>
                      <span className="text-sm font-medium">Country:</span>
                      <span className="ml-2 text-sm">
                        {row.original.country}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Full Address:</span>
                      <span className="ml-2 text-sm">
                        {row.original.full_address}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium">
                        Street Number:
                      </span>
                      <span className="ml-2 text-sm">
                        {row.original.street_number}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Street Name:</span>
                      <span className="ml-2 text-sm">
                        {row.original.street_name}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium">City:</span>
                      <span className="ml-2 text-sm">{row.original.city}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium">State:</span>
                      <span className="ml-2 text-sm">{row.original.state}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Postal Code:</span>
                      <span className="ml-2 text-sm">
                        {row.original.postal_code}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      );
    },
  },
];
