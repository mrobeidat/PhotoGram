import {
  IComment,
  INewPost,
  INewUser,
  IReply,
  IUpdatePost,
  IUpdateUser,
} from "@/types";
import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import {
  SignInAccount,
  SignOutAccount,
  createUserAccount,
} from "@/lib/appwrite/auth";
import {
  createPost,
  updatePost,
  getRecentPosts,
  likePost,
  savePost,
  deleteSavedPost,
  getPostById,
  deletePost,
  getInfinitePosts,
  searchPosts,
  getUserPosts,
  getPinnedPost,
  getPostsFromFollowedUsers,
  sharePost,
} from "@/lib/appwrite/post";
import {
  getCurrentUser,
  getUserById,
  updateUser,
  getInfiniteUsers,
  searchUsers,
} from "@/lib/appwrite/user";
import {
  createComment,
  getCommentsByPost,
  deleteComment,
  likeComment,
  unlikeComment,
} from "@/lib/appwrite/comment";
import {
  createReply,
  getRepliesByComment,
  likeReply,
  unlikeReply,
  deleteReply,
} from "@/lib/appwrite/reply";
import {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowees,
  getFollowersDetails,
  getFolloweesDetails,
} from "@/lib/appwrite/follow";

import { QUERY_KEYS } from "@/lib/react-query/queryKeys";

// User Account Hooks
export const useCreateUserAccount = () => {
  return useMutation({
    mutationFn: (user: INewUser) => createUserAccount(user),
  });
};

export const useSignInAccount = () => {
  return useMutation({
    mutationFn: (user: { email: string; password: string }) =>
      SignInAccount(user),
  });
};

export const useSignOutAccount = () => {
  return useMutation({
    mutationFn: SignOutAccount,
  });
};

// Post Hooks
export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post: INewPost) => createPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post: IUpdatePost) => updatePost(post),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
      });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, imageId }: { postId?: string; imageId: string }) =>
      deletePost(postId || "", imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
    },
  });
};

export const useSharePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, userId }: { postId: string; userId: string }) =>
      sharePost(postId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS_FROM_FOLLOWED_USERS],
      });
    },
  });
};

// Query Hooks for Posts
export const useGetRecentPosts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
    queryFn: getRecentPosts,
  });
};

export const useLikePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      postId,
      likesArray,
    }: {
      postId: string;
      likesArray: string[];
    }) => likePost(postId, likesArray),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};

export const useSavePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, userId }: { postId: string; userId: string }) =>
      savePost(postId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};

export const useDeleteSavedPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (savedRecordId: string) => deleteSavedPost(savedRecordId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
    },
  });
};

export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CURRENT_USER],
    queryFn: getCurrentUser,
  });
};

// Query Hooks for Users
export const useGetPostById = (postId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
    queryFn: () => getPostById(postId),
    enabled: !!postId,
  });
};

export const useGetPosts = () => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
    queryFn: ({ pageParam = "" }) => getInfinitePosts({ pageParam }),
    getNextPageParam: (lastPage) => {
      if (lastPage && lastPage.data.length === 0) {
        return null;
      }
      const lastId = lastPage?.data[lastPage.data.length - 1].$id;
      return lastId;
    },
    initialPageParam: "",
  });
};

export const useGetUsers = () => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_USERS],
    queryFn: ({ pageParam = "" }) => getInfiniteUsers({ pageParam }),
    getNextPageParam: (lastPage) => lastPage?.nextCursor ?? null,
    initialPageParam: "",
  });
};

export const useSearchPosts = (searchTerm: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
    queryFn: () => searchPosts(searchTerm),
    enabled: !!searchTerm,
  });
};

// Todo
export const useSearchUsers = (searchTerm: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
    queryFn: () => searchUsers(searchTerm),
    enabled: !!searchTerm,
  });
};

// User Hooks
export const useGetUserById = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (user: IUpdateUser) => updateUser(user),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID, data?.$id],
      });
    },
  });
};

export const useGetUserPosts = (userId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_POSTS, userId],
    queryFn: () => getUserPosts(userId),
    enabled: !!userId,
  });
};

// Comment Hooks
export const useCreateComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (comment: { postId: string; userId: string; text: string }) =>
      createComment({
        postId: comment.postId,
        userId: comment.userId,
        text: comment.text,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_COMMENTS_BY_POST],
      });
    },
  });
};

export const useLikeComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      commentId,
      userId,
    }: {
      commentId: string;
      userId: string;
    }) => {
      console.log(
        `Liking comment with ID: ${commentId} by user with ID: ${userId}`
      );
      return likeComment(commentId, userId);
    },
    onSuccess: (data) => {
      console.log(`Successfully liked comment. Data:`, data);
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_COMMENTS_BY_POST, data?.postId],
      });
    },
    onError: (error) => {
      console.log(`Error liking comment:`, error);
    },
  });
};

export const useUnlikeComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      commentId,
      userId,
    }: {
      commentId: string;
      userId: string;
    }) => unlikeComment(commentId, userId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_COMMENTS_BY_POST, data?.postId],
      });
    },
  });
};

export const useGetCommentsByPost = (postId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_COMMENTS_BY_POST, postId],
    queryFn: async (): Promise<{ documents: IComment[] }> => {
      const comments = await getCommentsByPost(postId);
      if (!comments || !comments.documents) {
        return { documents: [] };
      }
      const commentsWithUser = await Promise.all(
        comments.documents.map(async (comment) => {
          const user = await getUserById(comment.userId);
          return { ...comment, user } as IComment;
        })
      );
      return { ...comments, documents: commentsWithUser };
    },
    enabled: !!postId,
  });
};

export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentId: string) => deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_COMMENTS_BY_POST],
      });
    },
  });
};

// Reply Hooks
export const useCreateReply = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reply: { commentId: string; userId: string; text: string }) =>
      createReply(reply),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_REPLIES_BY_COMMENT],
      });
    },
  });
};

export const useGetRepliesByComment = (commentId: string) => {
  return useQuery<IReply[]>({
    queryKey: [QUERY_KEYS.GET_REPLIES_BY_COMMENT, commentId],
    queryFn: () => getRepliesByComment(commentId),
    enabled: !!commentId,
  });
};

export const useLikeReply = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ replyId, userId }: { replyId: string; userId: string }) =>
      likeReply(replyId, userId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_REPLIES_BY_COMMENT, data?.commentId],
      });
    },
  });
};

export const useUnlikeReply = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ replyId, userId }: { replyId: string; userId: string }) =>
      unlikeReply(replyId, userId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_REPLIES_BY_COMMENT, data?.commentId],
      });
    },
  });
};

export const useDeleteReply = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (replyId: string) => deleteReply(replyId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_REPLIES_BY_COMMENT],
      });
    },
  });
};

// Follow/Unfollow Hooks
export const useFollowUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      followerId,
      followeeId,
    }: {
      followerId: string;
      followeeId: string;
    }) => followUser({ followerId, followeeId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_FOLLOWEES],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_FOLLOWERS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS_FROM_FOLLOWED_USERS],
      });
    },
  });
};

export const useUnfollowUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      followerId,
      followeeId,
    }: {
      followerId: string;
      followeeId: string;
    }) => unfollowUser({ followerId, followeeId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_FOLLOWEES],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_FOLLOWERS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POSTS_FROM_FOLLOWED_USERS],
      });
    },
  });
};

// Query Hooks for Followers and Followees
export const useGetFollowers = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_FOLLOWERS, userId],
    queryFn: () => getFollowers(userId),
    enabled: !!userId,
  });
};

export const useGetFollowees = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_FOLLOWEES, userId],
    queryFn: () => getFollowees(userId),
    enabled: !!userId,
  });
};

export const useGetPostsFromFollowedUsers = (userId: string) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_POSTS_FROM_FOLLOWED_USERS, userId],
    queryFn: ({ pageParam = "" }) =>
      getPostsFromFollowedUsers(userId, pageParam),
    getNextPageParam: (lastPage) => {
      if (lastPage.documents.length === 0) return null;
      return lastPage.documents[lastPage.documents.length - 1].$id;
    },
    enabled: !!userId,
    initialPageParam: "",
  });
};

export const useGetPinnedPost = (postId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_PINNED_POST, postId],
    queryFn: () => getPinnedPost(postId),
    enabled: !!postId,
  });
};

// Query Hooks for Followers and Followees Details
export const useGetFollowersDetails = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_FOLLOWERS_DETAILS, userId],
    queryFn: () => getFollowersDetails(userId),
    enabled: !!userId,
  });
};

export const useGetFolloweesDetails = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_FOLLOWEES_DETAILS, userId],
    queryFn: () => getFolloweesDetails(userId),
    enabled: !!userId,
  });
};
