"use client";

import axios from "axios";
import qs from "query-string";
import * as z from "zod";

import { Member, MemberRole, Profile } from "@prisma/client";
import { UserAvatar } from "../user-avatar";
import { ActionTooltip } from "../action-tooltip";
import {
  Edit2,
  FileIcon,
  ShieldAlert,
  ShieldCheck,
  Trash2,
} from "lucide-react";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { useModal } from "@/hooks/use-modal-store";

interface ChatItemProps {
  id: string;
  content: string;
  member: Member & {
    profile: Profile;
  };
  timestamp: string;
  fileUrl: string | null;
  deleted: boolean;
  currMember: Member;
  isUpdated: boolean;
  socketUrl: string;
  socketQuery: Record<string, string>;
}

const roleIconMapping = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="w-4 h-4 text-emerald-500" />,
  ADMIN: <ShieldAlert className="w-4 h-4 text-rose-500" />,
};

const formSchema = z.object({
  content: z.string().min(1),
});

export const ChatItem = ({
  id,
  content,
  member,
  timestamp,
  fileUrl,
  deleted,
  currMember,
  isUpdated,
  socketUrl,
  socketQuery,
}: ChatItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const params = useParams();
  const router = useRouter();
  const { onOpen } = useModal();
  const fileType = fileUrl?.split(".").pop();

  const onClickMember = () => {
    if (member.id === currMember.id) return;

    router.push(`/servers/${params?.serverId}/conversations/${member.id}`);
  };

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === "Escape" || event.keyCode === 27) {
        setIsEditing(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: content,
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQuery,
      });

      await axios.patch(url, values);

      form.reset();
      setIsEditing(false);
    } catch (err) {
      console.log("Message Error: ", err);
    }
  };

  useEffect(() => {
    form.reset({
      content: content,
    });
  }, [content]);

  const isAdmin = currMember.role === MemberRole.ADMIN;
  const isModerator = currMember.role === MemberRole.MODERATOR;
  const isOwner = currMember.id === member.id;
  const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
  const canEditMessage = !deleted && isOwner && !fileUrl;
  const isPDF = fileType === "pdf" && fileUrl;
  const isImage = !isPDF && fileUrl;

  return (
    <div className="relative group flex items-center hover:bg-black/10 transition w-full p-4">
      <div className="group flex gap-x-2 items-start w-full">
        <div
          onClick={onClickMember}
          className="hover:drop-shadow-md transition cursor-pointer"
        >
          <UserAvatar src={member.profile.imageUrl} />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p
                onClick={onClickMember}
                className="text-sm font-semibold hover:underline cursor-pointer"
              >
                {member.profile.name}
              </p>
              <ActionTooltip label={member.role}>
                {roleIconMapping[member.role]}
              </ActionTooltip>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {timestamp}
            </span>
          </div>
          {isImage && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square rounded-lg mt-2 border 
              flex items-center overflow-hidden bg-secondary h-48 w-48"
            >
              <Image
                src={fileUrl}
                alt={content}
                fill
                className="object-cover"
              />
            </a>
          )}
          {isPDF && (
            <div className="relative flex items-center p-2 mt-2 rounded-lg bg-background/10">
              <FileIcon className="w-10 h-10 fill-indigo-200 stroke-indigo-400" />
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm ml-2 text-indigo-500 dark:text-indigo-400 hover:underline"
              >
                PDF File
              </a>
            </div>
          )}
          {!fileUrl && !isEditing && (
            <p
              className={cn(
                "text-sm text-slate-600 dark:text-zinc-300",
                deleted &&
                  "italic text-xs text-slate-500 dark:text-slate-400 mt-1"
              )}
            >
              {content}
              {isUpdated && !deleted && (
                <span className=" text-[10px] mx-2 text-slate-500 dark:text-slate-400">
                  (edited)
                </span>
              )}
            </p>
          )}
          {!fileUrl && isEditing && (
            <Form {...form}>
              <form
                className="flex items-center gap-x-2 w-full pt-2"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="relative w-full">
                          <Input
                            disabled={isLoading}
                            className="bg-slate-200/90 dark:bg-slate-700/75 border-0 border-none
                                focus-visible:ring-0 focus-visible:ring-offset-0 p-2 
                                text-slate-600 dark:text-slate-200"
                            placeholder="Edited message"
                            {...field}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button disabled={isLoading} size="sm" variant="primary">
                  Save
                </Button>
              </form>
              <span className="mt-1 text-xs text-slate-400">
                Press esc to cancel, enter to save
              </span>
            </Form>
          )}
        </div>
      </div>
      {canDeleteMessage && (
        <div
          className="hidden group-hover:flex items-center gap-x-2 
        absolute p-1 -top-2 right-5 bg-white dark:bg-slate-800 border rounded-sm"
        >
          {canEditMessage && (
            <ActionTooltip label="Edit">
              <Edit2
                onClick={() => setIsEditing(true)}
                className="cursor-pointer ml-auto w-4 h-4 
              text-slate-500 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition"
              />
            </ActionTooltip>
          )}
          <ActionTooltip label="Delete">
            <Trash2
              onClick={() =>
                onOpen("DeleteMessage", {
                  apiUrl: `${socketUrl}/${id}`,
                  query: socketQuery,
                })
              }
              className="cursor-pointer ml-auto w-4 h-4 
              text-slate-500 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition"
            />
          </ActionTooltip>
        </div>
      )}
    </div>
  );
};
