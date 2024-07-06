import React from "react";
import { IReply, IUser } from "@/types";
import ReplyItem from "./ReplyItem";
import { Button } from "@/components/ui/button";
import ReplyIcon from "@mui/icons-material/Reply";
import { RepliesLoader } from "../Loaders/RepliesLoader";

interface RepliesSectionProps {
  replies: IReply[];
  repliesLoading: boolean;
  repliesExpanded: boolean;
  setRepliesExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  formatDateShort: (date: string) => string;
  user: IUser;
  replyText: string;
  YousefID: string;
  setReplyText: React.Dispatch<React.SetStateAction<string>>;
  handleCreateReply: () => void;
  handleLikeReply: (replyId: string, hasLiked: boolean | undefined) => void;
  handleDeleteReply: (replyId: string) => void;
}

const RepliesSection: React.FC<RepliesSectionProps> = ({
  replies,
  repliesLoading,
  repliesExpanded,
  setRepliesExpanded,
  formatDateShort,
  YousefID,
  user,
  replyText,
  setReplyText,
  handleCreateReply,
  handleLikeReply,
  handleDeleteReply,
}) => {
  return (
    <div className="border-l-2 border-[#4b5563] pl-4 ml-4 mt-2">
      {repliesLoading ? (
        <RepliesLoader/>
      ) : (
        replies &&
        replies.length > 0 &&
        replies
          .slice(0, repliesExpanded ? replies.length : 3)
          .map((reply: IReply) => (
            <div key={reply.$id} className="reply-container">
              <div className="reply-content">
                <ReplyItem
                  YousefID={YousefID}
                  key={reply.$id}
                  reply={reply}
                  user={user}
                  formatDateShort={formatDateShort}
                  handleLikeReply={handleLikeReply}
                  handleDeleteReply={handleDeleteReply}
                />
              </div>
            </div>
          ))
      )}

      {replies && replies.length > 3 && (
        <button
          onClick={() => setRepliesExpanded(!repliesExpanded)}
          className="text-light-3 text-xs mt-2"
        >
          {repliesExpanded
            ? "Hide replies"
            : `View more replies (${replies.length - 3})`}
        </button>
      )}

      <div className="flex gap-3 items-center pt-2">
        <textarea
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Reply to this comment..."
          className="flex-1 p-2 border border-transparent rounded-xl bg-white/5 focus:bg-white/80 focus:text-black placeholder-light-4 focus:outline-none focus:border-transparent resize-none transition duration-300 focus:shadow-theme-top"
          style={{
            height: "30px",
            overflow: "hidden",
            lineHeight: "30px",
            paddingTop: "0",
            paddingBottom: "0",
          }}
        />
        <Button
          onClick={handleCreateReply}
          className="bg-purple-800 w-8 h-8 hover:bg-purple-700 text-white font-semibold rounded-full p-2 shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-1 focus:ring-primary-500"
          disabled={!replyText.trim()}
        >
          <ReplyIcon />
        </Button>
      </div>
    </div>
  );
};

export default RepliesSection;
