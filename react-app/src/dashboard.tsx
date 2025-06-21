import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Button } from "./components/ui/button";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./components/ui/dialog";
import { toast } from "sonner";
import { CheckCircle, XCircle, Loader2, Shield, Check } from "lucide-react";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./auth-context";
import {
  Plus,
  Pencil,
  Trash2,
  User,
  Lock,
  History,
  AlertTriangle,
  Eye,
  EyeOff,
} from "lucide-react";
import { Navigate } from "react-router-dom";
import { Textarea } from "./components/ui/textarea";
import { motion } from "framer-motion";

const getApiBase = () => {
  if (import.meta.env.DEV) {
    // Check if we're accessing from a mobile device
    const isMobile =
      window.location.hostname !== "localhost" &&
      window.location.hostname !== "127.0.0.1";
    return isMobile ? "http://172.20.10.3:8085" : "http://localhost:8085";
  }
  // Use your InfinityFree backend URL in production
  return "https://logicalquiz.free.nf";
};

// Debounce hook
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function DashBoard() {
  const { isLoggedIn, logout } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/about" replace />;
  }

  const [activeTab, setActiveTab] = useState("security");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // Password change states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password verification states
  const [isVerifyingPassword, setIsVerifyingPassword] = useState(false);
  const [passwordVerification, setPasswordVerification] = useState<{
    isCorrect: boolean | null;
    message: string;
  }>({ isCorrect: null, message: "" });

  // Success states
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [passwordChangeDetails, setPasswordChangeDetails] = useState<{
    timestamp: string;
    success: boolean;
  } | null>(null);

  // Debounce the current password for verification
  const debouncedCurrentPassword = useDebounce(currentPassword, 500);

  // Verify password function
  const verifyPassword = useCallback(async (password: string) => {
    if (!password || password.length < 3) {
      setPasswordVerification({ isCorrect: null, message: "" });
      return;
    }

    setIsVerifyingPassword(true);
    try {
      const response = await fetch(
        `${getApiBase()}/index.php/verify-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ currentPassword: password }),
        }
      );

      const data = await response.json();

      if (data.return === 0) {
        setPasswordVerification({
          isCorrect: data.isCorrect,
          message: data.message,
        });
      } else {
        setPasswordVerification({
          isCorrect: false,
          message: data.message || "Verification failed",
        });
      }
    } catch (error) {
      setPasswordVerification({
        isCorrect: false,
        message: "Network error occurred",
      });
    } finally {
      setIsVerifyingPassword(false);
    }
  }, []);

  // Effect to verify password when debounced value changes
  useEffect(() => {
    verifyPassword(debouncedCurrentPassword);
  }, [debouncedCurrentPassword, verifyPassword]);

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    setDeleteError("");

    try {
      const response = await fetch(`${getApiBase()}/index.php/delete-account`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();

      if (data.return === 0) {
        // Account deleted successfully, logout the user
        logout();
      } else {
        setDeleteError(data.message || "Failed to delete account");
      }
    } catch (error) {
      setDeleteError("An error occurred while deleting your account");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleChangePassword = async () => {
    // Validate form
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All password fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }

    // Check if current password is correct
    if (passwordVerification.isCorrect !== true) {
      toast.error("Current password is incorrect");
      return;
    }

    setIsChangingPassword(true);

    try {
      const response = await fetch(
        `${getApiBase()}/index.php/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            currentPassword,
            newPassword,
            confirmPassword,
          }),
        }
      );

      const data = await response.json();

      if (data.return === 0) {
        // Show success toast
        toast.success("Password changed successfully!");

        // Store success details
        setPasswordChangeDetails({
          timestamp: new Date().toLocaleString(),
          success: true,
        });

        // Show success dialog
        setShowSuccessDialog(true);

        // Clear form
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setPasswordVerification({ isCorrect: null, message: "" });

        // Reset password visibility
        setShowCurrentPassword(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);
      } else {
        toast.error(data.message || "Failed to change password");
        setPasswordChangeDetails({
          timestamp: new Date().toLocaleString(),
          success: false,
        });
      }
    } catch (error) {
      toast.error("An error occurred while changing your password");
      setPasswordChangeDetails({
        timestamp: new Date().toLocaleString(),
        success: false,
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const clearForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordVerification({ isCorrect: null, message: "" });
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="container mx-auto py-8 px-4"
    >
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your account and content
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="historians" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Historians
            </TabsTrigger>
            <TabsTrigger value="danger" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Danger Zone
            </TabsTrigger>
          </TabsList>

          <TabsContent value="security" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your password and security preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="current-password"
                        type={showCurrentPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter your current password"
                        className={`pr-10 ${
                          passwordVerification.isCorrect === true
                            ? "border-green-500 focus:border-green-500"
                            : passwordVerification.isCorrect === false
                            ? "border-red-500 focus:border-red-500"
                            : ""
                        }`}
                      />
                      <div className="absolute inset-y-0 right-0 px-3 flex items-center gap-2">
                        {isVerifyingPassword ? (
                          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        ) : passwordVerification.isCorrect === true ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : passwordVerification.isCorrect === false ? (
                          <XCircle className="h-4 w-4 text-red-500" />
                        ) : null}
                        <button
                          type="button"
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                          className="text-muted-foreground"
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    {passwordVerification.message && (
                      <p
                        className={`text-sm ${
                          passwordVerification.isCorrect === true
                            ? "text-green-600"
                            : passwordVerification.isCorrect === false
                            ? "text-red-600"
                            : "text-muted-foreground"
                        }`}
                      >
                        {passwordVerification.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <div className="relative">
                      <Input
                        id="new-password"
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter your new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute inset-y-0 right-0 px-3 flex items-center text-muted-foreground"
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">
                      Confirm New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm your new password"
                        className={`${
                          newPassword &&
                          confirmPassword &&
                          newPassword !== confirmPassword
                            ? "border-red-500 focus:border-red-500"
                            : newPassword &&
                              confirmPassword &&
                              newPassword === confirmPassword
                            ? "border-green-500 focus:border-green-500"
                            : ""
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute inset-y-0 right-0 px-3 flex items-center text-muted-foreground"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {newPassword &&
                      confirmPassword &&
                      newPassword !== confirmPassword && (
                        <p className="text-sm text-red-600">
                          Passwords do not match
                        </p>
                      )}
                    {newPassword &&
                      confirmPassword &&
                      newPassword === confirmPassword && (
                        <p className="text-sm text-green-600">
                          Passwords match
                        </p>
                      )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleChangePassword}
                    disabled={
                      isChangingPassword ||
                      passwordVerification.isCorrect !== true
                    }
                    className="flex-1"
                  >
                    {isChangingPassword
                      ? "Changing Password..."
                      : "Update Password"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={clearForm}
                    disabled={isChangingPassword}
                  >
                    Clear Form
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="historians" className="mt-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Manage Historians</CardTitle>
                      <CardDescription>
                        Add, edit, or remove computer science historians
                      </CardDescription>
                    </div>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Historian
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Sample Historian Cards */}
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <img
                              src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Ada_Byron_daguerreotype_by_Antoine_Claudet_1843_or_1850.jpg"
                              alt="Ada Lovelace"
                              className="w-16 h-16 rounded-full object-cover"
                            />
                            <div>
                              <h3 className="font-medium">Ada Lovelace</h3>
                              <p className="text-sm text-muted-foreground">
                                First Computer Programmer
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="icon">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <img
                              src="https://upload.wikimedia.org/wikipedia/commons/a/a1/Alan_Turing_Aged_16.jpg"
                              alt="Alan Turing"
                              className="w-16 h-16 rounded-full object-cover"
                            />
                            <div>
                              <h3 className="font-medium">Alan Turing</h3>
                              <p className="text-sm text-muted-foreground">
                                Father of Computer Science
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="icon">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="danger" className="mt-6">
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Danger Zone
                </CardTitle>
                <CardDescription>
                  Irreversible and destructive actions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                    <h3 className="font-semibold text-destructive mb-2">
                      Delete Account
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Once you delete your account, there is no going back.
                      Please be certain.
                    </p>

                    {deleteError && (
                      <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded text-sm text-destructive">
                        {deleteError}
                      </div>
                    )}

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" disabled={isDeleting}>
                          {isDeleting ? "Deleting..." : "Delete Account"}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete your account and remove all your data from
                            our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDeleteAccount}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete Account
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Success Dialog */}
        <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-green-600">
                <Shield className="h-5 w-5" />
                Password Changed Successfully!
              </DialogTitle>
              <DialogDescription>
                Your password has been updated successfully. Here are the
                details:
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500" />
                <span>Password updated in the database</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500" />
                <span>Session remains active</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500" />
                <span>Form cleared for security</span>
              </div>
              <div className="text-xs text-muted-foreground">
                Changed at: {passwordChangeDetails?.timestamp}
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setShowSuccessDialog(false)}>
                Got it!
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </motion.div>
  );
}
