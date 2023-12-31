"use client";

import { cn } from "@/lib/utils";
import { Channel, ChannelType, MemberRole, Server } from "@prisma/client";
import { Edit2, Hash, Lock, Mic, Trash2, Video } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ActionTooltip } from "../action-tooltip";
import { ModalType, useModal } from "@/hooks/use-modal-store";
import React from "react";

interface ServerChannelProps {
  channel: Channel;
  server: Server;
  role?: MemberRole;
}

const iconMapping = {
  [ChannelType.TEXT]: Hash,
  [ChannelType.AUDIO]: Mic,
  [ChannelType.VIDEO]: Video,
};

export const ServerChannel = ({
  channel,
  server,
  role,
}: ServerChannelProps) => {
  const params = useParams();
  const router = useRouter();
  const { onOpen } = useModal();

  const Icon = iconMapping[channel.type];

  const handleClick = () => {
    router.push(`/servers/${params?.serverId}/channels/${channel.id}`);
  };

  //since handleClick is a global click action, it is overridinng edit and delete channel events
  //so for that purpose we are using onAction function which will stop the propagation of handleClick
  //and will only trigger edit and delete channel events

  const onAction = (e: React.MouseEvent, action: ModalType) => {
    e.stopPropagation();
    onOpen(action, { server, channel });
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "group p-2 rounded-lg flex items-center gap-x-2 w-full hover:bg-slate-700/10 dark:hover:bg-slate-700/50 transition",
        params?.channelId === channel.id &&
          "bg-slate-700/10 dark:bg-slate-700/50"
      )}
    >
      <Icon
        className="w-4 h-5 flex-shrink-0 text-slate-500
        dark:text-slate-400"
      />
      <p
        className={cn(
          "text-sm font-semibold line-clamp-1 text-slate-500 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition",
          params?.channelId === channel.id &&
            "text-primary dark:text-slate-200 dark:group-hover:text-white"
        )}
      >
        {channel.name}
      </p>
      {channel.name !== "general" && role !== MemberRole.GUEST && (
        <div className="flex items-center gap-x-2 ml-auto">
          <ActionTooltip label="edit">
            <Edit2
              // onClick={() => onOpen("EditChannel", { server, channel })}
              onClick={(e) => onAction(e, "EditChannel")}
              className="hidden group-hover:block w-4 h-4 mr-2
            text-slate-500 dark:text-slate-400 
            hover:text-slate-600 dark:hover:text-slate-300 transition"
            />
          </ActionTooltip>

          <ActionTooltip label="delete">
            <Trash2
              //onClick={() => onOpen("DeleteChannel", { server, channel })}
              onClick={(e) => onAction(e, "DeleteChannel")}
              className="hidden group-hover:block w-4 h-4 mr-2
            text-slate-500 dark:text-slate-400 
            hover:text-slate-600 dark:hover:text-slate-300 transition"
            />
          </ActionTooltip>
        </div>
      )}

      {channel.name === "general" && (
        <div className="flex items-center gap-x-2 ml-auto">
          <Lock
            className="hidden group-hover:block w-4 h-4 mr-2
            text-slate-500 dark:text-slate-400 
            hover:text-slate-600 dark:hover:text-slate-300 transition"
          />
        </div>
      )}
    </button>
  );
};
