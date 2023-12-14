"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useModal } from "@/hooks/use-modal-store";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Check, Copy, RefreshCw } from "lucide-react";
import { useOrigin } from "@/hooks/use-origin";
import { useState } from "react";
import axios from "axios";

export const InviteModal = () => {
  const { isOpen, onOpen, onClose, type, data } = useModal();
  const origin = useOrigin();
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { server } = data; // extractinng data from modal
  const isModalOpen = isOpen && type === "Invite";

  const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  const handleNewLink = async () => {
    try {
      setIsLoading(true);

      const response = await axios.patch(
        `/api/servers/${server?.id}/invite-code`
      );

      onOpen("Invite", { server: response.data });
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white">
      <Dialog open={isModalOpen} onOpenChange={onClose}>
        <DialogContent className=" bg-slate-900 text-white p-0 overflow-hidden rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-white font-semibold px-8 py-4 text-center">
              Invite People
            </DialogTitle>
          </DialogHeader>
          <div className="p-6">
            <Label className="uppercase text-sm font-semibold text-slate-500 dark:text-white/70">
              Invite Link
            </Label>
            <div className="flex items-center mt-2 gap-x-2">
              <Input
                disabled={isLoading}
                className="bg-slate-300/60 border-0 focus-visible:ring-0 
              text-black focus-visible:ring-offset-0"
                value={inviteUrl}
              />
              <Button
                disabled={isLoading}
                onClick={copyToClipboard}
                size="icon"
              >
                {copied ? (
                  <Check className="w-4 h-4 " />
                ) : (
                  <Copy className="w-4 h-4 " />
                )}
              </Button>
            </div>
            <Button
              disabled={isLoading}
              onClick={handleNewLink}
              variant="link"
              size="sm"
              className="text-xs text-slate-500 mt-4 dark:text-white/70"
            >
              Generate new link
              <RefreshCw className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
