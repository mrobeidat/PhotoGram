import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useUserContext } from "@/context/AuthContext";
import PostStats from "@/components/Shared/PostStats";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { CommentsLoader } from "@/components/Shared/Loaders/CommentsLoader";
import { useToast } from "@/components/ui/use-toast";
import {
  useGetCommentsByPost,
  useCreateComment,
  useDeleteComment,
  useGetUserPosts,
} from "@/lib/react-query/queriesAndMutations";
import { formatDate, formatDateShort } from "@/lib/utils";
import { Models } from "appwrite";
import DOMPurify from "dompurify";
import Modal from "../ui/deleteCommentConfirmationModal";

type PostCardProps = {
  post: Models.Document;
};

interface SanitizeHTMLResult {
  __html: string;
}

const sanitizeHTML = (htmlString: string): SanitizeHTMLResult => ({
  __html: DOMPurify.sanitize(htmlString),
});

const PostCard = ({ post }: PostCardProps) => {
  const { user } = useUserContext();
  const [contentType, setContentType] = useState("");
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [isFullContent, setIsFullContent] = useState(false);
  const { toast } = useToast();
  const { data: comments, isPending: areCommentsLoading } =
    useGetCommentsByPost(post.$id);
  const { mutate: createComment } = useCreateComment();
  const { mutate: deleteComment } = useDeleteComment();
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: userPosts } = useGetUserPosts(post.creator.$id);
  const [creatorPostCount, setCreatorPostCount] = useState<number | null>(null);

  const YousefID = import.meta.env.VITE_APPWRITE_YOUSEF_USER_ID;
  const TopCreator = import.meta.env.VITE_APPWRITE_TOP_CREATOR;
  const imageUrl = post?.imageUrl.replace("/preview", "/view");

  useEffect(() => {
    if (userPosts) {
      setCreatorPostCount(userPosts.documents.length);
    }
  }, [userPosts]);

  useEffect(() => {
    const handleVideoPlay = async () => {
      try {
        const response = await fetch(imageUrl);
        if (response.ok) {
          const contentTypeHeader = response.headers.get("Content-Type");
          setContentType(contentTypeHeader || "");

          if (contentTypeHeader?.startsWith("video")) {
            const videoElement = document.getElementById(
              `video-${post.$id}`
            ) as HTMLVideoElement | null;
            if (videoElement) {
              const observer = new IntersectionObserver(
                ([entry]) => {
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
                },
                { root: null, rootMargin: "0px", threshold: 0.5 }
              );
              observer.observe(videoElement);
              return () => observer.disconnect();
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
    handleVideoPlay();
  }, [imageUrl, post.$id, isVideoPlaying]);

  const toggleComments = () => setShowComments(!showComments);

  const handleCreateComment = () => {
    createComment(
      { postId: post.$id, userId: user.id, text: commentText },
      { onSuccess: () => setCommentText("") }
    );
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

  if (!post.creator) return null;

  const sanitizedCaption = sanitizeHTML(post.caption).__html;

  return (
    <div
      className={
        post.$id === import.meta.env.VITE_APPWRITE_POST_ID
          ? "post-card-pinned"
          : "post-card"
      }
    >
      <Link to={`/posts/${post.$id}`}>
        <div className="flex justify-between">
          <div className="flex items-center gap-3">
            <Link to={`/profile/${post.creator.$id}`}>
              <img
                src={
                  post.creator.imageUrl ||
                  "assets/icons/profile-placeholder.svg"
                }
                alt="avatar"
                className="w-12 h-12 lg:w-12 rounded-full object-cover"
              />
            </Link>
            <div className="flex flex-col">
              <div className="flex items-center">
                <Link to={`/profile/${post.creator.$id}`}>
                  <p className="base-medium lg:body-bold text-light-1">
                    {post.creator.name}
                  </p>
                </Link>
                {creatorPostCount !== null &&
                  creatorPostCount >= 3 &&
                  post.creator.$id !== YousefID && (
                    <div className="group relative pin-icon-container">
                      <img
                        alt="badge"
                        width={17}
                        src={"/assets/icons/top-creator.png"}
                        className="ml-2 object-contain pointer-events-none select-none"
                        draggable="false"
                      />
                      <div className="tooltip-verified-creator absolute transition-opacity duration-300">
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
                    <div className="tooltip-verified absolute transition-opacity duration-300">
                      Website Creator
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1 text-light-3">
                <p className="subtle-semibold lg:small-regular">
                  {formatDate(post.$createdAt)}
                </p>
                •
                <p className="subtle-semibold lg:small-regular">
                  {post.location}
                </p>
                {post.updated && (
                  <p className="subtle-semibold lg:small-regular">• (Edited)</p>
                )}
              </div>
            </div>
          </div>
          {post.$id === import.meta.env.VITE_APPWRITE_POST_ID ? (
              <div className="pin-icon cursor-default mt-2">
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
            user.id === post.creator.$id && (
              <Link to={`/update-post/${post.$id}`}>
                <img
                  src="assets/icons/edit.svg"
                  alt="edit"
                  width={20}
                  height={50}
                />
              </Link>
            )
          )}
        </div>
      </Link>

      <div className="small-medium lg:base-medium py-5">
        <p
          onClick={() => setIsFullContent(!isFullContent)}
          className={`transition-max-height ${
            isFullContent ? "max-h-full" : "max-h-36"
          } cursor-default`}
          dangerouslySetInnerHTML={{
            __html: isFullContent
              ? sanitizedCaption
              : `${sanitizedCaption.substring(0, 500)}${
                  sanitizedCaption.length > 500
                    ? '... <span class="text-slate-500 hover:text-blue-500 text-sm underline cursor-pointer">see more</span>'
                    : ""
                }`,
          }}
        />
        {isFullContent && sanitizedCaption.length > 500 && (
          <a
            onClick={() => setIsFullContent(false)}
            className="text-neutral-500 hover:text-blue-500 text-sm underline focus:outline-none transition-transform transform active:scale-95 cursor-pointer"
          >
            ...see less
          </a>
        )}
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
                className="post-card_img hover:cursor-pointer rounded-md shadow-lg"
              />
            </PhotoView>
          </Link>
        ) : (
          imageUrl && (
            <video
              id={`video-${post.$id}`}
              autoPlay={isVideoPlaying}
              loop
              controls={true}
              className="post-card_img rounded-md shadow-lg"
            >
              <source src={imageUrl} type="video/mp4" />
            </video>
          )
        )}
      </PhotoProvider>

      <PostStats
        post={post}
        userId={user.id}
        commentsCount={comments?.documents.length || 0}
        onToggleComments={toggleComments}
      />
      {showComments && (
        <Modal
          isOpen={showComments}
          onClose={toggleComments}
          containerRef={containerRef}
          title="Comments"
          commentsLoading={areCommentsLoading}
          comments={comments?.documents || []}
          handleCreateComment={handleCreateComment}
          handleDeleteComment={handleDeleteComment}
          commentText={commentText}
          setCommentText={setCommentText}
          user={user}
          TopCreator={TopCreator}
          YousefID={YousefID}
          formatDateShort={formatDateShort}
          CommentsLoader={CommentsLoader}
        />
      )}
    </div>
  );
};

export default PostCard;
