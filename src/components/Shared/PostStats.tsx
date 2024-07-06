import {
  useDeleteSavedPost,
  useGetCurrentUser,
  useLikePost,
  useSavePost,
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

type postStatsProps = {
  post?: Models.Document;
  userId: string;
  commentsCount: number;
  onToggleComments: () => void;
  onShowLikeSvg: () => void;
};

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
                className="cursor-pointer"
                style={{
                  fontSize: "23px",
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
                className="cursor-pointer"
                style={{
                  fontSize: "23px",
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
      </div>
    </div>
  );
};

export default PostStats;
