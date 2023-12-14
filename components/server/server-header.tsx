"use client";

import { ServerWithMembersWithProfiles } from "@/types";
import { MemberRole } from "@prisma/client";
import {
  ChevronDown,
  UserPlus,
  Settings,
  Users,
  PlusCircle,
  Trash,
  LogOut,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useModal } from "@/hooks/use-modal-store";

interface ServerHeaderProps {
  server: ServerWithMembersWithProfiles;
  role?: MemberRole;
}

export const ServerHeader = ({ server, role }: ServerHeaderProps) => {
  const { onOpen } = useModal();
  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = role === MemberRole.MODERATOR || isAdmin;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none" asChild>
        <button
          className="w-full text-md font-semibold px-4 
        flex items-center h-12 border-neutral-200
        dark:border-neutral-800 border-b-2 hover:bg-slate-700/10  dark:hover:bg-slate-700/50 transition"
        >
          {server.name}
          <ChevronDown className="h-5 w-5 ml-auto " />
        </button>
      </DropdownMenuTrigger>

      {/* Inviting People
      Invitation could be sent by admin as well as moderator */}

      <DropdownMenuContent
        className=" w-56 text-sm font-medium
      text-black dark:text-neutral-400 space-y-[2px]"
      >
        {isModerator && (
          <DropdownMenuItem
            onClick={() => onOpen("Invite", { server })}
            className="text-indigo-600 dark:text-indigo-300 px-3 py-3 text-sm cursor-pointer"
          >
            Invite People
            <UserPlus className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}

        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen("EditServer", { server })}
            className="px-3 py-3 text-sm cursor-pointer"
          >
            Server Settings
            <Settings className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}

        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen("Members", { server })}
            className="px-3 py-3 text-sm cursor-pointer"
          >
            Manage Members
            <Users className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}

        {isModerator && (
          <DropdownMenuItem
            onClick={() => onOpen("CreateChannel", { server })}
            className="px-3 py-3 text-sm cursor-pointer"
          >
            Create Channel
            <PlusCircle className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}

        {isModerator && <DropdownMenuSeparator />}

        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen("DeleteServer", { server })}
            className=" text-rose-600 dark:text-rose-500 px-3 py-3 text-sm cursor-pointer"
          >
            Delete Server
            <Trash className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}

        {/* If we are Moderator or Guests */}
        {!isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen("LeaveServer", { server })}
            className=" text-rose-600 dark:text-rose-500 px-3 py-3 text-sm cursor-pointer"
          >
            Leave Server
            <LogOut className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
