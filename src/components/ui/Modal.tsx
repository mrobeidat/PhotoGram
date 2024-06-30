import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import CloseIcon from '@mui/icons-material/Cancel';
import { Button } from './button';
import { Link } from 'react-router-dom';
import { IComment } from '@/types';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface ReusableModalProps {
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

const ReusableModal: React.FC<ReusableModalProps> = ({
  isOpen,
  onClose,
  children,
  containerRef,
  title,
  commentsLoading,
  comments,
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
  const ReusableModalRef = useRef<HTMLDivElement>(null);
  const [showReusableModal, setShowReusableModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      setTimeout(() => {
        setShowReusableModal(true);
      }, 10);
      document.body.classList.add('overflow-hidden', 'touch-action-none');
      if (containerRef.current) {
        containerRef.current.classList.add('overflow-hidden');
      }
    } else {
      setShowReusableModal(false);
      setTimeout(() => {
        setMounted(false);
        document.body.classList.remove('overflow-hidden', 'touch-action-none');
        if (containerRef.current) {
          containerRef.current.classList.remove('overflow-hidden');
        }
      }, 300);
    }

    return () => {
      document.body.classList.remove('overflow-hidden', 'touch-action-none');
      if (containerRef.current) {
        containerRef.current.classList.remove('overflow-hidden');
      }
    };
  }, [isOpen, containerRef]);

  const handleOutsideClick = (e: React.MouseEvent) => {
    if (ReusableModalRef.current && !ReusableModalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const handleEscapePress = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!mounted) return null;

 return createPortal(
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 transition-opacity duration-300 ${showReusableModal ? 'opacity-100' : 'opacity-0'}`}
      onClick={handleOutsideClick}
    >
      <div
        ref={ReusableModalRef}
        className={`bg-black/30 max-w-92 backdrop-blur-md rounded-2xl overflow-hidden shadow-xl w-full max-w-md mx-4 sm:mx-6 transition-transform duration-300 transform ${showReusableModal ? 'scale-100' : 'scale-95'} shadow-lg`}
        tabIndex={1}
        onKeyDown={handleEscapePress}
      >
        <div className="p-4">
          <div onClick={onClose} className="float-right cursor-pointer">
            <CloseIcon />
          </div>
          <h3 className="body-bold md:h3-bold mb-8">{title}</h3>
          <div className="max-h-60 overflow-y-auto space-y-2 scrollbar-thin">
            {commentsLoading ? (
              <CommentsLoader />
            ) : (
              (comments?.length ?? 0) > 0 ? (
                comments.map((comment: IComment) => {
                  const isTopCreator = comment.userId === TopCreator;
                  const isVerifiedUser = comment.userId === YousefID;
                  return (
                    <div
                      key={comment.$id}
                      className="comment p-2 rounded-lg flex justify-between items-start animate-slideIn"
                    >
                      <div className="flex items-start gap-2">
                        <Link to={`/profile/${comment.userId}`}>
                          <img
                            src={comment.user?.imageUrl || "/assets/icons/profile-placeholder.svg"}
                            alt="user"
                            className="w-6 h-6 rounded-full object-cover"
                          />
                        </Link>
                        <div>
                          <div className="flex items-center gap-1">
                            <Link to={`/profile/${comment.userId}`} className="text-light-1 text-sm font-semibold hover:underline">
                              {comment.user?.name ?? 'Unknown User'}
                            </Link>
                            {isTopCreator && (
                              <div className="group relative pin-icon-container">
                                <img
                                  alt="badge"
                                  width={12}
                                  src={"/assets/icons/top-creator.png"}
                                  className="object-contain pointer-events-none select-none"
                                  draggable="false"
                                />
                                <div className="tooltip-verified-creator absolute transition-opacity duration-300 text-xs">
                                  Top Creator
                                </div>
                              </div>
                            )}
                            {isVerifiedUser && (
                              <div className="group relative pin-icon-container">
                                <img
                                  alt="badge"
                                  width={12}
                                  src={"/assets/icons/verified-badge.svg"}
                                  className="object-contain pointer-events-none select-none"
                                  draggable="false"
                                />
                                <div className="tooltip-verified absolute transition-opacity duration-300 text-xs">
                                  Verified User
                                </div>
                              </div>
                            )}
                          </div>
                          <p className="text-light-1 text-sm">{comment.text}</p>
                          <p className="text-light-3 text-xs">{formatDateShort(comment.$createdAt)}</p>
                        </div>
                      </div>
                      {user.id === comment.userId && (
                        <Button
                          onClick={() => handleDeleteComment(comment.$id)}
                          variant="ghost"
                          className="shad-button_ghost cursor-pointer hover:scale-108 transition duration-300"
                        >
                          <img src={"/assets/icons/delete.svg"} alt="delete" width={16} height={16} />
                        </Button>
                      )}
                    </div>
                  );
                })
              ) : (
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
              )
            )}
          </div>
          <div className="flex gap-3 items-center">
            <textarea
              onKeyUp={(e) => {
                if (e.key === "Enter") {
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
          {children}
        </div>
      </div>
    </div>,
    containerRef.current || document.body
  );
};

export default ReusableModal;