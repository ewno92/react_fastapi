import { formatTimeToNow } from "./lib/utils";
import {
  MessageSquareReply,
  ArrowDownFromLine,
  ArrowUpFromLine,
  Heart,
} from "lucide-react";
import { Button } from "./ui/Button";
import { Comment } from "./types/Post";

import { FC, memo, useState } from "react";

interface CommentBoxProps {
  comment: Comment;
  onClickReply: (
    replyUserId: number | null,
    replyUserName: string | null
  ) => void;
}

const CommentBox: FC<CommentBoxProps> = ({ comment, onClickReply }) => {
  const { id, display_name, text, created_at, child } = comment;
  const [expanded, setExpanded] = useState<boolean>(false);

  // Function to handle expanding/collapsing the comment
  function handleExpand() {
    setExpanded((prev) => !prev);
  }

  // Function to handle clicking on the reply button
  function handleReplyClick() {
    onClickReply(id, display_name);
    setExpanded(true);
  }

  const hasChild = !!child;

  return (
    <div className="text-left text-sm flex pt-3">
      <div
        onClick={handleExpand}
        className="min-w-8 min-h-full flex group cursor-pointer pl-1"
      >
        {hasChild && (
          <div className="flex flex-col items-center">
            <Button
              size="xs"
              variant="default"
              className="group-hover:bg-zinc-100"
            >
              <>
                {expanded ? (
                  <ArrowUpFromLine className="h-3" />
                ) : (
                  <ArrowDownFromLine className="h-3" />
                )}
              </>
            </Button>
            {expanded && (
              <div className="w-1 h-full rounded-lg bg-zinc-300 group-hover:bg-zinc-400 transition-colors duration-300 " />
            )}
          </div>
        )}
      </div>
      <div className="flex flex-col pl-1 ">
        <div>
          <span className="font-bold text-black">{display_name}</span>
          <span className="ml-3 text-xs">
            ● {formatTimeToNow(new Date(created_at))}
          </span>
        </div>
        <p className="text-zinc-700 break-all">{text}</p>

        <div className="flex">
          <div>
            <Button size="xs" variant="default" className="relative right-1">
              <Heart className="h-4" />
            </Button>
            <Button
              onClick={handleReplyClick}
              size="xs"
              variant="default"
              className="pt-1"
            >
              <>
                <MessageSquareReply className="h-4" />
                reply
              </>
            </Button>
          </div>
        </div>
        {child &&
          expanded &&
          child.map((c) => (
            <div className="flex flex-col relative right-2" key={c.id}>
              <div className="ml-0">
                <CommentBox comment={c} onClickReply={onClickReply} />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default memo(CommentBox);
