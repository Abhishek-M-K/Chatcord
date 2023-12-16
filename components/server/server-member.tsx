"use client";

import { cn } from "@/lib/utils";
import { Member, MemberRole, Profile, Server } from "@prisma/client";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { UserAvatar } from "../user-avatar";

interface ServerMemberProps {
  member: Member & { profile: Profile };
  server: Server;
}

const roleIconMapping = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="w-4 h-4 ml-2 text-emerald-500" />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className="w-4 h-4 ml-2 text-rose-500" />,
};

export const ServerMember = ({ member, server }: ServerMemberProps) => {
  const params = useParams();
  const router = useRouter();

  const icon = roleIconMapping[member.role];
  //no need of capitalize icon as in server-channel.tsx
  //because in server-channel.tsx we are using capitalize since our mapping is done with lucide-react types
  //but here we are using our own mapping

  return (
    <button
      className={cn(
        "group p-2 rounded-lg flex items-center gap-x-2 w-full hover:bg-slate-700/10 dark:hover:bg-slate-700/50 transition",
        params?.memberId === member.id && "bg-slate-700/10 dark:bg-slate-700/50"
      )}
    >
      <UserAvatar
        src={member.profile.imageUrl}
        className="w-6 h-6 md:w-8 md:h-8"
      />
      <p
        className={cn(
          "text-sm lowercase font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition",
          params?.channelId === member.id &&
            "text-primary dark:text-slate-200 dark:group-hover:text-white"
        )}
      >
        {member.profile.name}
      </p>
      {icon}
    </button>
  );
};
