"use client";

import axios from "axios";
import qs from "query-string";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
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

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import { ChannelType } from "@prisma/client";

const formSchema = z.object({
  name: z
    .string()
    .min(5, {
      message: "Channel name is required !",
    })
    .refine((name) => name !== "general", {
      message: "Channel name cannot be 'general' !",
    }),
  type: z.nativeEnum(ChannelType),
});

export const CreateChannelModal = () => {
  const { isOpen, onClose, type } = useModal();
  const router = useRouter();
  const params = useParams();

  const isModalOpen = isOpen && type === "CreateChannel";

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: ChannelType.TEXT, //default type of channel is TEXT
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: "/api/channels",
        query: {
          serverId: params?.serverId,
        },
      });

      await axios.post(url, values);

      form.reset();
      router.refresh();
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <div className="bg-white">
      <Dialog open={isModalOpen} onOpenChange={handleClose}>
        <DialogContent className=" bg-slate-900 text-white p-0 overflow-hidden rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-white font-semibold px-8 py-4 text-center">
              Create Channel
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className=" space-y-8 px-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className="uppercase text-sm 
                        font-semibold text-slate-400 dark:text-slate-400/95"
                      >
                        Channel Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          className=" bg-slate-300/50 border-0 focus-visible:ring-0 text-black
                      focus-visible:ring-offset-0 placeholder:text-slate-700"
                          placeholder="Enter the channel name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Channel Type</FormLabel>
                      <Select
                        disabled={isLoading}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger
                            className="bg-slate-300/50 border-0 focus:ring-0 text-black
                          ring-offset-0 focus:ring-offset-0 capitalize outline-none"
                          >
                            <SelectValue placeholder="Select channel type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(ChannelType).map((type) => (
                            <SelectItem
                              key={type}
                              value={type}
                              className="capitalize"
                            >
                              {type.toLowerCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter className="block items-center justify-center px-8 py-4">
                <Button
                  variant="primary"
                  disabled={isLoading}
                  className="text-center items-center justify-center mb-2 w-full"
                >
                  Create
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
