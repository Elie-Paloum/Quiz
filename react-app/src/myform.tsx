import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { PopoverTrigger } from "./components/ui/popover";
import { CalendarIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import { cn } from "./lib/utils";
import { Calendar } from "./components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "./components/ui/radio-group";
import { Checkbox } from "./components/ui/checkbox";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { useState } from "react";

const formSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "Username must be at least 2 characters." }),
  lastName: z
    .string()
    .min(2, { message: "Username must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
  dob: z.date({
    message: "A date of birth is required.",
  }),
  address: z.string().min(5, { message: "Please select a valid address." }),
  gender: z.enum(["Male", "Female", "Other"], {
    message: "A gender must be picked.",
  }),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions.",
  }),
});

type SignUpFormValues = z.infer<typeof formSchema>;

export function SignUpForm({ onSuccess }: { onSuccess: () => void }) {
  const [structuredAddress, setStructuredAddress] = useState({
    street_number: "",
    street_name: "",
    postal_code: "",
    city: "",
    state: "",
    country: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [message, setMessage] = useState("");

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      acceptTerms: false,
    },
  });

  const onSubmit = async (values: SignUpFormValues) => {
    try {
      const payLoad = {
        ...values,
        structuredAddress,
      };

      const response = await fetch("http://localhost:8085/modele.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payLoad),
      });
      const data = await response.json();
      console.log(data);
      if (data.return === -1) {
        setMessage(data.message);
        setSignupSuccess(true);
      } else {
        setMessage("Account created");
        setSignupSuccess(true);
        setTimeout(() => {
          onSuccess();
        }, 3000);
      }
    } catch (err) {
      // Handle fetch or other errors
      console.error("Error during form submission:", err);
    }
  };

  return (
    <motion.div
      className="flex-1 flex"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex-1 flex flex-row flex-wrap justify-center align-center items-center gap-4">
        <div className=" mx-auto bg-accent shadow-lg rounded-lg p-10 ">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 max-w-md mx-auto"
            >
              <div className="grid grid-cols-2 gap-10">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="john_doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="john_doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="john@example.com"
                          {...field}
                          onBlur={async () => {
                            const res = await fetch(
                              "http://localhost:8085/check-email.php",
                              {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ email: field.value }),
                              }
                            );
                            const data = await res.json();
                            if (data.exists) {
                              form.setError("email", {
                                type: "manual",
                                message: "This email is already in use.",
                              });
                            }
                          }}
                        />
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
                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date of birth</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full  pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            captionLayout="dropdown"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Your date of birth is used to calculate your age.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Pick a gender:</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col"
                        >
                          <FormItem className="flex items-center gap-3">
                            <FormControl>
                              <RadioGroupItem value="Male" />
                            </FormControl>
                            <FormLabel className="font-normal">Male</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center gap-3">
                            <FormControl>
                              <RadioGroupItem value="Female" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Female
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center gap-3">
                            <FormControl>
                              <RadioGroupItem value="Other" />
                            </FormControl>
                            <FormLabel className="font-normal">Other</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <GooglePlacesAutocomplete
                          apiKey="AIzaSyBbVD3ug_peZON5SWXKJ-oSqV8mOZyEX-g"
                          selectProps={{
                            value: field.value
                              ? { label: field.value, value: field.value }
                              : null,
                            onChange: async (val) => {
                              field.onChange(val?.label || "");

                              if (!val?.value?.place_id) return;

                              const service =
                                new window.google.maps.places.PlacesService(
                                  document.createElement("div")
                                );

                              service.getDetails(
                                { placeId: val.value.place_id },
                                (place, status) => {
                                  if (status !== "OK" || !place) return;

                                  const getComponent = (type: any) =>
                                    place.address_components?.find((c) =>
                                      c.types.includes(type)
                                    )?.long_name || "";

                                  const structured = {
                                    street_number:
                                      getComponent("street_number"),
                                    street_name: getComponent("route"),
                                    postal_code: getComponent("postal_code"),
                                    city:
                                      getComponent("locality") ||
                                      getComponent("postal_town"),
                                    state: getComponent(
                                      "administrative_area_level_1"
                                    ),
                                    country: getComponent("country"),
                                  };

                                  console.log(
                                    "Structured Address:",
                                    structured
                                  );

                                  setStructuredAddress(structured);
                                }
                              );
                            },
                            placeholder: "Enter your address...",

                            styles: {
                              control: (base) => ({
                                ...base,
                                borderColor: "hsl(var(--input))",
                                backgroundColor: "hsl(var(--background))",
                                padding: "2px",
                                color: "white",
                                overflow: "hidden",
                                maxWidth: "445px",
                              }),
                              input: (base) => ({
                                ...base,
                                color: "white",
                                overflow: "hidden",
                              }),
                              singleValue: (base) => ({
                                ...base,
                                color: "white",
                                overflow: "hidden",
                              }),
                              menuPortal: (base) => ({ ...base, zIndex: 9999 }), // ensures it's on top
                              menu: (base) => ({
                                ...base,
                                backgroundColor: "#1f1f1f",
                                color: "white",

                                overflowY: "auto",
                              }),
                              option: (base, state) => ({
                                ...base,
                                backgroundColor: state.isFocused
                                  ? "#3b82f6"
                                  : "#1f1f1f",
                                color: state.isFocused ? "white" : "#e5e5e5",
                                cursor: "pointer",
                                overflow: "hidden",
                              }),
                            },
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="acceptTerms"
                  render={({ field }) => (
                    <div className="flex flex-col items-center gap-1 flex-nowrap">
                      <FormItem>
                        <div className="flex flex-row items-center gap-1 flex-nowrap">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={(checked) => {
                                field.onChange(checked);
                              }}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal flex-wrap">
                            <Dialog>
                              <DialogTrigger asChild>
                                <span className=" underline cursor-pointer text-primary">
                                  Accept terms & conditions.
                                </span>
                              </DialogTrigger>

                              <DialogContent
                                aria-describedby="privacy-description"
                                className="max-h-[80vh] overflow-y-auto"
                              >
                                <DialogHeader>
                                  <DialogTitle>Privacy Policy</DialogTitle>
                                </DialogHeader>

                                <div
                                  id="privacy-description"
                                  className="space-y-4 text-sm text-left text-muted-foreground"
                                >
                                  <div>
                                    <strong>Last updated:</strong> June 14, 2025
                                  </div>

                                  <p>
                                    We value your privacy and are committed to
                                    protecting your personal data. This policy
                                    explains what data we collect, why, and how
                                    we use it.
                                  </p>

                                  <h4 className="font-semibold">
                                    1. What Data Do We Collect?
                                  </h4>
                                  <ul className="list-disc pl-5 space-y-1">
                                    <li>First name and last name</li>
                                    <li>Email address</li>
                                    <li>Password (stored securely)</li>
                                    <li>Date of birth</li>
                                    <li>Gender</li>
                                    <li>Address</li>
                                    <li>Consent to terms</li>
                                  </ul>

                                  <h4 className="font-semibold">
                                    2. Why Do We Collect This Data?
                                  </h4>
                                  <ul className="list-disc pl-5 space-y-1">
                                    <li>To create and manage your account</li>
                                    <li>To comply with legal obligations</li>
                                    <li>To communicate with you if needed</li>
                                    <li>To improve service quality</li>
                                  </ul>

                                  <h4 className="font-semibold">
                                    3. Legal Basis
                                  </h4>
                                  <p>
                                    We process your data based on your explicit
                                    consent and as needed to fulfill our
                                    contract with you.
                                  </p>

                                  <h4 className="font-semibold">
                                    4. Retention Period
                                  </h4>
                                  <p>
                                    Your data is stored for the duration of your
                                    account and up to 2 years after your last
                                    activity unless deletion is requested
                                    earlier.
                                  </p>

                                  <h4 className="font-semibold">
                                    5. Who Can Access It?
                                  </h4>
                                  <p>
                                    Only authorized personnel and our secure
                                    hosting provider have access. We do not sell
                                    or share your data with advertisers.
                                  </p>

                                  <h4 className="font-semibold">
                                    6. Data Protection
                                  </h4>
                                  <p>
                                    We hash passwords, store data securely, and
                                    limit access to authorized users only.
                                  </p>

                                  <h4 className="font-semibold">
                                    7. Your Rights
                                  </h4>
                                  <ul className="list-disc pl-5 space-y-1">
                                    <li>Access your personal data</li>
                                    <li>Request corrections</li>
                                    <li>Request deletion</li>
                                    <li>Withdraw consent</li>
                                  </ul>

                                  <h4 className="font-semibold">8. Cookies</h4>
                                  <p>
                                    We do not use tracking cookies. You will be
                                    informed if this changes.
                                  </p>

                                  <p>
                                    Contact us at:{" "}
                                    <strong>privacy@example.com</strong>
                                  </p>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </FormLabel>
                        </div>
                        <FormMessage />
                      </FormItem>
                    </div>
                  )}
                />

                {
                  <Dialog open={signupSuccess} onOpenChange={setSignupSuccess}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{message}</DialogTitle>
                        <DialogDescription>
                          This action cannot be undone. This will permanently
                          delete your account and remove your data from our
                          servers.
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                }
              </div>
              <Button
                type="submit"
                className="w-full cursor-pointer active:bg-blue-700"
              >
                Sign Up
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </motion.div>
  );
}
