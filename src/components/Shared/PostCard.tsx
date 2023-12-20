import { useUserContext } from "@/context/AuthContext"
import { formatDate } from "@/lib/utils"
import { Models } from "appwrite"
import { Link } from "react-router-dom"
import PostStats from "./PostStats"
// import DOMPurify from 'dompurify';

type PostCardProps = {
  post: Models.Document
}

// To detect links in post cards
export const detectAndRenderLinks = (text: string) => {
  const linkRegex = /(https?:\/\/[^\s]+)/g;

  const parts = text.split(linkRegex);

  return parts.map((part, index) => {
    if (part.match(linkRegex)) {
      return (
        <a className="cursor-text" key={index} href={part} target="_blank" rel="noopener noreferrer">
          {part}
        </a>
      );
    } else {
      return <span key={index}>{part}</span>;
    }
  });
};


const PostCard = ({ post }: PostCardProps) => {
  const { user } = useUserContext()
  if (!post.creator) return;

  // Function to sanitize HTML content
  // const sanitizeHTML = (htmlString: string) => ({
  //   __html: DOMPurify.sanitize(htmlString),
  // });
  const YousefID = import.meta.env.VITE_APPWRITE_YOUSEF_USER_ID;
  const TopCreator = import.meta.env.VITE_APPWRITE_TOP_CREATOR
  return (
    <div className={`${post.$id === import.meta.env.VITE_APPWRITE_POST_ID ? "post-card-pinned" : "post-card"}`}>
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.creator.$id}`}>
            <img
              src={post?.creator?.imageUrl || 'assets/icons/profile-placeholder.svg'}
              alt="avatar"
              className="w-12 h-12 lg:h-12 rounded-full object-cover"
            />
          </Link>
          <div className="flex flex-col">
            <div className="flex items-center">
              <Link to={`/profile/${post.creator.$id}`}>
                <p className="base-medium lg:body-bold text-light-1">{post.creator.name}</p>
              </Link>
              {post.creator.$id === TopCreator && (
                <div className="group relative pin-icon-container">
                  <img
                    alt="badge"
                    width={17}
                    src={"/assets/icons/top-creator.png"}
                    className="ml-2 object-contain"
                  />
                  <div className="tooltip-verified-creator absolute transition-opacity duration-300 ">
                    Top Creator
                  </div>
                </div>
              )}
              {post.creator.$id === YousefID && (
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
            <div className="flex-center gap-2 text-light-3">
              <p className="subtle-semibold lg:small-regular">{formatDate(post.$createdAt)}</p>
              -
              <p className="subtle-semibold lg:small-regular">{post.location}</p>
            </div>
          </div>
        </div>
        {post.$id === import.meta.env.VITE_APPWRITE_POST_ID ? (
          <div className="pin-icon">
            <img
              src="assets/icons/post-pin.png"
              alt="pin"
              width={35}
              height={20}
              className="resize-none pointer-events-none select-none"
            />
            <span className="tooltip">📌 Pinned Post</span>
          </div>
        ) : (
          <Link className={`${user.id !== post.creator.$id && "hidden"}`} to={`/update-post/${post.$id}`}>
            <img src="assets/icons/edit.svg" alt="edit" width={20} height={50} />
          </Link>
        )}
      </div>
      <Link to={`/posts/${post.$id}`}>
        <div className="small-medium lg:base-medium py-5">
          <p className="cursor-text" style={{ fontSize: "14px", fontWeight: "100" }}>{detectAndRenderLinks(post.caption)}</p>
          <ul className="flex gap-1 mt-2">
            {post.tags.map((tag: string, index: string) => (
              <li key={`${tag}${index}`} className="text-light-3 small-regular">
                #{tag}
              </li>
            ))}
          </ul>
        </div>

        <img
          src={post.imageUrl || "/assets/icons/profile-placeholder.svg"}
          alt="post image"
          className="post-card_img"
        />
      </Link>
      <PostStats post={post} userId={user.id} />
    </div>
  );

}

export default PostCard
