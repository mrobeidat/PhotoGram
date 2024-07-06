import { ID, Query } from "appwrite";
import { databases, appwriteConfig } from "./config";
import { checkAndHandleSession, handleLogout } from "./auth";
import { IReply } from "@/types";

export async function createReply(reply: {
  commentId: string;
  userId: string;
  text: string;
}) {
  try {
    const newReply = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.repliesCollectionId,
      ID.unique(),
      {
        commentId: reply.commentId,
        userId: reply.userId,
        text: reply.text,
        likes: [],
      }
    );
    return newReply;
  } catch (error) {
    console.error("Failed to create reply:", error);
    throw error;
  }
}

export async function getRepliesByComment(commentId: string): Promise<IReply[]> {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.repliesCollectionId,
      [Query.equal("commentId", commentId)]
    );

    const replies: IReply[] = response.documents.map(doc => ({
      $id: doc.$id,
      commentId: doc.commentId,
      userId: doc.userId,
      text: doc.text,
      likes: doc.likes,
      createdAt: doc.$createdAt,
      updatedAt: doc.$updatedAt,
      user: doc.user, // Ensure that the user property is included if available
    }));

    return replies;
  } catch (error) {
    console.error("Failed to retrieve replies:", error);
    throw error;
  }
}

export async function likeReply(replyId: string, userId: string) {
  try {
    const authenticated = await checkAndHandleSession();
    if (!authenticated) {
      await handleLogout();
      return;
    }
    const reply = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.repliesCollectionId,
      replyId
    );

    if (reply.likes.includes(userId)) {
      throw new Error("User has already liked this reply");
    }

    const updatedLikes = [...reply.likes, userId];

    const updatedReply = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.repliesCollectionId,
      replyId,
      {
        likes: updatedLikes,
      }
    );

    return updatedReply;
  } catch (error) {
    console.error("Failed to like reply:", error);
    throw error;
  }
}

export async function unlikeReply(replyId: string, userId: string) {
  try {
    const authenticated = await checkAndHandleSession();
    if (!authenticated) {
      await handleLogout();
      return;
    }
    const reply = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.repliesCollectionId,
      replyId
    );

    if (!reply.likes.includes(userId)) {
      throw new Error("User has not liked this reply");
    }

    const updatedLikes = reply.likes.filter((id: string) => id !== userId);

    const updatedReply = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.repliesCollectionId,
      replyId,
      {
        likes: updatedLikes,
      }
    );

    return updatedReply;
  } catch (error) {
    console.error("Failed to unlike reply:", error);
    throw error;
  }
}

export async function deleteReply(replyId: string) {
  try {
    const authenticated = await checkAndHandleSession();
    if (!authenticated) {
      await handleLogout();
      return;
    }
    const result = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.repliesCollectionId,
      replyId
    );
    return result;
  } catch (error) {
    console.error("Failed to delete reply:", error);
    throw error;
  }
}
