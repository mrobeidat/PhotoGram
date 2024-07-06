import { Models } from "appwrite";
import { Link } from "react-router-dom";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { useGetUserPosts } from "@/lib/react-query/queriesAndMutations";
import { SkeletonGridPost } from "@/components/Shared/Loaders/SkeletonExplorePage";

type GridPostListProps = {
  posts: Models.Document[];
  showUser?: boolean;
  filter: "week" | "month" | "year";
  isLoading: boolean;
};

const GridPostList = ({
  posts,
  showUser = true,
  filter,
  isLoading,
}: GridPostListProps) => {
  const currentDate = DateTime.now();

  const isPostInFilterRange = (postDate: string) => {
    const inputDate = DateTime.fromISO(postDate);

    switch (filter) {
      case "week":
        return inputDate >= currentDate.minus({ weeks: 1 });
      case "month":
        return inputDate >= currentDate.minus({ months: 1 });
      case "year":
        return inputDate >= currentDate.minus({ years: 1 });
      default:
        return true;
    }
  };

  const filteredPosts = posts.filter((post) =>
    isPostInFilterRange(post.$createdAt)
  );

  return (
    <ul className="grid-container">
      {isLoading
        ? [...Array(8)].map((_, index) => (
            <li key={index} className="relative min-w-80 h-80">
              <SkeletonGridPost />
            </li>
          ))
        : filteredPosts.map((post) => (
            <li key={post.$id} className="relative min-w-80 h-80">
              <Link to={`/posts/${post.$id}`} className="grid-post_link">
                <img
                  src={post.imageUrl}
                  alt="post"
                  className="h-full w-full object-cover"
                />
              </Link>
              <div className="grid-post_user">
                {showUser && (
                  <PostCreator
                    creatorId={post.creator.$id}
                    creatorImage={post.creator.imageUrl}
                    creatorName={post.creator.name}
                  />
                )}
              </div>
            </li>
          ))}
    </ul>
  );
};

const PostCreator = ({
  creatorId,
  creatorImage,
  creatorName,
}: {
  creatorId: string;
  creatorImage: string;
  creatorName: string;
}) => {
  const { data: userPosts } = useGetUserPosts(creatorId);
  const [creatorPostCount, setCreatorPostCount] = useState<number | null>(null);

  useEffect(() => {
    if (userPosts) {
      setCreatorPostCount(userPosts.documents.length);
    }
  }, [userPosts]);

  const YousefID = import.meta.env.VITE_APPWRITE_YOUSEF_USER_ID;

  return (
    <div className="flex items-center justify-start gap-2 flex-1">
      <img
        src={creatorImage || "assets/icons/profile-placeholder.svg"}
        alt="creator"
        className="w-8 h-8 rounded-full object-cover"
      />
      <div className="flex items-center">
        <p className="line-clamp-1">{creatorName}</p>
        {creatorPostCount !== null &&
          creatorPostCount >= 3 &&
          creatorId !== YousefID && (
            <div className="group relative pin-icon-container">
              <img
                alt="badge"
                width={17}
                src={"/assets/icons/top-creator.png"}
                className="ml-2 object-contain pointer-events-none select-none"
                draggable="false"
              />
              <div className="tooltip-verified absolute transition-opacity duration-300 ">
                Top Creator
              </div>
            </div>
          )}
        {creatorId === YousefID && (
          <div className="group relative pin-icon-container">
            <img
              alt="badge"
              width={17}
              src={"/assets/icons/verified-badge.svg"}
              className="ml-2 object-contain pointer-events-none select-none"
              draggable="false"
            />
            <div className="tooltip-verified absolute transition-opacity duration-300 ">
              Website Creator
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GridPostList;
