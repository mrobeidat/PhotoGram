import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useUserContext } from "@/context/AuthContext";
import PostStats from "@/components/Shared/PostStats";
import { PhotoProvider, PhotoView } from "react-photo-view";
import Modal from "../../components/ui/Modal";
import { IComment } from "@/types";
import { Button } from "@/components/ui/button";
import { CommentsLoader } from "@/components/Shared/Loaders/SkeletonLoader";
import { useToast } from "@/components/ui/use-toast";
import {
  useGetCommentsByPost,
  useCreateComment,
  useDeleteComment,
} from "@/lib/react-query/queriesAndMutations";
import { formatDate } from "@/lib/utils";
import { Models } from "appwrite";
import DOMPurify from "dompurify";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

type PostCardProps = {
  post: Models.Document;
};
interface SanitizeHTMLResult {
  __html: string;
}

export const sanitizeHTML = (htmlString: string): SanitizeHTMLResult => {
  const sanitizedString = DOMPurify.sanitize(htmlString);
  return {
    __html: sanitizedString,
  };
};

const PostCard = ({ post }: PostCardProps) => {
  const { user } = useUserContext();
  const [contentType, setContentType] = useState("");
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const { toast } = useToast();
  const { data: comments, isPending: areCommentsLoading } = useGetCommentsByPost(post.$id);
  const { mutate: createComment } = useCreateComment();
  const { mutate: deleteComment } = useDeleteComment();
  const containerRef = useRef<HTMLDivElement>(null);


  if (!post.creator) return null;

  const sanitizedCaption = sanitizeHTML(post.caption).__html;
  const YousefID = import.meta.env.VITE_APPWRITE_YOUSEF_USER_ID;
  const TopCreator = import.meta.env.VITE_APPWRITE_TOP_CREATOR;
  const imageUrl = post?.imageUrl.replace("/preview", "/view");

  useEffect(() => {
    const fetchDataAndPlayVideo = async () => {
      try {
        const response = await fetch(imageUrl);

        if (response.ok) {
          const contentTypeHeader = response.headers.get("Content-Type");
          setContentType(contentTypeHeader || "");

          if (contentTypeHeader && contentTypeHeader.startsWith("video")) {
            const videoElement = document.getElementById(
              `video-${post.$id}`
            ) as HTMLVideoElement | null;

            if (videoElement) {
              const handleIntersection = (
                entries: IntersectionObserverEntry[]
              ) => {
                const [entry] = entries;
                if (entry.isIntersecting) {
                  if (!isVideoPlaying) {
                    setIsVideoPlaying(true);
                    videoElement.play();
                  }
                } else {
                  if (isVideoPlaying) {
                    setIsVideoPlaying(false);
                    videoElement.pause();
                  }
                }
              };

              const options = {
                root: null,
                rootMargin: "0px",
                threshold: 0.5,
              };

              const observer = new IntersectionObserver(
                handleIntersection,
                options
              );
              observer.observe(videoElement);

              return () => {
                observer.disconnect();
              };
            } else {
              console.error(
                `Video element with ID 'video-${post.$id}' not found.`
              );
            }
          }
        } else {
          console.error("Failed to fetch image");
        }
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };

    fetchDataAndPlayVideo();
  }, [imageUrl, post.$id, isVideoPlaying]);

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const handleCreateComment = () => {
    const commentData = {
      postId: post.$id,
      userId: user.id,
      text: commentText,
    };

    createComment(commentData, {
      onSuccess: () => {
        setCommentText("");
      },
    });
  };

  const handleDeleteComment = (commentId: string) => {
    deleteComment(commentId, {
      onSuccess: () => {
        toast({
          title: "Your comment deleted successfully!",
          style: { background: "rgb(3, 73, 26)" },
        });
      },
    });
  };

  const [isFullContent, setIsFullContent] = useState(false);
  const [isSeeMoreClicked, setIsSeeMoreClicked] = useState(false);

  const handleSeeMoreClick = () => {
    setIsSeeMoreClicked(true);
    setIsFullContent(true);
  };

  const handleSeeLessClick = () => {
    setIsSeeMoreClicked(false);
    setIsFullContent(false);
  };

  return (
    <div
      className={`${post.$id === import.meta.env.VITE_APPWRITE_POST_ID
        ? "post-card-pinned"
        : "post-card"
        }`}
    >
      <Link to={`/posts/${post.$id}`}>
        <div className="flex-between">
          <div className="flex items-center gap-3">
            <Link to={`/profile/${post.creator.$id}`}>
              <img
                src={
                  post?.creator?.imageUrl ||
                  "assets/icons/profile-placeholder.svg"
                }
                alt="avatar"
                className="w-12 h-12 lg:h-12 rounded-full object-cover"
              />
            </Link>
            <div className="flex flex-col">
              <div className="flex items-center">
                <Link to={`/profile/${post.creator.$id}`}>
                  <p className="base-medium lg:body-bold text-light-1">
                    {post.creator.name}
                  </p>
                </Link>
                {post.creator.$id === TopCreator && (
                  <div className="group relative pin-icon-container">
                    <img
                      alt="badge"
                      width={17}
                      src={"/assets/icons/top-creator.png"}
                      className="ml-2 object-contain pointer-events-none select-none"
                      draggable="false"
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
              <div className="flex-center gap-1 text-light-3">
                <p className="subtle-semibold lg:small-regular">
                  {formatDate(post.$createdAt)}
                </p>
                •
                <p className="subtle-semibold lg:small-regular">
                  {post.location}
                </p>
                <span>{post.updated ? "•" : ""}</span>
                <p className="subtle-semibold lg:small-regular">
                  {post.updated == true ? "(Edited)" : ""}
                </p>
              </div>
            </div>
          </div>
          {post.$id === import.meta.env.VITE_APPWRITE_POST_ID ? (
            <Link to={""}>
              <div className="pin-icon cursor-default">
                <img
                  src="assets/icons/post-pin.png"
                  alt="pin"
                  width={35}
                  height={20}
                  className="resize-none pointer-events-none select-none"
                />
                <span className="tooltip ">📌 Pinned Post</span>
              </div>
            </Link>
          ) : (
            <Link
              className={`${user.id !== post.creator.$id && "hidden"}`}
              to={`/update-post/${post.$id}`}
            >
              <img
                src="assets/icons/edit.svg"
                alt="edit"
                width={20}
                height={50}
              />
            </Link>
          )}
        </div>
      </Link>

      <div className="small-medium lg:base-medium py-5">
        <a onClick={!isFullContent ? handleSeeMoreClick : handleSeeLessClick}>
          <p
            className={`${isFullContent ? "max-h-full" : "max-h-36"
              } transition-max-height ${isSeeMoreClicked ? "smooth-transition" : ""
              }`}
            dangerouslySetInnerHTML={{
              __html: isFullContent
                ? sanitizedCaption
                : sanitizedCaption.substring(0, 550) +
                (sanitizedCaption.length > 550 ? "..." : ""),
            }}
            style={{ fontSize: "14px", fontWeight: "100" }}
          />
          {sanitizedCaption.length > 500 && (
            <div>
              {!isFullContent ? (
                <a
                  onClick={handleSeeMoreClick}
                  className="text-neutral-500 hover:text-blue-500 text-sm underline focus:outline-none transition-transform transform active:scale-95 cursor-pointer"
                >
                  ...see more
                </a>
              ) : (
                <a
                  onClick={handleSeeLessClick}
                  className="text-neutral-500 hover:text-blue-500 text-sm underline focus:outline-none transition-transform transform active:scale-95 cursor-pointer"
                >
                  ...see less
                </a>
              )}
            </div>
          )}
        </a>

        <ul className="flex gap-1 mt-2">
          {post.tags.map((tag: string, index: number) => (
            <li key={`${tag}${index}`} className="text-light-3 small-regular">
              #{tag}
            </li>
          ))}
        </ul>
      </div>

      <PhotoProvider
        speed={() => 450}
        easing={(type) =>
          type === 2
            ? "cubic-bezier(0.36, 0, 0.66, -0.56)"
            : "cubic-bezier(0.34, 1.56, 0.64, 1)"
        }
        bannerVisible={false}
        maskOpacity={0.8}
      >
        {contentType.startsWith("image/") ? (
          <Link to={`/posts/${post.$id}`}>
            <PhotoView src={post?.imageUrl}>
              <img
                src={post.imageUrl}
                alt="Image"
                className="post-card_img hover:cursor-pointer"
              />
            </PhotoView>
          </Link>
        ) : (
          <div style={{ position: "relative", borderRadius: "25px" }}>
            {imageUrl && (
              <div
                className="post_details-img object-cover !w-full !h-auto !p-0"
                style={{ position: "relative", borderRadius: "10px" }}
              >
                <video
                  id={`video-${post?.$id}`}
                  autoPlay={isVideoPlaying}
                  loop
                  controls={true}
                  className="post-card_img"
                  style={{
                    width: "100%",
                    borderRadius: "10px",
                    boxShadow: "rgba(17, 67, 98, 0.841) 0px 20px 30px -10px",
                  }}
                >
                  <source src={imageUrl} type="video/mp4" />
                </video>
                <div
                  style={{
                    position: "absolute",
                    bottom: "5px",
                    right: "10px",
                    cursor: "pointer",
                  }}
                >
                </div>
              </div>
            )}
          </div>
        )}
      </PhotoProvider>

      <PostStats post={post} userId={user.id} commentsCount={comments?.documents.length || 0} onToggleComments={toggleComments} />

      {showComments && (
        <Modal containerRef={containerRef} isOpen={showComments} onClose={toggleComments}>
          <h3 className="body-bold md:h3-bold mb-8">Comments</h3>
          <div className="max-h-60 overflow-y-auto space-y-2 scrollbar-thin">
            {areCommentsLoading ? (
              <CommentsLoader />
            ) : (
              (comments?.documents?.length ?? 0) > 0 ? (
                comments?.documents.map((comment: IComment) => (
                  <div
                    key={comment.$id}
                    className="comment p-2 rounded-lg flex justify-between items-start animate-slideIn"
                  >
                    <div className="flex items-start gap-2">
                      <Link to={`/profile/${comment.userId}`}>
                        <img
                          src={comment.user?.imageUrl || "/assets/icons/profile-placeholder.svg"}
                          alt="user"
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      </Link>
                      <div>
                        <Link to={`/profile/${comment.userId}`} className="text-light-1 text-sm font-semibold hover:underline">
                          {comment.user?.name ?? 'Unknown User'}
                        </Link>
                        <p className="text-light-1 text-sm">{comment.text}</p>
                      </div>
                    </div>
                    {user.id === comment.userId && (
                      <Button
                        onClick={() => handleDeleteComment(comment.$id)}
                        variant="ghost"
                        className="shad-button_ghost cursor-pointer hover:scale-108 transition duration-300"
                      >
                        <img src={"/assets/icons/delete.svg"} alt="delete" width={16} height={16} />
                      </Button>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-light-3 text-center p-5">No comments yet. Be the first to comment!</p>
              )
            )}
          </div>
          <div className="flex gap-3 items-center">
            <textarea
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleCreateComment();
                }
              }}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 p-2 border border-dark-4 rounded-xl bg-dark-1 text-light-1 placeholder-light-4 focus:outline-none focus:border-transparent resize-none transition duration-300 focus:shadow-theme-top"
              style={{ height: '40px', overflow: 'hidden' }}
            />
            <Button
              onClick={handleCreateComment}
              className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-3 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-1 focus:ring-primary-500"
              disabled={!commentText.trim()}
            >
              <ArrowForwardIcon />
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PostCard;
