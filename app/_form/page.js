"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

const formSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .refine((value) => isNaN(Number(value)), {
      message: "Username must not be a number.",
    }),
  codinglanguage: z.string().nonempty({
    message: "Please select a coding language.",
  }),
  stdcin: z.any().optional(),
  code: z.string().nonempty({
    message: "Please enter your source code. Include header files if neccesary",
  }),
});

export function ProfileForm() {
  // ...
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      codinglanguage: "",
      stdcin: "",
      code: "",
    },
  });
  const onSubmit = async (data) => {
    const res = await fetch(`https://backend-9how.onrender.com/insert`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      window.location.href = "/results";
      toast.success("Submission successful.");
    } else {
      toast.error("Failed to submit");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="enter your username" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="codinglanguage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred Coding Language</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Supported languages" {...field} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="c++">C++</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="java">Java</SelectItem>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="stdcin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>StdIn</FormLabel>
              <FormControl>
                <Textarea placeholder="stdin" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Code</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="copy and paste you code here"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
