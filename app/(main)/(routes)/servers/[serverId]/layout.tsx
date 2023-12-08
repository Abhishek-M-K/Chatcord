import { ServerSidebar } from "@/components/server/server-sidebar";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const ServerIdLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { serverId: string };
}) => {
  const profile = await currentProfile();

  if (!profile) return redirectToSignIn();

  const server = await db.server.findUnique({
    // here we are using the serverId from the params to find the server
    // since we are having a folder by serverId it is easy to find the server
    //incase we had something else, we would have to change things accordingly
    where: {
      id: params.serverId,
      //here id is not the only thing required to load the servers and the msgs
      //since anyone with serverid can access the server
      //therefore we have to check whether the user profile is matching with any of members
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (!server) {
    return redirect("/");
  }

  return (
    // beside the sidebar we also developing a section which will include the channels
    <div className="h-full">
      <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0 text-white">
        {/* Channels */}
        <ServerSidebar serverId={params.serverId} />
      </div>
      <main className="h-full md:pl-60">{children}</main>
    </div>
  );
};

export default ServerIdLayout;
