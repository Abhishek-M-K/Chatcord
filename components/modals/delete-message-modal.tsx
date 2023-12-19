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

export const DeleteMessageModal = () => {
  const { isOpen, onOpen, onClose, type, data } = useModal();
  const [isLoading, setIsLoading] = useState(false);

  const { apiUrl, query } = data; // extractinng data from modal
  const isModalOpen = isOpen && type === "DeleteMessage";

  const onDelete = async () => {
    try {
      setIsLoading(true);
      const url = qs.stringifyUrl({
        url: apiUrl || "",
        query,
      });

      await axios.delete(url);
      onClose();
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
            Delete Message
          </DialogTitle>
          <DialogDescription className="text-center">
            Are you sure you want to do this ? <br />
            The message will be permanently deleted !
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
