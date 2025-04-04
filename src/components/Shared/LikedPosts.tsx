import { Models } from "appwrite";
import { Link } from "react-router-dom";
// import PostStats from "@/components/Shared/PostStats";
// import { useUserContext } from "@/context/AuthContext";

type LikedPostsListProps = {
  posts: Models.Document[];
  showUser?: boolean;
  showStats?: boolean;
};

const LikedPostsList = ({
  posts,
  showUser = true,
  // showStats = true,
}: LikedPostsListProps) => {
  // const { user } = useUserContext();
  const YousefID = import.meta.env.VITE_APPWRITE_YOUSEF_USER_ID;
  const TopCreator = import.meta.env.VITE_APPWRITE_TOP_CREATOR;

  // replace default appwrite video thumbnail with a custom one
  const VideoThumbnail =
    "https://cloud.appwrite.io/v1/storage/buckets/654b5f03e5c16593a1c9/files/658d1017b00d237c1ce8/preview?width=2000&height=2000&gravity=top&quality=100&project=65462bfc24ded86416d2";

  return (
    <ul className="grid-container">
      {posts.map((post) => (
        <li key={post.$id} className="relative min-w-80 h-80">
          <Link to={`/posts/${post.$id}`} className="grid-post_link">
            {post.imageUrl === VideoThumbnail ? (
              <img
                src="/assets/icons/v_thumb.jpg"
                className="h-full w-full object-cover"
              />
            ) : (
              <img
                src={post.imageUrl || "assets/icons/post-placeholder.svg"}
                alt="post"
                className="h-full w-full object-cover"
              />
            )}
          </Link>

          <div className="grid-post_user">
            {showUser && (
              <div className="flex items-center justify-start gap-2 flex-1">
                <img
                  src={
                    post?.creator?.imageUrl ||
                    "assets/icons/profile-placeholder.svg"
                  }
                  alt="creator"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex items-center">
                  <p className="line-clamp-1">{post?.creator?.name}</p>
                  {post.creator.$id === TopCreator && (
                    <div className="group relative pin-icon-container">
                      <img
                        alt="badge"
                        width={15}
                        src={"/assets/icons/top-creator.png"}
                        className="ml-2 object-contain pointer-events-none select-none"
                      />
                      <div className="tooltip-verified-creator absolute transition-opacity duration-300 ">
                        Top Creator
                      </div>
                    </div>
                  )}
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
                        Photogram Developer
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            {/* {showStats && <PostStats post={post} userId={user.id} />} */}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default LikedPostsList;
