"use client";

import axios from "axios";
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
import { set } from "react-hook-form";
import { useRouter } from "next/navigation";

export const DeleteServerModal = () => {
  const router = useRouter();
  const { isOpen, onOpen, onClose, type, data } = useModal();
  const [isLoading, setIsLoading] = useState(false);

  const { server } = data; // extractinng data from modal
  const isModalOpen = isOpen && type === "DeleteServer";

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/servers/${server?.id}`);
      onClose();
      router.refresh();
      router.push("/");
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
            Delete Server
          </DialogTitle>
          <DialogDescription className="text-center">
            Are you sure you want to permanently delete the <br />
            <span className="font-semibold text-rose-500">
              {server?.name}
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
