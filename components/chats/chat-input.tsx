"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import axios from "axios";
import qs from "query-string";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Plus, SmileIcon } from "lucide-react";
import { Input } from "../ui/input";
import { useModal } from "@/hooks/use-modal-store";

interface ChatInputProps {
  apiUrl: string;
  query: Record<string, any>;
  name: string;
  type: "conversation" | "channel";
}

const formSchema = z.object({
  content: z.string().min(1),
});

export const ChatInput = ({ apiUrl, query, name, type }: ChatInputProps) => {
  const { onOpen } = useModal();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    // console.log(value);
    try {
      const url = qs.stringifyUrl({
        url: apiUrl,
        query,
      });

      await axios.post(url, value);
    } catch (err) {
      console.log("Message Error: ", err);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="p-4 pb-6 relative">
                  <button
                    type="button"
                    onClick={() => onOpen("FileMessage", { apiUrl, query })}
                    className="absolute top-7 left-8 h-6 w-6 
                  bg-slate-500 dark:bg-slate-400 hover:bg-slate-600 dark:hover:bg-slate-300 transition
                  p-1 rounded-full flex items-center justify-center"
                  >
                    <Plus className="text-white dark:text-slate-800" />
                  </button>
                  <Input
                    disabled={isLoading}
                    placeholder={`Message ${
                      type === "conversation" ? name : "#" + name
                    }`}
                    {...field}
                    className="px-14 py-6 bg-slate-200/90 dark:bg-slate-700/75 border-none border-0
                  focus-visible:ring-0 focus-visible:ring-offset-0 text-slate-600 dark:text-slate-200"
                  />

                  <div className="absolute top-7 right-8">
                    <SmileIcon />
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
