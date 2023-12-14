"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSub,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";

import { useModal } from "@/hooks/use-modal-store";
import { ServerWithMembersWithProfiles } from "@/types";
import { ScrollArea } from "../ui/scroll-area";
import { UserAvatar } from "../user-avatar";
import {
  Check,
  MoreVertical,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
} from "lucide-react";
import { useState } from "react";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";

const rolesMapping = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="w-4 h-4 text-green-500 ml-2" />,
  ADMIN: <ShieldAlert className="w-4 h-4 text-red-500 ml-2" />,
};

export const MembersModal = () => {
  const { isOpen, onOpen, onClose, type, data } = useModal();
  const [loadingId, setLoadingId] = useState("");

  const { server } = data as { server: ServerWithMembersWithProfiles }; // extractinng data from modal
  const isModalOpen = isOpen && type === "Members";

  return (
    <div className="bg-white">
      <Dialog open={isModalOpen} onOpenChange={onClose}>
        <DialogContent className=" bg-slate-900 text-white  overflow-hidden rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-white font-semibold px-8 py-4 text-center">
              Manage Members
            </DialogTitle>
            <DialogDescription className="text-center text-slate-500 dark:text-slate-300">
              {server?.members?.length} Members
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="mt-6 max-h-[420px] pr-6">
            {server?.members?.map((member) => (
              <div className="flex items-center gap-x-2 mb-6" key={member.id}>
                <UserAvatar src={member.profile.imageUrl} />
                <div className="flex flex-col gap-y-2">
                  <div className="text-xs font-semibold flex items-center gap-x-1">
                    {member.profile.name}
                    {rolesMapping[member.role]}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-300/50">
                    {member.profile.email}
                  </p>
                </div>
                {server.profileId !== member.profileId &&
                  loadingId !== member.id && (
                    <div className="ml-auto">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <MoreVertical className="w-4 h-4 text-slate-500 dark:text-slate-300/50" />
                          <DropdownMenuContent side="left">
                            <DropdownMenuSub>
                              <DropdownMenuSubTrigger className="flex items-center">
                                <ShieldQuestion className="w-4 h-4 mr-2" />
                                <span>Role</span>
                              </DropdownMenuSubTrigger>
                              <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                  <DropdownMenuItem className="flex flex-row mt-1 text-sm">
                                    <Shield className="w-4 h-4 mr-2 " />
                                    Guest
                                    {member.role === "GUEST" && (
                                      <Check className="w-4 h-4 ml-auto " />
                                    )}
                                  </DropdownMenuItem>
                                </DropdownMenuSubContent>
                              </DropdownMenuPortal>
                            </DropdownMenuSub>
                          </DropdownMenuContent>
                        </DropdownMenuTrigger>
                      </DropdownMenu>
                    </div>
                  )}
              </div>
            ))}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};
