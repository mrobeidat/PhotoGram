import React from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowUpwardOutlined";
import { Button } from "@/components/ui/button";

interface CommentInputProps {
  commentText: string;
  setCommentText: (text: string) => void;
  handleCreateComment: () => void;
}

const CommentInput: React.FC<CommentInputProps> = ({
  commentText,
  setCommentText,
  handleCreateComment,
}) => (
  <div className="comment-container sticky bottom-2 bg-gray-500/30 backdrop-blur-2xl">
    <textarea
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          handleCreateComment();
        }
      }}
      value={commentText}
      onChange={(e) => setCommentText(e.target.value)}
      placeholder="Add a comment..."
      className="w-full h-12 p-3 rounded-lg bg-transparent text-white placeholder-gray-400 shadow-2xl focus:shadow-light focus:outline-none transition duration-300 resize-none"
    />
    <Button
      onClick={handleCreateComment}
      className="bg-purple-800 h-12 w-12 hover:bg-purple-700 text-white rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
      disabled={!commentText.trim()}
    >
      <ArrowForwardIcon />
    </Button>
  </div>
);

export default CommentInput;
