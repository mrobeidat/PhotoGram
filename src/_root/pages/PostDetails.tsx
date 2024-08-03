import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useUserContext } from "@/context/AuthContext";
import PostStats from "@/components/Shared/PostStats";
import RelatedPosts from "@/components/Shared/RelatedPosts";
import Loader from "@/components/Shared/Loader";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import CommentsModal from "@/components/Shared/Comments/CommentsModal";
import DeletePostConfirmationModal from "@/components/ui/deletePostConfirmationModal";
import {
  useGetPostById,
  useDeletePost,
  useGetUserPosts,
  useCreateComment,
  useGetCommentsByPost,
  useDeleteComment,
} from "@/lib/react-query/queriesAndMutations";
import { formatDate, formatDateShort } from "@/lib/utils";
import DOMPurify from "dompurify";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { CommentValidation } from "@/lib/validation";
import { Models } from "appwrite";
import { CommentsLoader } from "@/components/Shared/Loaders/CommentsLoader";
import CustomVideoPlayer from "@/components/Shared/CustomVideoPlayer";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Menu, MenuItem, IconButton, Typography, Grid } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBackTwoTone";
import HeartAnimation from "../../components/ui/HeartAnimation";
import DetailsLoader from "@/components/Shared/Loaders/DetailsLoader";

interface SanitizeHTMLResult {
  __html: string;
}

const sanitizeHTML = (htmlString: string): SanitizeHTMLResult => ({
  __html: DOMPurify.sanitize(htmlString),
});

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
  const { mutate: createComment } = useCreateComment();
  const { data: comments, isPending: areCommentsLoading } =
    useGetCommentsByPost(id || "");

  const relatedPosts = userPosts?.documents.filter(
    (userPost: Models.Document) => userPost.$id !== id
  );

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [contentType, setContentType] = useState("");
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [isFullContent, setIsFullContent] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const sanitizedCaption = sanitizeHTML(post?.caption || "").__html;
  const imageUrl = post?.imageUrl.replace("/preview", "/view");
  const YousefID = import.meta.env.VITE_APPWRITE_YOUSEF_USER_ID;
  const TopCreator = import.meta.env.VITE_APPWRITE_TOP_CREATOR;
  const [showHearts, setShowHearts] = useState<boolean>(false);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(imageUrl);
        if (response.ok) {
          const contentTypeHeader = response.headers.get("Content-Type");
          setContentType(contentTypeHeader || "");
        }
      } catch (error) {
        throw error;
      }
    };

    fetchImage();
  }, [imageUrl]);

  const handleCreateComment = () => {
    const commentData = {
      postId: id || "",
      userId: user.id,
      text: commentText,
    };
    const result = CommentValidation.safeParse(commentData);

    if (!result.success) {
      return;
    }

    createComment(commentData, {
      onSuccess: () => setCommentText(""),
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

  const toggleComments = () => setShowComments(!showComments);

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

  const confirmDeletePost = () => {
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

  const handleMoreClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMoreClose = () => {
    setAnchorEl(null);
  };

  const handleShowHearts = () => {
    setShowHearts(true);
    setTimeout(() => {
      setShowHearts(false);
    }, 1500);
  };

  if (isPending || !post) return <Loader />;

  return (
    <div className="post_details-container">
      <div className="md:flex max-w-5xl w-full">
        <Grid item xs={12} className="max-w-5xl w-full">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="shad-button_ghost"
          >
            <ArrowBackIcon />
            <Typography
              variant="button"
              className="small-medium lg:base-medium"
            >
              Back
            </Typography>
          </Button>
        </Grid>
      </div>

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
            <>
              <PhotoView src={post?.imageUrl}>
                <img
                  src={post.imageUrl}
                  alt="Image"
                  className="post_details-img max-h-96 xl:max-h-full object-cover hover:cursor-pointer"
                />
              </PhotoView>
              {/* {showHearts && <HeartAnimation showHearts={showHearts} />} */}
            </>
          ) : (
            <>
              <div className="post_details-video object-cover lg:mb-2 -mb-10 relative rounded-lg">
                <CustomVideoPlayer
                  videoUrl={imageUrl}
                  videoClassName="h-full object-cover rounded-xl shadow-lg"
                />
                {/* {showHearts && <HeartAnimation showHearts={showHearts} />} */}
              </div>
            </>
          )}
        </PhotoProvider>

        <div className="post_details-info">
          <div className="flex justify-between w-full">
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
              <div className="flex flex-col gap-1">
                <div className="flex items-center">
                  <p className="base-medium lg:body-bold text-light-1">
                    {post?.creator.name}
                  </p>
                  {post.creator.$id === TopCreator && (
                    <div className="group relative pin-icon-container">
                      <img
                        alt="badge"
                        width={15}
                        src="/assets/icons/top-creator.png"
                        className="ml-2 object-contain"
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
                        src="/assets/icons/verified-badge.svg"
                        className="ml-2 object-contain pointer-events-none select-none"
                        draggable="false"
                      />
                      <div className="tooltip-verified absolute transition-opacity duration-300">
                        PhotoGram Founder
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 text-light-3">
                  <p className="subtle-semibold lg:small-regular">
                    {formatDate(post?.$createdAt)}
                  </p>
                  •
                  <p className="subtle-semibold lg:small-regular">
                    {post?.location}
                  </p>
                  {post.updated && (
                    <p className="subtle-semibold lg:small-regular">
                      • (Edited)
                    </p>
                  )}
                </div>
              </div>
            </Link>
            <div className="flex items-center gap-2">
              {user.id === post?.creator.$id && (
                <>
                  <IconButton onClick={handleMoreClick}>
                    <MoreVertIcon htmlColor="white" />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMoreClose}
                    slotProps={{
                      paper: {
                        style: {
                          background: "rgba(0, 0, 0, 0.5)",
                          backdropFilter: "blur(40px)",
                          color: "white",
                        },
                      },
                    }}
                  >
                    <MenuItem
                      onClick={() => navigate(`/update-post/${post?.$id}`)}
                      style={{ color: "white" }}
                      className="custom-menu-item"
                    >
                      <EditIcon
                        style={{ marginRight: "8px", color: "white" }}
                      />{" "}
                      Edit
                    </MenuItem>
                    <MenuItem
                      onClick={handleDeletePost}
                      style={{ color: "white" }}
                      className="custom-menu-item"
                    >
                      <DeleteIcon
                        style={{ marginRight: "8px", color: "white" }}
                      />{" "}
                      Delete
                    </MenuItem>
                  </Menu>
                  <style>
                    {`
      .custom-menu-item:hover {
        background: rgba(255, 255, 255, 0.1) !important;
      }
    `}
                  </style>
                </>
              )}
            </div>
          </div>

          <hr className="border w-full border-dark-4/80" />

          <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
            <p
              onClick={() => setIsFullContent(!isFullContent)}
              className={`transition-all duration-700 overflow-hidden cursor-pointer ${
                isFullContent ? "max-h-full" : "max-h-36"
              }`}
              dangerouslySetInnerHTML={{
                __html: isFullContent
                  ? sanitizedCaption
                  : `${sanitizedCaption.substring(0, 250)}${
                      sanitizedCaption.length > 300
                        ? '... <span class="text-slate-500 hover:text-blue-500 text-sm underline cursor-pointer">see more</span>'
                        : ""
                    }`,
              }}
            />
            {isFullContent && sanitizedCaption.length > 300 && (
              <a
                onClick={() => setIsFullContent(false)}
                className="text-neutral-500 hover:text-blue-500 text-sm underline focus:outline-none transition-transform transform active:scale-95 cursor-pointer"
              >
                ...see less
              </a>
            )}
          </div>
          <CommentsModal
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
            <div className="relative">
              <PostStats
                onShowLikeSvg={handleShowHearts}
                post={post}
                userId={user.id}
                commentsCount={comments?.documents.length || 0}
                onToggleComments={toggleComments}
              />
              {showHearts && (
                <div className="absolute top-0 -bottom-5 -left-6">
                  <HeartAnimation showHearts={showHearts} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

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
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDeletePost}
        containerRef={containerRef}
      />
    </div>
  );
};

export default PostDetails;
