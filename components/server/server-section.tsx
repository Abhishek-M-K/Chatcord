"use client";

import { ServerWithMembersWithProfiles } from "@/types";
import { ChannelType, MemberRole } from "@prisma/client";
import { Server } from "http";
import { ActionTooltip } from "../action-tooltip";
import { Plus, Settings } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";

interface ServerSectionProps {
  label: string;
  role?: MemberRole;
  sectionType: "channels" | "members";
  channelType?: ChannelType;
  server?: ServerWithMembersWithProfiles;
}

export const ServerSection = ({
  label,
  role,
  sectionType,
  channelType,
  server,
}: ServerSectionProps) => {
  const { onOpen } = useModal();
  return (
    <div className="py-2 flex items-center justify-between">
      <p
        className="text-xs uppercase font-semibold 
        text-slate-500 dark:text-slate-400"
      >
        {label}
      </p>

      {/* actions for channnels section */}
      {role !== MemberRole.GUEST && sectionType === "channels" && (
        <ActionTooltip side="top" label="Create a channel">
          <button onClick={() => onOpen("CreateChannel")}>
            <Plus
              className="w-4 h-4 mr-2  text-slate-500 dark:text-slate-400 
            hover:text-slate-600 dark:hover:text-slate-300"
            />
          </button>
        </ActionTooltip>
      )}

      {/* actions for members section */}
      {role === MemberRole.ADMIN && sectionType === "members" && (
        <ActionTooltip side="top" label="Manage members">
          <button onClick={() => onOpen("Members", { server })}>
            <Settings
              className="w-4 h-4 mr-2  text-slate-500 dark:text-slate-400 
          hover:text-slate-600 dark:hover:text-slate-300"
            />
          </button>
        </ActionTooltip>
      )}
    </div>
  );
};
