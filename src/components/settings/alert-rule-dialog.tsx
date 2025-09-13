"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AlertRule } from "@/lib/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useEffect } from "react";

const formSchema = z.object({
  name: z.string().min(1, "Rule name is required"),
  threshold: z.coerce.number().min(1, "Threshold must be at least 1"),
  timeframe: z.coerce.number().min(1, "Timeframe must be at least 1 minute"),
});

interface AlertRuleDialogProps {
  rule: AlertRule | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (rule: AlertRule) => void;
}

export function AlertRuleDialog({ rule, isOpen, onClose, onSave }: AlertRuleDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      threshold: 10,
      timeframe: 5,
    },
  });

  useEffect(() => {
    if (rule) {
      form.reset({
        name: rule.name,
        threshold: rule.threshold,
        timeframe: rule.timeframe,
      });
    } else {
      form.reset({
        name: "",
        threshold: 10,
        timeframe: 5,
      });
    }
  }, [rule, isOpen, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onSave({
      ...values,
      id: rule?.id || "", 
      enabled: rule?.enabled || true,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{rule ? "Edit Alert Rule" : "Create New Alert Rule"}</DialogTitle>
          <DialogDescription>
            {rule
              ? "Update the details for this alert rule."
              : "Define the conditions for a new alert."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rule Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Critical CO Alert" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="threshold"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>CO Threshold (ppm)</FormLabel>
                    <FormControl>
                        <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="timeframe"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Timeframe (min)</FormLabel>
                    <FormControl>
                        <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit">Save Rule</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
