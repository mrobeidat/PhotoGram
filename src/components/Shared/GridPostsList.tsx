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

  // Function to check if a post is from today
  const isPostFromToday = (postDate: string) => {
    const inputDate = new Date(postDate);
    const timeDifference = currentDate.getTime() - inputDate.getTime();
    const hoursDifference = timeDifference / (1000 * 3600);
    return hoursDifference <= 24;
  };

  // Filter posts that are from today
  const filteredPosts = posts.filter((post) =>
    isPostFromToday(post?.$createdAt)
  );
  const YousefID = import.meta.env.VITE_APPWRITE_YOUSEF_USER_ID;

  return (
    <ul className="grid-container">
      {filteredPosts.map((post) => (
        <li key={post.$id} className="relative min-w-80 h-80">
          <Link to={`/posts/${post.$id}`} className="grid-post_link">
            <img
              src={post.imageUrl || 'assets/icons/post-placeholder.svg'}
              alt="post"
              className="h-full w-full object-cover"
            />
          </Link>

          <div className="grid-post_user">
            {showUser && (
              <div className="flex items-center justify-start gap-2 flex-1">
                <img
                  src={post?.creator?.imageUrl || 'assets/icons/profile-placeholder.svg'}
                  alt="creator"
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex">
                  <p className="line-clamp-1">{post?.creator?.name}</p>
                  {post?.creator?.$id === YousefID && (
                   <div className="group relative pin-icon-container">
                   <img
                     alt="badge"
                     width={14}
                     src={"/assets/icons/verified-1.svg"}
                     className="ml-2 object-contain"
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
