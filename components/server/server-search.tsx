"use client";

import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { set } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";

interface ServerSidebarProps {
  data: {
    label: string;
    type: "channel" | "member";
    data:
      | {
          icon: React.ReactNode;
          name: string;
          id: string;
        }[]
      | undefined;
  }[];
}

export const ServerSearch = ({ data }: ServerSidebarProps) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleClick = ({
    id,
    type,
  }: {
    id: string;
    type: "channel" | "member";
  }) => {
    setOpen(false);

    if (type === "channel")
      router.push(`/servers/${params?.serverId}/channels/${id}`);

    if (type === "member")
      router.push(`/servers/${params?.serverId}/conversations/${id}`);
  };

  return (
    <>
      <button
        className="group p-2 rounded-lg flex items-center 
        gap-x-2 w-full hover:bg-slate-700/10
      dark:hover:bg-slate-700/50 transition"
        onClick={() => setOpen(true)}
      >
        <Search className="w-4 h-4 mr-2 text-slate-500 dark:text-slate-400" />
        <p
          className="text-sm font-semibold text-slate-500 dark:text-slate-400 
        group-hover:text-slate-600 
        dark:group-hover:text-slate-300 transition"
        >
          Search
        </p>
        <kbd
          className="pointer-events-none inline-flex
        h-5 select-none items-center gap-1 rounded-border 
        bg-muted px-2 font-mono text-xs font-medium text-muted-foreground ml-auto"
        >
          <span className="text-xs">CTRL</span>K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search channels and members" />
        <CommandList>
          <CommandEmpty>No Results Found !</CommandEmpty>
          {data.map(({ label, type, data }) => {
            if (!data?.length) return null;

            return (
              <CommandGroup key={label} heading={label}>
                {data?.map(({ id, icon, name }) => {
                  return (
                    <CommandItem
                      key={id}
                      onSelect={() => handleClick({ id, type })}
                    >
                      {icon}
                      <span>{name}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            );
          })}
        </CommandList>
      </CommandDialog>
    </>
  );
};
