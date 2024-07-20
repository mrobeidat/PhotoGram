import {
  useDeleteSavedPost,
  useGetCurrentUser,
  useLikePost,
  useSavePost,
  useSharePost,
} from "@/lib/react-query/queriesAndMutations";
import { checkIsLiked } from "@/lib/utils";
import { Models } from "appwrite";
import React, { useEffect, useState } from "react";
import "primeicons/primeicons.css";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import CircularProgress from "@mui/material/CircularProgress";
import { useSpring, animated } from "react-spring";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import Twitter from "@mui/icons-material/Twitter";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Share2Icon } from "lucide-react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import Backdrop from "@mui/material/Backdrop";
import WhatsAppIcon from "@mui/icons-material/WhatsApp"; // Import WhatsApp icon

type postStatsProps = {
  post?: Models.Document;
  userId: string;
  commentsCount: number;
  onToggleComments: () => void;
  onShowLikeSvg: () => void;
};

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  }
);

const PostStats = ({
  post,
  userId,
  commentsCount,
  onToggleComments,
  onShowLikeSvg,
}: postStatsProps) => {
  const likesList = post?.likes.map((user: Models.Document) => user.$id) || [];

  const [likes, setLikes] = useState(likesList);
  const [isSaved, setIsSaved] = useState(false);

  const { mutate: likePost } = useLikePost();
  const { mutate: savePost, isPending: isSavingPost } = useSavePost();
  const { mutate: deleteSavedPost, isPending: isDeletingPost } =
    useDeleteSavedPost();
  const { mutate: sharePost } = useSharePost();

  const { data: currentUser } = useGetCurrentUser();

  const savedPostRecord = currentUser?.save?.find(
    (record: Models.Document) => record.post?.$id === post?.$id
  );

  useEffect(() => {
    setIsSaved(!!savedPostRecord);
  }, [currentUser]);

  const [likeAnimation, api] = useSpring(() => ({
    transform: "scale(1)",
  }));

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();

    let newLikes = [...likes];

    const hasLiked = newLikes.includes(userId);

    if (hasLiked) {
      newLikes = newLikes.filter((id) => id !== userId);
    } else {
      newLikes.push(userId);
      onShowLikeSvg();
    }
    setLikes(newLikes);
    likePost({ postId: post?.$id || "", likesArray: newLikes });

    api.start({
      transform: "scale(1.3)",
      config: { tension: 300, friction: 10, duration: 300 },
      onRest: () => {
        api.start({
          transform: "scale(1)",
          config: { tension: 300, friction: 10, duration: 300 },
        });
      },
    });
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (savedPostRecord) {
      setIsSaved(false);
      deleteSavedPost(savedPostRecord.$id);
    } else {
      savePost({ postId: post?.$id || "", userId });
      setIsSaved(true);
    }
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleShare = (platform: string) => {
    const baseUrl = window.location.origin;
    const postUrl = `${baseUrl}/posts/${post?.$id}`;

    sharePost({ postId: post?.$id || "", userId });

    switch (platform) {
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`,
          "_blank"
        );
        break;
      case "linkedin":
        window.open(
          `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(postUrl)}`,
          "_blank"
        );
        break;
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}`,
          "_blank"
        );
        break;
      case "whatsapp":
        window.open(
          `https://api.whatsapp.com/send?text=${encodeURIComponent(postUrl)}`,
          "_blank"
        );
        break;
      default:
        break;
    }

    handleClose();
  };

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [backdropOpen, setBackdropOpen] = useState(false);

  const handleCopyToClipboard = () => {
    const baseUrl = window.location.origin;
    const postUrl = `${baseUrl}/posts/${post?.$id}`;
    navigator.clipboard.writeText(postUrl).then(() => {
      setBackdropOpen(true);
      setSnackbarOpen(true);
    });
    handleClose();
  };

  const handleSnackbarClose = (reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
    setBackdropOpen(false);
  };

  return (
    <div className="flex justify-between items-center z-20">
      <div className="flex gap-2 items-center">
        <div className="flex gap-2 items-center">
          <animated.div style={likeAnimation}>
            {checkIsLiked(likes, userId) ? (
              <FavoriteIcon
                className="cursor-pointer"
                style={{ color: "#ff0000", fontSize: "23px" }}
                onClick={handleLike}
              />
            ) : (
              <FavoriteBorderIcon
                className="cursor-pointer"
                style={{ color: "#ff0000", fontSize: "23px" }}
                onClick={handleLike}
              />
            )}
          </animated.div>
          <p className="small-medium lg:base-medium mr-2">
            {likes.length > 0 && likes.length}
          </p>
        </div>
        <div
          className="flex items-center cursor-pointer"
          onClick={onToggleComments}
        >
          <ChatBubbleOutlineIcon
            style={{ fontSize: "20px", color: "#667eea" }}
          />
          <p className="small-medium lg:base-medium ml-2">
            {commentsCount > 0 && commentsCount}
          </p>
        </div>
      </div>

      <div className="flex gap-2 items-center">
        {isSavingPost || isDeletingPost ? (
          <CircularProgress size={20} />
        ) : (
          <>
            {isSaved ? (
              <BookmarkIcon
                className="cursor-pointer !size-6"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "blueviolet",
                }}
                onClick={handleSave}
              />
            ) : (
              <BookmarkBorderIcon
                className="cursor-pointer !size-6"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "blueviolet",
                }}
                onClick={handleSave}
              />
            )}
          </>
        )}

        <Button
          className="!-mr-5 !-ml-2 !text-purple-700"
          id="share-button"
          aria-controls={open ? "share-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          <Share2Icon className="size-5" />
        </Button>
        <Menu
          id="share-menu"
          sx={{
            "& .MuiPaper-root": {
              backdropFilter: "blur(10px)",
              backgroundColor: "rgba(0, 0, 0, 0.2)",
              color: "#fff",
              overflowY: "auto",
              maxHeight: "175px",
              boxShadow: "inset 0 -25px 20px -10px rgba(255, 255, 255, 0.2)",
              "&::-moz-scrollbar": {
                width: "5px",
              },
              "&::-moz-scrollbar-thumb": {
                backgroundColor: "#888",
                borderRadius: "10px",
              },
              "&::-webkit-scrollbar": {
                width: "5px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#888",
                borderRadius: "10px",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "rgba(0, 0, 0, 0.2)",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                backgroundColor: "#555",
              },
            },
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "share-button",
          }}
        >
          <MenuItem onClick={() => handleShare("facebook")}>
            <FacebookIcon style={{ marginRight: 8, color: "#316FF6" }} />{" "}
            Facebook
          </MenuItem>
          <MenuItem onClick={() => handleShare("linkedin")}>
            <LinkedInIcon style={{ marginRight: 8, color: "#0077B5" }} />{" "}
            LinkedIn
          </MenuItem>
          <MenuItem onClick={() => handleShare("twitter")}>
            <Twitter style={{ marginRight: 8 }} /> Twitter
          </MenuItem>
          <MenuItem onClick={() => handleShare("whatsapp")}>
            <WhatsAppIcon style={{ marginRight: 8, color: "#25d366" }} />{" "}
            WhatsApp
          </MenuItem>
          <MenuItem onClick={handleCopyToClipboard}>
            <ContentCopyIcon style={{ marginRight: 8 }} /> Copy Link
          </MenuItem>
        </Menu>
        <Backdrop
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
          open={backdropOpen}
          onClick={() => handleSnackbarClose()}
        >
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={3000}
            onClose={() => handleSnackbarClose()}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            sx={{
              "& .MuiPaper-root": {
                backdropFilter: "blur(50px)",
                backgroundColor: "#7F00FF",
              },
            }}
          >
            <Alert onClose={() => handleSnackbarClose()} severity="success">
              Link copied to clipboard!
            </Alert>
          </Snackbar>
        </Backdrop>
      </div>
    </div>
  );
};

export default PostStats;
