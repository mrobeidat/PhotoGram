import PostStats from "@/components/Shared/PostStats";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/AuthContext";
import {
  useGetPostById,
  useDeletePost,
  useGetUserPosts,
  useCreateComment,
  useGetCommentsByPost,
  useDeleteComment,
} from "@/lib/react-query/queriesAndMutations";
import { formatDate, formatDateShort } from "@/lib/utils";
import { Link, useNavigate, useParams } from "react-router-dom";
import DetailsLoader from "../../components/Shared/Loaders/DetailsLoader";
import Loader from "@/components/Shared/Loader";
import RelatedPosts from "@/components/Shared/RelatedPosts";
import DOMPurify from "dompurify";
import "react-photo-view/dist/react-photo-view.css";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { useEffect, useRef, useState } from "react";
import { isAndroid, isWindows, isMacOs, isIOS } from "react-device-detect";
import { CommentValidation } from "@/lib/validation";
import { useToast } from "@/components/ui/use-toast";
import { CommentsLoader } from "@/components/Shared/Loaders/CommentsLoader";
import DeleteCommentConfirmationModal from "@/components/ui/DeleteCommentConfirmationModal";
import DeletePostConfirmationModal from "@/components/ui/DeletePostConfirmationModal";

interface SanitizeHTMLResult {
  __html: string;
}

export const sanitizeHTML = (htmlString: string): SanitizeHTMLResult => {
  const sanitizedString = DOMPurify.sanitize(htmlString);
  return {
    __html: sanitizedString,
  };
};

const PostDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUserContext();
  const { toast } = useToast();
  const { data: post, isPending } = useGetPostById(id || "");
  const { data: userPosts, isPending: isUserPostLoading } = useGetUserPosts(
    post?.creator.$id
  );
  const { mutate: deletePost } = useDeletePost();
  const { mutate: deleteComment } = useDeleteComment();
  const relatedPosts = userPosts?.documents.filter(
    (userPost) => userPost.$id !== id
  );
  const sanitizedCaption = sanitizeHTML(post?.caption).__html;
  const containerRef = useRef<HTMLDivElement>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [contentType, setContentType] = useState("");
  const imageUrl = post?.imageUrl.replace("/preview", "/view");
  const [isVideoLoading, setIsVideoLoading] = useState(true);

  const { checkAuthUser } = useUserContext();

  useEffect(() => {
    const verifyAuth = async () => {
      const isValid = await checkAuthUser();
      if (!isValid) {
        navigate("/sign-in");
      }
    };

    verifyAuth();
  }, [checkAuthUser, navigate]);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(imageUrl);

        if (response.ok) {
          const contentTypeHeader = response.headers.get("Content-Type");
          setContentType(contentTypeHeader || "");
        } else {
          console.error("Failed to fetch image");
        }
      } catch (error) {
        console.error("Error fetching image:", error);
      } finally {
        setIsVideoLoading(false);
      }
    };

    fetchImage();
  }, [imageUrl]);

  const [isMuted, setIsMuted] = useState(false);
  const handleTap = () => {
    const videoElement = document.getElementById("video") as HTMLVideoElement;
    const ShowingOn = isAndroid || isWindows || isMacOs;

    videoElement.muted = ShowingOn ? !isMuted : false;
    setIsMuted(ShowingOn ? !isMuted : false);
  };

  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);

  const { mutate: createComment } = useCreateComment();
  const { data: comments, isPending: areCommentsLoading } =
    useGetCommentsByPost(id || "");

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

  const handleCreateComment = () => {
    const commentData = {
      postId: id || "",
      userId: user.id,
      text: commentText,
    };

    const result = CommentValidation.safeParse(commentData);
    if (!result.success) {
      console.log(result.error.errors);
      return;
    }

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

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const handleDeletePost = () => {
    if (user.id === post?.creator.$id) {
      setShowDeleteModal(true);
    } else {
      toast({
        title: "You are not authorized to delete this post.",
        style: { background: "rgb(255, 0, 0)" },
      });
    }
  };

  const confirmDeletePost = async () => {
    if (user.id === post?.creator.$id) {
      deletePost({ postId: id, imageId: post?.imageId });
      setShowDeleteModal(false);
      navigate(-1);
    } else {
      toast({
        title: "You are not authorized to delete this post.",
        style: { background: "rgb(255, 0, 0)" },
      });
    }
  };

  const cancelDeletePost = () => {
    setShowDeleteModal(false);
  };

  const YousefID = import.meta.env.VITE_APPWRITE_YOUSEF_USER_ID;
  const TopCreator = import.meta.env.VITE_APPWRITE_TOP_CREATOR;

  return (
    <div className="post_details-container">
      <div className="hidden md:flex max-w-5xl w-full">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="shad-button_ghost"
        >
          <img
            src={"/assets/icons/back.svg"}
            alt="back"
            width={24}
            height={24}
          />
          <p className="small-medium lg:base-medium">Back</p>
        </Button>
      </div>

      {isPending || !post ? (
        <Loader />
      ) : (
        <div className="post_details-card">
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
              <PhotoView src={post?.imageUrl}>
                <img
                  src={post.imageUrl}
                  alt="Image"
                  className="post_details-img h-auto xl:min-h-full object-cover hover:cursor-pointer"
                />
              </PhotoView>
            ) : (
              <div
                className="post_details-img object-cover !p-0"
                style={{ position: "relative", borderRadius: "10px" }}
              >
                {isVideoLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <Loader />
                  </div>
                ) : (
                  <video
                    className={`post_details-img !w-full !p-5`}
                    id="video"
                    onClick={handleTap}
                    autoPlay
                    controls={isIOS ? true : false}
                    loop
                    controlsList="nodownload noremoteplayback"
                  >
                    <source src={imageUrl} type="video/mp4" />
                  </video>
                )}
                <div
                  style={{
                    position: "absolute",
                    bottom: "30px",
                    right: "30px",
                    cursor: "pointer",
                  }}
                  onClick={handleTap}
                >
                  {isAndroid || isWindows || isMacOs ? (
                    isMuted ? (
                      <img
                        height={21}
                        width={21}
                        src="/assets/icons/mute.png"
                        alt="Mute"
                      />
                    ) : (
                      <img
                        height={22}
                        width={22}
                        src="/assets/icons/volume.png"
                        alt="Unmute"
                      />
                    )
                  ) : null}
                </div>
              </div>
            )}
          </PhotoProvider>
          <div className="post_details-info">
            <div className="flex-between w-full">
              <Link
                to={`/profile/${post?.creator.$id}`}
                className="flex items-center gap-3"
              >
                <img
                  src={
                    post?.creator.imageUrl ||
                    "/assets/icons/profile-placeholder.svg"
                  }
                  alt="creator"
                  className="w-8 h-8 lg:w-12 lg:h-12 rounded-full object-cover"
                />
                <div className="flex gap-1 flex-col">
                  <div className="flex items-center">
                    <p className="base-medium lg:body-bold text-light-1">
                      {post?.creator.name}
                    </p>
                    {post.creator.$id === TopCreator && (
                      <div className="group relative pin-icon-container">
                        <img
                          alt="badge"
                          width={15}
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
                  <div className="flex-center gap-1 mr-3 text-light-3">
                    <p className="subtle-semibold lg:small-regular ">
                      {formatDate(post?.$createdAt)}
                    </p>
                    •
                    <p className="subtle-semibold lg:small-regular">
                      {post?.location}
                    </p>
                    <span>{post.updated ? "•" : ""}</span>
                    <p className="subtle-semibold lg:small-regular">
                      {post.updated == true ? "(Edited)" : ""}
                    </p>
                  </div>
                </div>
              </Link>

              <div className="flex-center gap-2">
                <Link
                  to={`/update-post/${post?.$id}`}
                  className={`${user.id !== post?.creator.$id && "hidden"}`}
                >
                  <img
                    src={"/assets/icons/edit.svg"}
                    alt="edit"
                    width={22}
                    height={24}
                    className="select-none pointer-events-none"
                  />
                </Link>

                {user.id === post?.creator.$id && (
                  <Button
                    onClick={handleDeletePost}
                    variant="ghost"
                    className="post_details-delete_btn"
                  >
                    <img
                      src={"/assets/icons/delete.svg"}
                      alt="delete"
                      width={24}
                      height={24}
                      className="select-none pointer-events-none"
                    />
                  </Button>
                )}
              </div>
            </div>

            <hr className="border w-full border-dark-4/80" />

            <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
              {/* Render caption as readonly */}
              <p
                onClick={
                  !isFullContent ? handleSeeMoreClick : handleSeeLessClick
                }
                className={`${
                  isFullContent ? "max-h-full" : "max-h-36"
                } transition-max-height ${
                  isSeeMoreClicked ? "smooth-transition" : ""
                } cursor-default`}
                dangerouslySetInnerHTML={{
                  __html: isFullContent
                    ? sanitizedCaption
                    : sanitizedCaption.substring(0, 500) +
                      (sanitizedCaption.length > 500
                        ? '... <span class="text-slate-500 hover:text-blue-500 text-sm underline cursor-pointer">see more</span>'
                        : ""),
                }}
                style={{ fontSize: "14px", fontWeight: "100" }}
              />
              {isFullContent && sanitizedCaption.length > 500 && (
                <a
                  onClick={handleSeeLessClick}
                  className="text-neutral-500 hover:text-blue-500 text-sm underline focus:outline-none transition-transform transform active:scale-95 cursor-pointer"
                >
                  ...see less
                </a>
              )}
              <ul className="flex gap-1 mt-2">
                {post?.tags.map((tag: string, index: string) => (
                  <li
                    key={`${tag}${index}`}
                    className="text-light-3 small-regular"
                  >
                    #{tag}
                  </li>
                ))}
              </ul>
            </div>

            <DeleteCommentConfirmationModal
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

            <div className="w-full mt-4">
              <PostStats
                post={post}
                userId={user.id}
                commentsCount={comments?.documents.length || 0}
                onToggleComments={toggleComments}
              />
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-5xl">
        <hr className="border w-full border-dark-4/80" />

        <h3 className="body-bold md:h3-bold w-full my-10">
          More Related Posts
        </h3>
        {isUserPostLoading || !relatedPosts ? (
          <div className="details-loader-wrapper sm:flex gap-3">
            <DetailsLoader />
          </div>
        ) : (
          <RelatedPosts posts={relatedPosts} />
        )}
      </div>

      <DeletePostConfirmationModal
        isOpen={showDeleteModal}
        onClose={cancelDeletePost}
        onConfirm={confirmDeletePost}
        containerRef={containerRef}
      />
    </div>
  );
};

export default PostDetails;
