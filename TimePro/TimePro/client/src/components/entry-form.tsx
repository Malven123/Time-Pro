import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { insertTimeEntrySchema } from "@shared/schema";
import type { TimeEntry } from "@shared/schema";

interface EntryFormProps {
  onSubmit: (data: Partial<TimeEntry>) => void;
  defaultValues?: Partial<TimeEntry>;
}

export default function EntryForm({ onSubmit, defaultValues }: EntryFormProps) {
  const form = useForm({
    resolver: zodResolver(insertTimeEntrySchema),
    defaultValues: defaultValues || {},
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit">Save Entry</Button>
      </form>
    </Form>
  );
}
