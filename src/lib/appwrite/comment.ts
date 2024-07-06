import { ID, Query } from "appwrite";
import { databases, appwriteConfig } from "./config";
import { checkAndHandleSession, handleLogout } from "./auth";

export async function createComment(comment: {
  postId: string;
  userId: string;
  text: string;
}) {
  try {
    const newComment = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.commentsCollectionId,
      ID.unique(),
      {
        postId: comment.postId,
        userId: comment.userId,
        text: comment.text,
        likes: [],
      }
    );
    return newComment;
  } catch (error) {
    console.error("Failed to create comment:", error);
    throw error;
  }
}

export async function likeComment(commentId: string, userId: string) {
  try {
    const authenticated = await checkAndHandleSession();
    if (!authenticated) {
      await handleLogout();
      return;
    }
    // Fetch the current comment document
    const comment = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.commentsCollectionId,
      commentId
    );

    // Check if the user has already liked the comment
    if (comment.likes.includes(userId)) {
      throw new Error("User has already liked this comment");
    }

    // Add the user ID to the likes array
    const updatedLikes = [...comment.likes, userId];

    // Update the comment document with the new likes array
    const updatedComment = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.commentsCollectionId,
      commentId,
      {
        likes: updatedLikes,
      }
    );

    return updatedComment;
  } catch (error) {
    console.error("Failed to like comment:", error);
    throw error;
  }
}

export async function unlikeComment(commentId: string, userId: string) {
  try {
    const authenticated = await checkAndHandleSession();
    if (!authenticated) {
      await handleLogout();
      return;
    }
    // Fetch the current comment document
    const comment = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.commentsCollectionId,
      commentId
    );

    // Check if the user has not liked the comment yet
    if (!comment.likes.includes(userId)) {
      throw new Error("User has not liked this comment");
    }

    // Remove the user ID from the likes array
    const updatedLikes = comment.likes.filter((id: string) => id !== userId);

    // Update the comment document with the new likes array
    const updatedComment = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.commentsCollectionId,
      commentId,
      {
        likes: updatedLikes,
      }
    );

    return updatedComment;
  } catch (error) {
    console.error("Failed to unlike comment:", error);
    throw error;
  }
}

export async function getCommentsByPost(postId: string) {
  try {
    const authenticated = await checkAndHandleSession();
    if (!authenticated) {
      await handleLogout();
      return;
    }
    const comments = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.commentsCollectionId,
      [Query.equal("postId", postId)]
    );
    return comments;
  } catch (error) {
    console.error("Failed to retrieve comments:", error);
    throw error;
  }
}

export async function deleteComment(commentId: string) {
  try {
    const authenticated = await checkAndHandleSession();
    if (!authenticated) {
      await handleLogout();
      return;
    }
    const result = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.commentsCollectionId,
      commentId
    );
    return result;
  } catch (error) {
    console.error("Failed to delete comment:", error);
    throw error;
  }
}
