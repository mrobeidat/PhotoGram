import React, { useEffect, useRef, useState, forwardRef } from 'react';
import { createPortal } from 'react-dom';
import CloseIcon from '@mui/icons-material/Cancel';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Button } from './button';
import { Link } from 'react-router-dom';
import { IComment } from '@/types';
import { useLikeComment, useUnlikeComment } from '@/lib/react-query/queriesAndMutations';
import 'primeicons/primeicons.css';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Tooltip } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  containerRef: React.RefObject<HTMLDivElement>;
  title: string;
  commentsLoading: boolean;
  comments: IComment[];
  handleCreateComment: () => void;
  handleDeleteComment: (commentId: string) => void;
  commentText: string;
  setCommentText: (text: string) => void;
  user: { id: string };
  TopCreator: string;
  YousefID: string;
  formatDateShort: (date: string) => string;
  CommentsLoader: React.FC;
}

interface CommentItemProps {
  comment: IComment;
  user: { id: string };
  TopCreator: string;
  YousefID: string;
  formatDateShort: (date: string) => string;
  handleLike: (commentId: string, hasLiked: boolean | undefined) => void;
  handleDeleteComment: (commentId: string) => void;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  containerRef,
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
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [comments, setComments] = useState<IComment[]>(initialComments);
  const newCommentRef = useRef<HTMLDivElement>(null);

  const { mutate: likeComment } = useLikeComment();
  const { mutate: unlikeComment } = useUnlikeComment();

  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  useEffect(() => {
    const handleBodyClass = (action: 'add' | 'remove') => {
      document.body.classList[action]('overflow-hidden', 'touch-action-none');
      if (containerRef.current) {
        containerRef.current.classList[action]('overflow-hidden');
      }
    };

    if (isOpen) {
      setMounted(true);
      setTimeout(() => setShowModal(true), 10);
      handleBodyClass('add');
    } else {
      setShowModal(false);
      setTimeout(() => {
        setMounted(false);
        handleBodyClass('remove');
      }, 300);
    }

    return () => handleBodyClass('remove');
  }, [isOpen, containerRef]);

  useEffect(() => {
    if (newCommentRef.current) {
      newCommentRef.current.scrollIntoView({ behavior: 'smooth' });
      newCommentRef.current.classList.add('flash');
      setTimeout(() => {
        newCommentRef.current?.classList.remove('flash');
      }, 2000);
    }
  }, [comments.length]);

  const handleOutsideClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const handleEscapePress = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
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
        newCommentRef.current.scrollIntoView({ behavior: 'smooth' });
        newCommentRef.current.classList.add('flash');
        setTimeout(() => {
          newCommentRef.current?.classList.remove('flash');
        }, 2000);
      }
    }, 100);
  };



  if (!mounted) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 transition-opacity duration-300 ${showModal ? 'opacity-100' : 'opacity-0'
        }`}
      onClick={handleOutsideClick}
    >
      <div
        ref={modalRef}
        className={`bg-black/30 max-w-92 backdrop-blur-md rounded-2xl overflow-hidden shadow-xl w-full max-w-md mx-4 sm:mx-6 transition-transform duration-300 transform ${showModal ? 'scale-100' : 'scale-95'
          }`}
        tabIndex={1}
        onKeyDown={handleEscapePress}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4">
          <div onClick={onClose} className="float-right cursor-pointer">
            <CloseIcon />
          </div>
          <h3 className="body-bold md:h3-bold mb-8">{title}</h3>
          <div className="max-h-60 overflow-y-auto space-y-2 scrollbar-thin">
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
                  handleDeleteComment={handleDeleteComment}
                  ref={index === comments.length - 1 ? newCommentRef : null}
                />
              ))
            ) : (
              <NoComments />
            )}
          </div>
          <CommentInput
            commentText={commentText}
            setCommentText={setCommentText}
            handleCreateComment={handleCreateCommentAndScroll}
          />
          {children}
        </div>
      </div>
    </div>,
    containerRef.current || document.body
  );
};


const DeleteButton: React.FC<{ onDelete: () => void }> = ({ onDelete }) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirmDelete = () => {
    setOpen(false);
    onDelete();
  };

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Tooltip title="Delete" arrow>
        <IconButton onClick={handleClickOpen} size="small" style={{ color: 'white' }}>
          <DeleteOutlineIcon className='text-red hover:scale-110 transform duration-800' />
        </IconButton>
      </Tooltip>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          '& .MuiPaper-root': {
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            color: 'white',
            maxWidth: '25rem'
          },
        }}
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" className='!text-white'>
            Are you sure you want to delete this comment? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} className='bg-white/20 rounded-full'>
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} autoFocus className='bg-red rounded-full cursor-pointer'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
const CommentItem = forwardRef<HTMLDivElement, CommentItemProps>(({
  comment,
  user,
  TopCreator,
  YousefID,
  formatDateShort,
  handleLike,
  handleDeleteComment,
}, ref) => {
  const isTopCreator = comment.userId === TopCreator;
  const isVerifiedUser = comment.userId === YousefID;
  const hasLiked = comment.likes?.includes(user.id);

  return (
    <div ref={ref} className="comment p-4 rounded-lg flex justify-between items-start shadow-md mb-3">
      <div className="flex items-start gap-3">
        <Link to={`/profile/${comment.userId}`}>
          <img
            src={comment.user?.imageUrl || '/assets/icons/profile-placeholder.svg'}
            alt="user"
            className="w-8 h-8 rounded-full object-cover"
          />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Link
              to={`/profile/${comment.userId}`}
              className="text-dark-800 text-sm font-semibold hover:underline"
            >
              {comment.user?.name ?? 'Unknown User'}
            </Link>
            {isTopCreator && <Badge icon="/assets/icons/top-creator.png" label="Top Creator" />}
            {isVerifiedUser && <Badge icon="/assets/icons/verified-badge.svg" label="Verified User" />}
          </div>
          <p className="text-dark-600 text-sm">{comment.text}</p>
          <p className="text-light-4 text-xs">{formatDateShort(comment.$createdAt)}</p>
        </div>
      </div>
      <div className="flex flex-col-reverse items-center gap-2">
        <div className="flex items-center">
          <i
            className={`pi ${hasLiked ? 'pi-heart-fill' : 'pi-heart'} cursor-pointer`}
            style={{ color: '#ff0000', fontSize: '12px' }}
            onClick={() => handleLike(comment.$id, hasLiked)}
          ></i>
          {comment.likes && comment.likes.length > 0 && (
            <span className="ml-1" style={{ minWidth: '1.5rem', textAlign: 'center' }}>
              {comment.likes.length}
            </span>
          )}
        </div>
        {user.id === comment.userId && (
          <DeleteButton onDelete={() => handleDeleteComment(comment.$id)} />
        )}
      </div>
    </div>
  );
});

CommentItem.displayName = 'CommentItem';

const Badge: React.FC<{ icon: string; label: string }> = ({ icon, label }) => (
  <div className="group relative flex items-center">
    <img
      alt="badge"
      width={16}
      src={icon}
      className="object-contain pointer-events-none select-none"
      draggable="false"
    />
    <div className="opacity-0  transition-opacity duration-300 absolute text-xs bg-gray-800 text-white p-1 rounded-md -mt-6 -ml-4">
      {label}
    </div>
  </div>
);

const NoComments: React.FC = () => (
  <div className="text-light-4 text-center pb-5 overflow-hidden">
    <svg
      width="200"
      height="200"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="m-auto"
    >
      <path
        d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 13.6569 3.59695 15.1566 4.63604 16.3636L3 21L7.63604 19.3636C8.84315 20.4036 10.3439 21 12 21Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-pulse"
      />
    </svg>
    No comments yet. Be the first to comment!
  </div>
);

const CommentInput: React.FC<{
  commentText: string;
  setCommentText: (text: string) => void;
  handleCreateComment: () => void;
}> = ({ commentText, setCommentText, handleCreateComment }) => (
  <div className="flex gap-3 items-center">
    <textarea
      onKeyUp={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleCreateComment();
        }
      }}
      value={commentText}
      onChange={(e) => setCommentText(e.target.value)}
      placeholder="Add a comment..."
      className="flex-1 p-2 border border-dark-4 rounded-xl bg-dark-1 text-light-1 placeholder-light-4 focus:outline-none focus:border-transparent resize-none transition duration-300 focus:shadow-theme-top"
      style={{ height: '40px', overflow: 'hidden' }}
    />
    <Button
      onClick={handleCreateComment}
      className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-3 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-1 focus:ring-primary-500"
      disabled={!commentText.trim()}
    >
      <ArrowForwardIcon />
    </Button>
  </div>
);

export default Modal;
