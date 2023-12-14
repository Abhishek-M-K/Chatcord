"use client";

import qs from "query-string";
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
  Hammer,
  Loader,
  MoreVertical,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
} from "lucide-react";
import { useState } from "react";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { MemberRole } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { set } from "react-hook-form";

const rolesMapping = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="w-4 h-4 text-green-500 ml-2" />,
  ADMIN: <ShieldAlert className="w-4 h-4 text-red-500 ml-2" />,
};

export const MembersModal = () => {
  const router = useRouter();
  const { isOpen, onOpen, onClose, type, data } = useModal();
  const [loadingId, setLoadingId] = useState("");

  const { server } = data as { server: ServerWithMembersWithProfiles }; // extractinng data from modal
  const isModalOpen = isOpen && type === "Members";

  const handleRoleChange = async (memberId: string, role: MemberRole) => {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id,
          //not necessary since url is containing
        },
      });

      const response = await axios.patch(url, { role });

      router.refresh();
      onOpen("Members", { server: response.data });
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingId("");
    }
  };

  const handleKickMember = async (memberId: string) => {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id,
        },
      });

      const response = await axios.delete(url);

      router.refresh();
      onOpen("Members", { server: response.data });
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingId("");
    }
  };

  return (
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
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="left">
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger className="flex items-center">
                            <ShieldQuestion className="w-4 h-4 mr-2" />
                            <span>Role</span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleRoleChange(member.id, "GUEST")
                                }
                                className="flex flex-row mt-1 text-sm"
                              >
                                <Shield className="w-4 h-4 mr-2 " />
                                Guest
                                {member.role === "GUEST" && (
                                  <Check className="w-4 h-4 ml-auto" />
                                )}
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() =>
                                  handleRoleChange(member.id, "MODERATOR")
                                }
                                className="flex flex-row mt-1 text-sm"
                              >
                                <ShieldCheck className="w-4 h-4 mr-2 " />
                                Moderator
                                {member.role === "MODERATOR" && (
                                  <Check className="w-4 h-4 ml-auto" />
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleKickMember(member.id)}
                          className="flex flex-row mt-1 text-sm py-1 ml-1"
                        >
                          <Hammer className="w-4 h-4 mr-2" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              {loadingId === member.id && (
                <Loader className="text-slate-500 dark:text-slate-300 w-4 h-4 ml-auto animate-spin" />
              )}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
