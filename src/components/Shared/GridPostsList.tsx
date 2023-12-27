import { Models } from "appwrite";
import { Link } from "react-router-dom";
import PostStats from "@/components/Shared/PostStats";
import { useUserContext } from "@/context/AuthContext";

type GridPostListProps = {
  posts: Models.Document[];
  showUser?: boolean;
  showStats?: boolean;
};

const GridPostList = ({
  posts,
  showUser = true,
  showStats = true,
}: GridPostListProps) => {
  const { user } = useUserContext();
  // Get the current date and time
  const currentDate = new Date();

  // Function to check if a post is from the current week
  const isPostFromCurrentWeek = (postDate: string) => {
    const inputDate = new Date(postDate);

    // Calculate the difference in days
    const timeDifference = currentDate.getTime() - inputDate.getTime();
    const daysDifference = timeDifference / (1000 * 3600 * 24);

    // Check if the post is from the current week (within the last 7 days)
    return daysDifference <= 7;
  };

  // Filter posts that are from the current week
  const filteredPosts = posts.filter((post) =>
    isPostFromCurrentWeek(post?.$createdAt)
  );

  const YousefID = import.meta.env.VITE_APPWRITE_YOUSEF_USER_ID;

  // replace default appwrite video thumbnail with a custom one
  const VideoThumbnail = import.meta.env.VITE_APPWRITE_VIDEO_THUMBNAIL
  const UpdatedThumbnail = import.meta.env.VITE_APPWRITE_VIDEO_THUMBNAIL_UPDATED

  const getDefaultThumbnail = (imageUrl: string) => {
    return imageUrl === VideoThumbnail ? UpdatedThumbnail : VideoThumbnail;
  };

  return (
    <ul className="grid-container">
      {filteredPosts.map((post) => (
        <li key={post.$id} className="relative min-w-80 h-80">
          <Link to={`/posts/${post.$id}`} className="grid-post_link">
            {VideoThumbnail && post.imageUrl === VideoThumbnail ? (
              <img
                src={getDefaultThumbnail(post.imageUrl)}
                className="h-full w-full object-cover"
              />
            ) : (
              <img
                src={post.imageUrl || VideoThumbnail}
                alt="post"
                className="h-full w-full object-cover"
              />
            )}
          </Link>

          <div className="grid-post_user">
            {showUser && (
              <div className="flex items-center justify-start gap-2 flex-1">
                <img
                  src={post?.creator?.imageUrl || 'assets/icons/profile-placeholder.svg'}
                  alt="creator"
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex items-center">
                  <p className="line-clamp-1">{post?.creator?.name}</p>
                  {post?.creator?.$id === YousefID && (
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
            )}
            {showStats && <PostStats post={post} userId={user.id} />}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default GridPostList;
