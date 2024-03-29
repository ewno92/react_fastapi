import {
  createContext,
  useContext,
  ReactNode,
  useState,
  FC,
  useEffect,
} from "react";
import { Post, PartialPost } from "../components/types/Post";
import { API_BASE_URL, INFINITE_SCROLL_PAGINATION_RESULTS } from "../config";
import axios from "axios";

interface PostsContextProps {
  loading: boolean;
  error: boolean;
  hasMore: boolean;
  offset: number;
  limit: number;
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  setOffset: React.Dispatch<React.SetStateAction<number>>;
  setHasMore: React.Dispatch<React.SetStateAction<boolean>>;
  updateNumHugs: (postId: string) => void;
  updateNumComments: (postId: string) => void;
  hasAssessment: (postId: string) => boolean;
  getPostById: (postId: string) => Post | null;
  updatePostAttributes: (postId: string, attributes: PartialPost) => void;
}

interface ApiResponse {
  posts: Post[];
  hasMore: boolean;
}
const PostsContext = createContext<PostsContextProps | undefined>(undefined);

export const PostsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [offset, setOffset] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [limit] = useState<number>(INFINITE_SCROLL_PAGINATION_RESULTS);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  function updateNumHugs(postId: string) {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.post_url === postId
          ? { ...post, num_hugs: post.num_hugs + 1 }
          : post
      )
    );
  }

  function updateNumComments(postId: string) {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.post_url === postId
          ? { ...post, num_comments: post.num_comments + 1 }
          : post
      )
    );
  }

  function hasAssessment(postId: string): boolean {
    const post = posts.find((post) => post.post_url === postId);
    return post ? !!post.assessment : false;
  }

  function getPostById(postId: string): Post | null {
    return posts.find((post) => post.post_url === postId) || null;
  }

  function updatePostAttributes(postId: string, attributes: Partial<Post>) {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.post_url === postId ? { ...post, ...attributes } : post
      )
    );
  }

  const value: PostsContextProps = {
    error,
    loading,
    offset,
    posts,
    limit,
    hasMore,
    setHasMore,
    setPosts,
    setOffset,
    updateNumHugs,
    updateNumComments,
    hasAssessment,
    getPostById,
    updatePostAttributes,
  };

  useEffect(() => {
    //this is for getting posts for infinity scroll posts
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get<ApiResponse>(
          `${API_BASE_URL}/posts?limit=${limit}&offset=${offset}`
        );
        setPosts((prevPosts) => {
          //filter duplicate posts
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
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [offset]);

  return (
    <PostsContext.Provider value={value}>{children}</PostsContext.Provider>
  );
};

export const usePostsContext = () => {
  const context = useContext(PostsContext);
  if (!context) {
    throw new Error("usePostsContext must be used within a PostsProvider");
  }
  return context;
};
