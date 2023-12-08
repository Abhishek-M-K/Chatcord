"use client";

import { Plus } from "lucide-react";
import { ActionTooltip } from "@/components/action-tooltip";
import { useModal } from "@/hooks/use-modal-store";

export const NavigationAction = () => {
  const { onOpen } = useModal();
  return (
    <div>
      <ActionTooltip label="Create Server" side="right" align="center">
        <button onClick={() => onOpen("CreateServer")} className="group">
          <div
            className="flex mx-3 h-[48px] w-[48px] rounded-full
        group-hover:rounded-lg overflow-hidden items-center justify-center transition-all 
        bg-background bg-slate-700 group-hover:bg-emerald-600"
          >
            <Plus
              className="group-hover:text-white transition text-emerald-600 "
              size={30}
            />
          </div>
        </button>
      </ActionTooltip>
    </div>
  );
};
