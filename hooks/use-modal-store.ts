import { Channel, ChannelType, Server } from '@prisma/client';
import { type } from 'os';
import {create} from 'zustand';

export type ModalType = "CreateServer" | "Invite" | "EditServer" | "Members" | "CreateChannel" | "LeaveServer" | "DeleteServer" | "DeleteChannel" | "EditChannel" | "FileMessage" | "DeleteMessage";

interface ModalData{
    server?: Server;
    channel?: Channel;
    channelType?: ChannelType;
    apiUrl?: string; //for delete msg
    query?: Record<string, any>; //for delete msg
}

interface ModalStore{
    type: ModalType | null;
    data: ModalData;
    isOpen: boolean;
    onOpen: (type: ModalType, data?: ModalData) => void;
    onClose: () => void;
}

export const useModal=create<ModalStore>((set)=>({
    type:null,
    data:{},
    isOpen:false,
    onOpen: (type, data={})=>set({isOpen:true, type, data}),
    onClose: ()=>set({isOpen:false, type:null}),
}))
