import { db } from "@/lib/db";
import {  currentProfilePages } from "@/lib/pages-current-profile";
import { NextApiResponseServerIO } from "@/types";
import { NextApiRequest } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponseServerIO,
){
    if(req.method!=="POST") return res.status(405).json({error:"Method not allowed"});

    try{
        const profile=await currentProfilePages(req);
        const {content, fileUrl}=req.body;
        const {conversationId}=req.query;

        if(!profile) return res.status(401).json({error:"Unauthorized"});

        if(!conversationId) return res.status(400).json({error:"Server ID Missing"});

        if(!content) return res.status(400).json({error:"Content Missing"});

        const conversation=await db.conversation.findFirst({
            where:{
                id:conversationId as string,
                OR: [{
                    member1:{
                        profileId:profile.id
                    }
                },{
                    member2:{
                        profileId:profile.id
                    }
                }]
            },
            include:{
                member1:{
                    include:{
                        profile:true
                    }
                },
                member2:{
                    include:{
                        profile:true
                    }
                }
            }
        });

        if(!conversation) return res.status(401).json({error:"Conversation not found"});

        const member=conversation.member1.profileId===profile.id? conversation.member1: conversation.member2;

        if(!member) return res.status(401).json({error:"member not found"});

        const message=await db.dM.create({
            data:{
                content,
                fileUrl,
                conversationId: conversationId as string,
                memberId:member.id
            },
            include:{
                member:{
                    include:{
                        profile:true
                    
                    }
                }
            }
        });

        const channelKey= `chat:{conversationId}:messages`; //unique key for visualizing each channel
        res?.socket?.server?.io?.emit(channelKey, message);

        return res.status(200).json({message});

    }catch(err){
        console.log("DIRECT_MESSAGES_ERR",err);
        return res.status(500).json({message:"Internal server error"});
    }
}