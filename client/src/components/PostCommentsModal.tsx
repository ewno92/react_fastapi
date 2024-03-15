import { FC, useEffect, useRef, useState } from "react";
import { Comment } from "./types/Post";
import CommentBox from "./CommentBox";
import { Button } from "./ui/Button";
import { CircleX } from "lucide-react";
import TextArea from "./TextArea";
import axios from "axios";
import { toast } from "./hooks/use-toast";
import { API_BASE_URL, USER_NAME } from "../config";
import { usePostsContext } from "../context/PostsContext";

interface ApiResponse {
  comments: Comment[];
}

interface PostCommentsModalProps {
  postUrl: string;
}

const PostCommentsModal: FC<PostCommentsModalProps> = ({ postUrl }) => {
  const { updateNumComments } = usePostsContext();
  const [comments, setComments] = useState<Comment[]>([]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [replyInfo, setReplyInfo] = useState<{
    parentId: number | null;
    userName: string | null;
  }>({ parentId: null, userName: null });

  // Reference to the textarea element
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get<ApiResponse>(
          `${API_BASE_URL}/posts/${postUrl}/comments`
        );
        setComments(res.data.comments);
      } catch (error: any) {
        toast({
          title: "Failed to fetch comments",
          description: error.message || "There was an issue fetching posts.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [postUrl]);

  // Function to focus on textarea
  function selectTextArea() {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }

  // Function to handle reply click and set reply information
  function getReplyInfo(replyParentId: number | null, userName: string | null) {
    setReplyInfo({ parentId: replyParentId, userName });
    selectTextArea();
  }

  // Function to cancel replying and reset reply information
  function cancelReply() {
    setReplyInfo({ parentId: null, userName: null });
  }

  // Function to handle Enter key press for posting comment
  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.ctrlKey) {
      handlePostComment();
    }
  }

  // Function to handle posting comment
  async function handlePostComment() {
    if (input.length)
      try {
        setIsLoading(true);
        const body = {
          parent_id: replyInfo.parentId,
          display_name: USER_NAME,
          text: input,
        };
        const res = await axios.put<ApiResponse>(
          `${API_BASE_URL}/posts/${postUrl}/comments`,
          body
        );
        setInput("");
        setReplyInfo({ parentId: null, userName: null });
        setComments(res.data.comments);
        updateNumComments(postUrl);
        toast({
          title: "Comment Posted",
          description: "Your comment has been successfully posted.",
          variant: "default",
        });
      } catch (error: any) {
        toast({
          title: "Failed to post a comment",
          description: error.message || "Unknown error occurred",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
  }

  return (
    <div className="pt-5 px-5 max-w-6xl">
      {/* Display comments */}
      <div className="min-h-96 max-h-96 overflow-y-auto pb-2">
        {comments.length === 0 ? (
          <h1>Be the first one to comment!</h1>
        ) : (
          comments.map((comment) => (
            <div key={comment.id}>
              <CommentBox comment={comment} onClickReply={getReplyInfo} />
            </div>
          ))
        )}
      </div>

      {/* Display reply information */}
      {replyInfo.userName && (
        <div className="flex">
          <div
            onClick={cancelReply}
            className="flex justify-center items-center cursor-pointer"
          >
            <span>
              Reply to <strong>{replyInfo.userName}</strong>
            </span>
            <CircleX className="h-7 p-1 ml-1 text-red-400" />
          </div>
          <div className="grow" />
        </div>
      )}

      {/* Textarea for input and button to post comment */}
      <div className="flex">
        <TextArea
          ref={textareaRef}
          value={input}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>): void =>
            setInput(e.target.value)
          }
          onKeyDown={handleKeyDown}
          placeholder="What do you have in mind?"
        />
        <Button
          onClick={handlePostComment}
          size="xs"
          variant="simple"
          className="h-[80px] p-5 text-md w-36"
          isLoading={isLoading}
        >
          comment
        </Button>
      </div>
    </div>
  );
};

export default PostCommentsModal;
