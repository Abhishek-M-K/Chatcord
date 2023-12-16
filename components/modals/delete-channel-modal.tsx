"use client";

import axios from "axios";
import qs from "query-string";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useModal } from "@/hooks/use-modal-store";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export const DeleteChannelModal = () => {
  const router = useRouter();
  const { isOpen, onOpen, onClose, type, data } = useModal();
  const [isLoading, setIsLoading] = useState(false);

  const { server, channel } = data; // extractinng data from modal
  const isModalOpen = isOpen && type === "DeleteChannel";

  const onDelete = async () => {
    try {
      setIsLoading(true);
      const url = qs.stringifyUrl({
        url: `/api/channels/${channel?.id}`,
        query: {
          serverId: server?.id,
        },
      });
      await axios.delete(url);
      onClose();
      router.refresh();
      router.push(`/servers/${server?.id}`);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className=" bg-slate-900 text-white p-0 overflow-hidden rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-white font-semibold px-8 py-4 text-center">
            Delete Channel
          </DialogTitle>
          <DialogDescription className="text-center">
            Are you sure you want to permanently delete the <br />
            <span className="font-semibold text-rose-500">
              #{channel?.name}
            </span>{" "}
            server ?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 dark:bg-slate-800 px-6 py-4 ">
          <div className="flex items-center justify-between w-full">
            <Button disabled={isLoading} onClick={onClose} variant="ghost">
              Cancel
              <X className="w-4 h-4 ml-2 text-rose-500" />
            </Button>
            <Button disabled={isLoading} onClick={onDelete} variant="primary">
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
