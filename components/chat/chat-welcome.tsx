import { Hash } from "lucide-react";

interface ChatWelcomeProps {
  name: string;
  type: "channel" | "conversation";
}

export const ChatWelcome = ({ type, name }: ChatWelcomeProps) => {
  return (
    <div className="space-y-2 px-4 mb-4 ">
      {type === "channel" && (
        <div
          className="w-[75px] h-[75px] rounded-full bg-slate-500 dark:bg-slate-700 
            flex items-center justify-center"
        >
          <Hash className="w-10 h-10 text-white" />
        </div>
      )}
      <p className="text-xl md:text-3xl font-bold">
        {type === "channel" ? "Welcome to #" : ""}
        {name}
      </p>
      <p>
        {type === "channel"
          ? `This is the start of the #${name} channel`
          : `"This is the start of your conversation with ${name}"`}
      </p>
    </div>
  );
};
