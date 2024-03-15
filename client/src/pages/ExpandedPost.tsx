import axios from "axios";
import { useParams } from "react-router-dom";
import type { PartialPost, Post } from "../components/types/Post";
import { FC, useEffect, useState } from "react";
import PostActionbar from "../components/PostActionbar";
import { API_BASE_URL } from "../config";
import { Loader } from "lucide-react";
import { toast } from "../components/hooks/use-toast";
import Markdown from "react-markdown";
import ErrorPage from "./ErrorPage";
import { usePostsContext } from "../context/PostsContext";

interface ExpandedPostResponse {
  post: Post;
}
interface PartialPostResponse {
  post: PartialPost;
}

const ExpandedPost: FC = () => {
  const { hasAssessment, getPostById, updatePostAttributes, setPosts } =
    usePostsContext();
  const { id } = useParams();
  const [postData, setPostData] = useState<Post | null>(getPostById(id!));
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (getPostById(id!) === null) {
          const res = await axios.get<ExpandedPostResponse>(
            `${API_BASE_URL}/posts/${id}`
          );
          setPosts((prevPosts) => {
            const newPost = res.data.post;
            return [...prevPosts, newPost];
          });
        } else if (!hasAssessment(id!)) {
          const res = await axios.get<PartialPostResponse>(
            `${API_BASE_URL}/posts/${id}/partial`
          );
          updatePostAttributes(id!, res.data.post);
        }
      } catch (error: any) {
        toast({
          title: "Failed to get Post data",
          description: error.message || "Unknown error occurred",
          variant: "destructive",
        });
        setError(true);
      }
    };
    fetchData();
  }, []);

  const post = getPostById(id!);
  useEffect(() => {
    setPostData(post);
  }, [post]);

  if (error && post === null) {
    return <ErrorPage />;
  }

  if (!postData) {
    return (
      <div className="w-full flex justify-center">
        <Loader className="h-20 w-20 animate-spin text-zinc-400" />
      </div>
    );
  }
  const {
    title,
    num_hugs,
    assessment,
    patient_description,
    num_comments,
    created_at,
  } = postData;

  return (
    <div id="Expanded-Post-Page">
      <h1 className="md:text-2xl text-lg font-semibold mb-7">{title}</h1>
      <h1>Patient Description:</h1>
      <Markdown className="pb-3">{patient_description}</Markdown>
      <h1>Assessment:</h1>
      <Markdown className="pb-3">{assessment}</Markdown>
      <div className="sticky bottom-0 bg-zinc-100 border-solid border-zinc-300 border-t">
        <PostActionbar
          postUrl={id!}
          initialNumHugs={num_hugs}
          createdAt={created_at}
          NumComments={num_comments}
        />
      </div>
    </div>
  );
};

export default ExpandedPost;
