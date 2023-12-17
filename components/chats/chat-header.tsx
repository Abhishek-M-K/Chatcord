import { Hash, Menu, MenuSquare } from "lucide-react";
import { MobileToggle } from "../mobile-toggle";

interface ChatHeaderProps {
  serverId: string;
  name: string;
  type: "channel" | "conversation";
  imageUrl?: string;
}

export const ChatHeader = ({
  serverId,
  name,
  type,
  imageUrl,
}: ChatHeaderProps) => {
  return (
    <div
      className="font-semibold text-md px-4 flex items-center 
    h-12 border-neutral-200 dark:border-neutral-800 border-b-2"
    >
      {/* <MenuSquare /> */}
      <MobileToggle serverId={serverId} />
      {type === "channel" && (
        <Hash className="w-5 h-5 mr-2 text-slate-500 dark:text-slate-400" />
      )}

      <p className="font-semibold text-md dark:text-white text-black">{name}</p>
    </div>
  );
};
