import { FC, useEffect, useState } from "react";
import { Button } from "./ui/Button";
import { Heart, Import, MessageSquareText } from "lucide-react";
import { cn, formatTimeToNow } from "./lib/utils";
import { usePostsContext } from "../context/PostsContext";
import Modal from "./ui/Modal";
import PostCommentsModal from "./PostCommentsModal";
import axios from "axios";
import { toast } from "./hooks/use-toast";
import { API_BASE_URL } from "../config";

interface PostActionbarProps {
  postUrl: string;
  initialNumHugs: number;
  NumComments: number;
  createdAt: Date;
}

const PostActionbar: FC<PostActionbarProps> = ({
  postUrl,
  initialNumHugs,
  createdAt,
  NumComments,
}) => {
  const { updateNumHugs } = usePostsContext();
  const [currenNumHugs, setCurrenNumHugs] = useState<number>(initialNumHugs);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setCurrenNumHugs(initialNumHugs);
  }, [initialNumHugs]);

  function handleOnClose() {
    setShowModal(false);
  }

  async function handleHugClick() {
    setCurrenNumHugs((prev) => prev + 1);
    try {
      await axios.patch(`${API_BASE_URL}/posts/${postUrl}/hugs`);
      updateNumHugs(postUrl);
    } catch (error: any) {
      toast({
        title: "Failed to update Hugs",
        description: error.message || "Unknown error occurred",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="flex flex-row w-auto py-2">
      {/* hug button */}
      <div className="flex content-center mr-1">
        <Button
          onClick={() => {
            handleHugClick();
          }}
          size="sm"
          variant="ghost"
        >
          <>
            <Heart
              className={cn("text-zinc-400 h-4", {
                "text-pink-500 fill-pink-300": currenNumHugs,
              })}
            />
            <span
              className={cn("text-zinc-400", {
                "text-pink-500": currenNumHugs,
              })}
            >
              {currenNumHugs}
            </span>
            <span
              className={cn("text-zinc-400 hidden sm:block", {
                "text-pink-500": currenNumHugs,
              })}
            >
              &nbsp;Hugs
            </span>
          </>
        </Button>
      </div>

      {/* comment button */}
      <div className="flex content-center mr-1">
        <Button onClick={() => setShowModal(true)} size="sm" variant="ghost">
          <>
            <MessageSquareText
              className={cn("text-zinc-400 h-4", {
                "text-pink-500 fill-pink-300 ": NumComments,
              })}
            />
            <span
              className={cn("text-zinc-400", {
                "text-pink-500": NumComments,
              })}
            >
              {NumComments}
            </span>
            <span
              className={cn("text-zinc-400 hidden sm:block", {
                "text-pink-500": NumComments,
              })}
            >
              &nbsp;Comments
            </span>
          </>
        </Button>
      </div>

      {/* save button */}
      <div className="min-w-24 content-center">
        <Button size="sm" variant="ghost">
          <>
            <Import
              className={cn("text-zinc-400 h-4", {
                "text-pink-500 fill-pink-300 ": false,
              })}
            />
            <span className="text-zinc-400 hidden sm:block">Save</span>
          </>
        </Button>
      </div>
      <div className="text-right w-full my-auto text-zinc-400 font-sm">
        {formatTimeToNow(new Date(createdAt))}
      </div>
      <Modal visible={showModal} onClose={handleOnClose}>
        <PostCommentsModal postUrl={postUrl} />
      </Modal>
    </div>
  );
};
export default PostActionbar;
