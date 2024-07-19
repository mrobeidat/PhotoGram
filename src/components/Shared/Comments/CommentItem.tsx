import { useState, useEffect, forwardRef } from "react";
import { Link } from "react-router-dom";
import { IComment, IReply, IUser } from "@/types";
import {
  useGetRepliesByComment,
  useCreateReply,
  useLikeReply,
  useUnlikeReply,
  useDeleteReply,
} from "@/lib/react-query/queriesAndMutations";
import DeleteButton from "./DeleteComment";
import RepliesSection from "./RepliesSection";
import Badge from "./Badge";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useSpring, animated } from "react-spring";

interface CommentItemProps {
  comment: IComment;
  user: IUser;
  TopCreator: string;
  YousefID: string;
  formatDateShort: (date: string) => string;
  handleLike: (commentId: string, hasLiked: boolean | undefined) => void;
  handleDeleteComment: (commentId: string) => void;
}

const CommentItem = forwardRef<HTMLDivElement, CommentItemProps>(
  (
    {
      comment,
      user,
      TopCreator,
      YousefID,
      formatDateShort,
      handleLike,
      handleDeleteComment,
    },
    ref
  ) => {
    const [isFadingOut, setIsFadingOut] = useState(false);
    const [repliesExpanded, setRepliesExpanded] = useState(false);
    const isTopCreator = comment.userId === TopCreator;
    const isVerifiedUser = comment.userId === YousefID;
    const hasLiked = comment.likes?.includes(user.id);
    const [replies, setReplies] = useState<IReply[]>([]);
    const [replyText, setReplyText] = useState("");
    const { data: repliesData, isLoading: repliesLoading } =
      useGetRepliesByComment(comment.$id);
    const { mutate: createReply } = useCreateReply();
    const { mutate: likeReply } = useLikeReply();
    const { mutate: unlikeReply } = useUnlikeReply();
    const { mutate: deleteReply } = useDeleteReply();

    useEffect(() => {
      if (repliesData) {
        setReplies(repliesData);
      }
    }, [repliesData]);

    const handleDelete = () => {
      setIsFadingOut(true);
      setTimeout(() => handleDeleteComment(comment.$id), 500);
    };

    const isIReply = (data: any): data is IReply => {
      return (
        data &&
        typeof data.commentId === "string" &&
        typeof data.userId === "string" &&
        typeof data.text === "string" &&
        Array.isArray(data.likes) &&
        typeof data.$id === "string" &&
        typeof data.$createdAt === "string"
      );
    };

    const handleCreateReply = () => {
      createReply(
        { commentId: comment.$id, userId: user.id, text: replyText },
        {
          onSuccess: (data) => {
            if (isIReply(data)) {
              setReplies((prevReplies) => [...prevReplies, data]);
            } else {
              console.error("Received data is not of type IReply", data);
            }
          },
        }
      );
      setReplyText("");
    };

    const handleLikeReply = (
      replyId: string,
      hasLiked: boolean | undefined
    ) => {
      const updatedReplies = replies.map((reply) =>
        reply.$id === replyId
          ? {
              ...reply,
              likes: hasLiked
                ? reply.likes.filter((id) => id !== user.id)
                : [...reply.likes, user.id],
            }
          : reply
      );
      setReplies(updatedReplies);

      const mutationFn = hasLiked ? unlikeReply : likeReply;
      mutationFn(
        { replyId, userId: user.id },
        {
          onError: () => {
            setReplies(replies);
          },
        }
      );
    };

    const handleDeleteReply = (replyId: string) => {
      setReplies((prevReplies) =>
        prevReplies.filter((reply) => reply.$id !== replyId)
      );
      deleteReply(replyId);
    };

    const formatLikes = (count: number) => {
      if (count >= 1000) {
        return (count / 1000).toFixed(1) + "k";
      }
      return count.toString();
    };

    const [likeAnimation, api] = useSpring(() => ({
      transform: "scale(1)",
    }));

    const handleLikeClick = () => {
      api.start({
        transform: "scale(1.3)",
        config: { tension: 500, friction: 10 },
        onRest: () => {
          api.start({ transform: "scale(1)" });
        },
      });
      handleLike(comment.$id, hasLiked);
    };

    return (
      <div
        ref={ref}
        className={`transition-opacity duration-500 ease-out ${
          isFadingOut ? "opacity-0 transform -translate-y-5" : ""
        } p-2 flex flex-col mb-3 w-full`}
      >
        <div className="flex items-start gap-3 md:flex-wrap">
          <Link to={`/profile/${comment.userId}`} className="shrink-0">
            <img
              src={
                comment.user?.imageUrl ||
                "/assets/icons/profile-placeholder.svg"
              }
              alt="user"
              className="w-8 h-8 rounded-full object-cover"
            />
          </Link>
          <div className="flex-1 max-w-full">
            <div className="relative bg-black/20   p-3 rounded-lg">
              <div className="absolute top-0 right-0 mt-2 mr-2">
                {user.id === comment.userId && (
                  <DeleteButton onDelete={handleDelete} />
                )}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Link
                  to={`/profile/${comment.userId}`}
                  className="text-dark-800 font-semibold hover:underline text-xs"
                >
                  {comment.user?.name ?? "Unknown User"}
                </Link>
                {isTopCreator && (
                  <Badge
                    icon="/assets/icons/top-creator.png"
                    label="Top Creator"
                  />
                )}
                {isVerifiedUser && (
                  <Badge
                    icon="/assets/icons/verified-badge.svg"
                    label="Verified User"
                  />
                )}
              </div>
              <p
                className="text-dark-600 text-sm mt-2"
                style={{
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                  whiteSpace: "normal",
                }}
              >
                {comment.text}
              </p>
              <div className="flex items-center text-xs text-gray-500 mt-1">
                <span>{formatDateShort(comment.$createdAt)}</span>
                <span className="mx-2">·</span>
                <button onClick={handleLikeClick} className="flex items-center">
                  {hasLiked ? (
                    <animated.div style={likeAnimation}>
                      <FavoriteIcon className="!text-rose-600 !text-xl mr-1" />
                    </animated.div>
                  ) : (
                    <FavoriteBorderIcon className="!text-rose-600 !text-xl mr-1" />
                  )}

                  {comment.likes && comment.likes.length > 0 && (
                    <span className="text-[15px]">
                      {formatLikes(comment.likes.length)}
                    </span>
                  )}
                </button>
              </div>
            </div>

            <RepliesSection
              YousefID={YousefID}
              replies={replies}
              repliesLoading={repliesLoading}
              repliesExpanded={repliesExpanded}
              setRepliesExpanded={setRepliesExpanded}
              formatDateShort={formatDateShort}
              user={user}
              replyText={replyText}
              setReplyText={setReplyText}
              handleCreateReply={handleCreateReply}
              handleLikeReply={handleLikeReply}
              handleDeleteReply={handleDeleteReply}
            />
          </div>
        </div>
      </div>
    );
  }
);

CommentItem.displayName = "CommentItem";

export default CommentItem;
