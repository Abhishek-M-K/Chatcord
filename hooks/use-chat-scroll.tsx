import { set } from "date-fns";
import { useEffect, useState } from "react";

type ChatScrollProps = {
  chatRef: React.RefObject<HTMLDivElement>;
  bottomRef: React.RefObject<HTMLDivElement>;
  shouldLoad: boolean;
  loadMore: () => void;
  count: number;
};

export const useChatScroll = ({
  chatRef,
  bottomRef,
  shouldLoad,
  loadMore,
  count,
}: ChatScrollProps) => {
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    const topdiv = chatRef?.current;

    const handleScroll = () => {
      const scrollTop = topdiv?.scrollTop;

      if (scrollTop === 0 && shouldLoad) {
        loadMore();
      }
    };

    topdiv?.addEventListener("scroll", handleScroll);

    return () => {
      topdiv?.removeEventListener("scroll", handleScroll);
    };
  }, [shouldLoad, loadMore, chatRef]);

  //for new messages
  useEffect(() => {
    const bottomdiv = bottomRef?.current;
    const topdiv = chatRef?.current;
    const shouldAutoScroll = () => {
      if (!hasInitialized && bottomdiv) {
        setHasInitialized(true);
        return true;
      }

      if (!topdiv) return false;

      const distFromBottom =
        topdiv.scrollHeight - topdiv.scrollTop - topdiv.clientHeight;
      return distFromBottom <= 100;
    };

    if (shouldAutoScroll()) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({
          behavior: "smooth",
        });
      }, 100);
    }
  }, [bottomRef, chatRef, count, hasInitialized]);
};
