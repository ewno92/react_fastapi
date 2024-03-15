import { useEffect, useState } from "react";
import { usePostsContext } from "../../context/PostsContext";
import { API_BASE_URL } from "../../config";
import axios from "axios";
import { Post } from "../types/Post";
import { toast } from "./use-toast";

interface ApiResponse {
  posts: Post[];
  hasMore: boolean;
}

export default function useInfiniteScrollPosts() {
  const { offset, hasMore, posts, limit, setPosts, setHasMore } =
    usePostsContext();

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get<ApiResponse>(
          `${API_BASE_URL}/posts?limit=${limit}&offset=${offset}`
        );
        setPosts((prevPosts) => {
          const newPosts = res.data.posts.filter(
            (newPost: { post_url: string }) =>
              !prevPosts.some(
                (prevPost) => prevPost.post_url === newPost.post_url
              )
          );
          return [...prevPosts, ...newPosts];
        });
        setHasMore(res.data.hasMore);
      } catch (error: any) {
        toast({
          title: "Failed to fetch comments",
          description: error.message || "Unknown error occurred",
          variant: "destructive",
        });
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [offset]);

  return { loading, error, posts, hasMore };
}
