"use client";
import { DataTable } from "@/src/components/DataTable";
import { trpc } from "@/utils/trpc";
import { ColumnDef } from "@tanstack/react-table";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Name must be at least 3 characters.",
  }),
  email: z.string().email(),
});

export default function Home() {
  const { data, isLoading, error, refetch } = trpc.users.getUsers.useQuery();
  const createUser = trpc.users.createUser.useMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  if (isLoading) return <div>Loading...</div>;

  const renderError = (error: any) => {
    if (error.data?.zodError) {
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Validation Error</AlertTitle>
          <AlertDescription>
            {Object.entries(error.data.zodError.fieldErrors || {})
              .map(
                ([field, errors]) =>
                  `${field}: ${(errors as string[])?.join(", ")}`
              )
              .join("\n")}
          </AlertDescription>
        </Alert>
      );
    }

    if (error.data?.prismaError) {
      return (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Database Error</AlertTitle>
          <AlertDescription>{error.data.prismaError.message}</AlertDescription>
        </Alert>
      );
    }

    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  };

  if (error) return renderError(error);
  if (!data) return <div>No data</div>;

  const columns: ColumnDef<(typeof data)[number]>[] = [
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Email",
      accessorKey: "email",
    },
  ];

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await createUser.mutateAsync({
        email: values.email,
        name: values.name,
      });
      form.reset({});
      await refetch();
    } catch (error) {
      // The error will be handled by the form's error state
      console.error("Failed to create user:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <div className="mb-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            {createUser.error && renderError(createUser.error)}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
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
                    <Input placeholder="john@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={createUser.isPending}>
              {createUser.isPending ? "Creating..." : "Submit"}
            </Button>
          </form>
        </Form>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
