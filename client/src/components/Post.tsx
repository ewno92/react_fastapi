import { FC } from "react";
import { NavLink } from "react-router-dom";
import PostActionbar from "./PostActionbar";

interface PostProps {
  postUrl: string;
  title: string;
  createdAt: Date;
  numHugs: number;
  description: string;
  numComments: number;
}

const Post: FC<PostProps> = ({
  postUrl,
  title,
  createdAt,
  numHugs,
  description,
  numComments,
}) => {
  return (
    <div className="rounded-md bg-white shadow p-3 pb-0 mb-4">
      <div className="flex flex-col">
        <NavLink to={`/posts/${postUrl}`} className="cursor-pointer">
          <h1 className="text-lg font-semibold leading-6 text-gray-900 hover:text-zinc-500">
            {title}
          </h1>
          <div className="relative text-sm max-h-32 overflow-clip hover:text-zinc-500">
            <p className="hover:text-zinc-500">{description}</p>
            <div className="absolute bottom-0 left-0 h-14 w-full bg-gradient-to-t from-white to-transparent"></div>
          </div>
        </NavLink>
        <div className="max-h-40 text-xs text-gray-500">
          <PostActionbar
            postUrl={postUrl}
            initialNumHugs={numHugs}
            createdAt={createdAt}
            NumComments={numComments}
          />
        </div>
      </div>
    </div>
  );
};
export default Post;
