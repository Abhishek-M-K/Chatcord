import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { NavigationAction } from "./navigation-action";
import { Separator } from "@/components/ui/separator";

export const NavigationSidebar = async () => {
  const profile = await currentProfile();
  if (!profile) return redirect("/");

  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  return (
    <div
      className="space-y-4 flex flex-col items-center
    h-full text-primary w-full bg-slate-950 py-3 text-white"
    >
      <NavigationAction />
      <Separator className="h-[4px] bg-slate-700 rounded-md w-12 mx-auto" />
    </div>
  );
};
