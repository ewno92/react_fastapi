import { useCallback, useRef } from "react";
import { Loader } from "lucide-react";
import Post from "./Post";
import { INFINITE_SCROLL_PAGINATION_RESULTS } from "../config";
import { usePostsContext } from "../context/PostsContext";

const PostFeed = () => {
  const { offset, setOffset, loading, error, hasMore, posts } =
    usePostsContext();

  // Ref for observing the last post element to trigger loading more posts
  const observer = useRef<IntersectionObserver | null>(null);

  // Callback function for observing the last post element
  const lastPostRef = useCallback(
    (node: null) => {
      // Check if still loading or if the observer exists
      if (loading) return;
      if (error) return;
      if (observer.current) observer.current.disconnect();

      // Create a new IntersectionObserver to trigger loading more posts when last post is in view
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            // Increment offset to load more posts
            setOffset(
              (prevOffset) => prevOffset + INFINITE_SCROLL_PAGINATION_RESULTS
            );
          }
        },
        { root: null, threshold: 1 }
      );
      // Observe the last post element
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, offset]
  );

  return (
    <div className="xl:w-1/2 lg:w-2/3 mx-auto relative">
      <ul>
        {posts.map((post, index) => (
          <li
            className=" list-none"
            key={index}
            ref={index === posts.length - 1 ? lastPostRef : undefined}
          >
            <Post
              postUrl={post.post_url}
              title={post.title}
              createdAt={post.created_at}
              numHugs={post.num_hugs}
              description={post.patient_description}
              numComments={post.num_comments}
            />
          </li>
        ))}
        {loading && (
          <div className="flex justify-center pb-5">
            <Loader className="w-6 h-6 text-zinc-500 animate-spin" />
          </div>
        )}
      </ul>
    </div>
  );
};

export default PostFeed;
