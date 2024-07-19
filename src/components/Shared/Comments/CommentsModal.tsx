import React, { useEffect, useRef, useState } from "react";
import { Modal, Box, Fade, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { IComment, IUser } from "@/types";
import {
  useLikeComment,
  useUnlikeComment,
} from "@/lib/react-query/queriesAndMutations";
import CommentItem from "./CommentItem";
import CommentInput from "./CommentInput";
import NoComments from "./NoComments";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  containerRef: React.RefObject<HTMLDivElement>;
  title: string;
  commentsLoading: boolean;
  comments: IComment[];
  handleCreateComment: () => void;
  handleDeleteComment: (commentId: string) => void;
  commentText: string;
  setCommentText: (text: string) => void;
  user: IUser;
  TopCreator: string;
  YousefID: string;
  formatDateShort: (date: string) => string;
  CommentsLoader: React.FC;
}

const CommentsModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  commentsLoading,
  comments: initialComments,
  handleCreateComment,
  handleDeleteComment,
  commentText,
  setCommentText,
  user,
  TopCreator,
  YousefID,
  formatDateShort,
  CommentsLoader,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [comments, setComments] = useState<IComment[]>(initialComments);
  const newCommentRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  const { mutate: likeComment } = useLikeComment();
  const { mutate: unlikeComment } = useUnlikeComment();

  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  useEffect(() => {
    if (newCommentRef.current) {
      newCommentRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [comments.length]);

  const handleOutsideClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const handleEscapePress = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  const handleLike = (commentId: string, hasLiked: boolean | undefined) => {
    const updatedComments = comments.map((comment) =>
      comment.$id === commentId
        ? {
            ...comment,
            likes: hasLiked
              ? comment.likes?.filter((id) => id !== user.id)
              : [...(comment.likes ?? []), user.id],
          }
        : comment
    );
    setComments(updatedComments);

    const mutationFn = hasLiked ? unlikeComment : likeComment;
    mutationFn(
      { commentId, userId: user.id },
      {
        onError: () => setComments(comments),
      }
    );
  };

  const handleCreateCommentAndScroll = () => {
    handleCreateComment();
    setTimeout(() => {
      if (newCommentRef.current) {
        newCommentRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const handleDeleteCommentAndUpdate = (commentId: string) => {
    setComments((prevComments) =>
      prevComments.filter((comment) => comment.$id !== commentId)
    );
    handleDeleteComment(commentId);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrolled(e.currentTarget.scrollTop > 0);
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      closeAfterTransition
      BackdropProps={{
        timeout: 500,
        sx: { backdropFilter: "blur(10px)" },
      }}
    >
      <Fade in={isOpen}>
        <Box
          ref={modalRef}
          sx={{
            borderBottomLeftRadius: "30px",
            borderTopLeftRadius: "30px",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "100%", sm: "80%", md: "70%" },
            maxWidth: "100%",
            maxHeight: "80%",
            backgroundColor: "rgb(240, 240, 240,0.09)",
            backdropFilter: "blur(50px)",
            boxShadow: 24,
            pr: 1,
            pl: 1,
            overflowY: "auto",
            transition: "all 0.3s ease",
            "&:focus-visible": {
              outline: "none",
            },
            "&::-webkit-scrollbar": {
              borderRadius: "50px",
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              borderRadius: "50px",
              background: "rgba(255, 255, 255, 0.1)",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgb(77, 0, 112, 0.7)",
              borderRadius: "50px",
              border: "2px solid rgba(30, 30, 30, 0.9)",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "rgb(77, 0, 112, 1)",
            },
          }}
          onClick={handleOutsideClick}
          onKeyDown={handleEscapePress}
          tabIndex={1}
          onScroll={handleScroll}
          className={scrolled ? "scrolled" : ""}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Typography variant="h5" component="h1" className="p-3">
              {title}
            </Typography>
            <IconButton onClick={onClose} sx={{ color: "white" }}>
              <CloseIcon />
            </IconButton>
          </Box>
          {scrolled && (
            <Box
              sx={{
                position: "sticky",
                top: 0,
                left: 0,
                right: 0,
                height: "10px",
                zIndex: 1,
                borderTopLeftRadius: "16px",
                borderTopRightRadius: "16px",
              }}
            />
          )}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {commentsLoading ? (
              <CommentsLoader />
            ) : comments.length > 0 ? (
              comments.map((comment, index) => (
                <CommentItem
                  key={comment.$id}
                  comment={comment}
                  user={user}
                  TopCreator={TopCreator}
                  YousefID={YousefID}
                  formatDateShort={formatDateShort}
                  handleLike={handleLike}
                  handleDeleteComment={handleDeleteCommentAndUpdate}
                  ref={index === comments.length - 1 ? newCommentRef : null}
                />
              ))
            ) : (
              <NoComments />
            )}
          </Box>
          <CommentInput
            commentText={commentText}
            setCommentText={setCommentText}
            handleCreateComment={handleCreateCommentAndScroll}
          />
        </Box>
      </Fade>
    </Modal>
  );
};
export default CommentsModal;
