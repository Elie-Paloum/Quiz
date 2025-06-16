import { motion } from "framer-motion";
import { Button } from "./components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Input } from "./components/ui/input";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./components/ui/dialog";
import { useAuth } from "./auth-context";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
});

type LogInFormValues = z.infer<typeof formSchema>;

export function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LogInFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [loginSuccess, setLoginSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const { login } = useAuth();

  const onSubmit = async (values: LogInFormValues) => {
    const response = await fetch("http://localhost:8085/login.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(values),
    });
    console.log(values);

    const data = await response.json();

    if (data.return === -1) {
      setError(true);
    } else {
      setError(false);
      login();
    }

    setMessage(data.message);
    setLoginSuccess(true);
  };

  return (
    <motion.div
      className="flex-1 flex"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.4 }}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 max-w-md mx-auto"
        >
          <Card className="bg-accent  w-[400px] max-w-sm">
            <CardHeader className="">
              <CardTitle>Login</CardTitle>
              <CardDescription>
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <div className="grid gap-3">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="example@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            {...field}
                          />
                        </FormControl>
                        <button
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute inset-y-0 right-0 px-3 flex items-center text-muted-foreground"
                        >
                          {showPassword ? (
                            <EyeOffIcon size={18} />
                          ) : (
                            <EyeIcon size={18} />
                          )}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter>
              {
                <Dialog open={loginSuccess} onOpenChange={setLoginSuccess}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className={error ? "text-red-500" : ""}>
                        {message}
                      </DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. This will permanently
                        delete your account and remove your data from our
                        servers.
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              }
              <Button type="submit" className="w-full cursor-pointer">
                Login
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </motion.div>
  );
}
