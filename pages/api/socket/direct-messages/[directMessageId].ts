import { db } from "@/lib/db";
import { currentProfilePages } from "@/lib/pages-current-profile";
import { NextApiResponseServerIO } from "@/types";
import { MemberRole } from "@prisma/client";
import { NextApiRequest } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponseServerIO,    
)
{
    if(req.method!=="DELETE" && req.method!=="PATCH") return res.status(405).json({error:"Method not allowed"});

    try{
        const profile=await currentProfilePages(req);
        const {directMessageId, conversationId}=req.query;
        const {content}=req.body;

        if(!profile) return res.status(401).json({error:"Unauthorized"});

        if(!conversationId) return res.status(400).json({error:"Conversation ID Missing"}); 

        const conversation=await db.conversation.findFirst({
            where:{
                id:conversationId as string,
                OR:[{
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
        if(!conversation) return res.status(404).json({error:"Converstaion not found"});

        const member=conversation.member1.profileId===profile.id? conversation.member1: conversation.member2;

        if(!member) return res.status(404).json({error:"Member not found"});

        let directMessage=await db.dM.findFirst({
            where:{
                id:directMessageId as string,
                conversationId:conversationId as string,
            },
            include:{
                member:{
                    include:{
                        profile:true
                    }
                }
            }
        });

        if(!directMessage || directMessage.deleted) return res.status(404).json({error:"Message not found"});

        const isMsgOwner=directMessage.memberId===member.id;
        const isAdmin=member.role===MemberRole.ADMIN;
        const isModerator=member.role===MemberRole.MODERATOR;
        const canModify=isMsgOwner || isAdmin || isModerator;

        if(!canModify) return res.status(401).json({error:"Unauthorized"});

        //soft delete message

        if(req.method==="DELETE"){
            directMessage=await db.dM.update({
                where:{
                    id:directMessageId as string
                },
                data:{
                    fileUrl:null,
                    content:"Message has been deleted",
                    deleted:true
                },
                include:{
                    member:{
                        include:{
                            profile:true
                        }
                    }
                }
            });
        }

           
            if(req.method==="PATCH"){
                if(!isMsgOwner){
                    return res.status(401).json({error:"Unauthorized"});
                }

                directMessage=await db.dM.update({
                    where:{
                        id:directMessageId as string
                    },
                    data:{
                       
                        content,
                    },
                    include:{
                        member:{
                            include:{
                                profile:true
                            }
                        }
                    }
                }); 
        }
        //emit update to all clients
        const updateKey= `chat:${conversation.id}:messages:update`;
        res?.socket?.server?.io?.emit(updateKey, directMessage);
        return res.status(200).json({directMessage});

    }catch(err){
        console.error('DIRECT_MESSAGE_ERR', err);
        return res.status(500).json({error:"Something went wrong"});
    }
}