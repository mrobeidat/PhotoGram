import React from "react";
import { Link } from "react-router-dom";
import { IReply, IUser } from "@/types";
import { useGetUserById } from "@/lib/react-query/queriesAndMutations";
import DeleteButton from "./DeleteComment";
import { useSpring, animated } from "react-spring";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Badge from "./Badge";

interface ReplyItemProps {
  reply: IReply;
  user: IUser;
  formatDateShort: (date: string) => string;
  handleLikeReply: (replyId: string, hasLiked: boolean | undefined) => void;
  handleDeleteReply: (replyId: string) => void;
  YousefID: string;
}

const ReplyItem: React.FC<ReplyItemProps> = ({
  reply,
  user,
  formatDateShort,
  handleLikeReply,
  handleDeleteReply,
  YousefID,
}) => {
  const { data: userData, isLoading: userLoading } = useGetUserById(
    reply.userId
  );
  const hasLiked = reply.likes.includes(user.id);
  const isVerifiedUser = reply.userId === YousefID;

  const [likeAnimation, api] = useSpring(() => ({
    transform: "scale(1)",
  }));

  const entranceAnimation = useSpring({
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0)" },
    config: { tension: 200, friction: 20 },
  });

  const formatLikes = (count: number) => {
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + "k";
    }
    return count.toString();
  };

  const handleLikeClick = () => {
    api.start({
      transform: "scale(1.3)",
      config: { tension: 300, friction: 10 },
      onRest: () => {
        api.start({ transform: "scale(1)" });
      },
    });
    handleLikeReply(reply.$id, hasLiked);
  };

  if (userLoading || !userData) {
    return (
      <div className="flex items-start gap-3 pt-2">
        <div className="w-8 h-8 rounded-full bg-gray-700 shimmer" />
        <div className="flex-1">
          <div className="bg-white/10 p-2 rounded-lg">
            <div className="h-4 bg-gray-700 rounded w-40 mb-2 shimmer"></div>
            <div className="h-3 bg-gray-700 rounded w-40 mb-2 shimmer"></div>
            <div className="h-3 bg-gray-700 rounded w-40 shimmer"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <animated.div
      style={entranceAnimation}
      className="flex items-start gap-3 pt-2"
    >
      <Link to={`/profile/${reply.userId}`}>
        <img
          src={userData.imageUrl || "/assets/icons/profile-placeholder.svg"}
          alt="user"
          className="w-6 h-6 rounded-full object-cover"
        />
      </Link>
      <div className="flex-1">
        <div className="bg-black/20 p-2 rounded-lg">
          <div className="flex items-center gap-2">
            <Link
              to={`/profile/${reply.userId}`}
              className="text-white font-semibold hover:underline text-xs"
            >
              {userData.name ?? "Unknown User"}
            </Link>
            {isVerifiedUser && (
              <Badge
                icon="/assets/icons/verified-badge.svg"
                label="Verified User"
              />
            )}
          </div>
          <p className="text-gray-300 text-xs">{reply.text}</p>
          <div className="flex items-center text-xs text-gray-500 mt-1">
            <span>{formatDateShort(reply.createdAt)}</span>
            <span className="mx-2">·</span>
            <button onClick={handleLikeClick} className="flex items-center">
              {hasLiked ? (
                <animated.div style={likeAnimation}>
                  <FavoriteIcon className="!text-rose-600 !text-xl mr-1" />
                </animated.div>
              ) : (
                <FavoriteBorderIcon className="!text-rose-600 !text-xl mr-1" />
              )}
              {reply.likes.length > 0 && (
                <span className="text-[15px]">
                  {formatLikes(reply.likes.length)}
                </span>
              )}
            </button>
            {user.id === reply.userId && (
              <>
                <span className="mx-2">·</span>
                <DeleteButton onDelete={() => handleDeleteReply(reply.$id)} />
              </>
            )}
          </div>
        </div>
      </div>
    </animated.div>
  );
};

export default ReplyItem;
