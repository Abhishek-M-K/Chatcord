import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(
    req:Request
){
    try{
        const profile=await currentProfile();
        const {name, type}= await req.json();
        const {searchParams}= new URL(req.url);

        const serverId= searchParams.get("serverId");

        if(!profile){
            return new NextResponse("Unauthorized", {status: 401})
        }

        if(!serverId){
            return new NextResponse("Server Id Missing", {status: 400})
        }

        if(name=="general"){
            return new NextResponse("Channel Name Invalid", {status: 400})
        }

        const server=await db.server.update({
            where:{
                id:serverId,
                members:{
                    some:{
                        profileId:profile.id,
                        role:{
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR]
                        }
                    }
                }
            },
            data:{
                channels:{
                    create:{
                        profileId:profile.id,
                        name,
                        type,
                    }
                }
            }
        });

        return NextResponse.json(server);
    }catch(err){
        console.log("CHANNEL_CREATION_ERROR", err);
        return new NextResponse("Internal Server Error", {status: 500})
    }
}