import { useUserContext } from "@/context/AuthContext"
import { formatDate } from "@/lib/utils"
import { Models } from "appwrite"
import { Link } from "react-router-dom"
import PostStats from "./PostStats"
import DOMPurify from 'dompurify';

type PostCardProps = {
  post: Models.Document
}

const PostCard = ({ post }: PostCardProps) => {
  const { user } = useUserContext()
  if (!post.creator) return;


  // Function to sanitize HTML content
  const sanitizeHTML = (htmlString: string) => ({
    __html: DOMPurify.sanitize(htmlString),
  });
  return (
    <div className={`${post.$id === import.meta.env.VITE_APPWRITE_POST_ID ? "post-card-pinned" : "post-card"}`}>
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.creator.$id}`}>
            <img
              src={post?.creator?.imageUrl || 'assets/icons/profile-placeholder.svg'}
              alt="avatar"
              className="w-12 lg:h-12 rounded-full"
            />
          </Link>
          <div className="flex flex-col">
            <p className="base-medium lg:body-bold text-light-1">{post.creator.name}</p>
            <div className="flex-center gap-2 text-light-3">
              <p className="subtle-semibold lg:small-regular">{formatDate(post.$createdAt)}</p>
              -
              <p className="subtle-semibold lg:small-regular">{post.location}</p>
            </div>
          </div>
        </div>
        {post.$id === import.meta.env.VITE_APPWRITE_POST_ID ? (
          <div className="pin-icon-container">
            <img
              src="assets/icons/pin.png"
              alt="pin"
              width={40}
              height={20}
            />
            <span className="tooltip">Pinned Post</span>
          </div>
        ) : (
          <Link className={`${user.id !== post.creator.$id && "hidden"}`} to={`/update-post/${post.$id}`}>
            <img src="assets/icons/edit.svg" alt="edit" width={20} height={50} />
          </Link>
        )}
      </div>
      <Link to={`/posts/${post.$id}`}>
        <div className="small-medium lg:base-medium py-5">
          {/* Render the sanitized SunEditor content */}
          <div dangerouslySetInnerHTML={sanitizeHTML(post.caption || '')} />
        </div>
        <img
          src={post.imageUrl || 'assets/icons/post-placeholder.svg'}
          alt="post image"
          className="post-card_img"
        />
      </Link>
      <PostStats post={post} userId={user.id} />
    </div>
  );

}

export default PostCard