import { ID, Query } from "appwrite";
import { databases, appwriteConfig } from "./config";

export async function followUser({
  followerId,
  followeeId,
}: {
  followerId: string;
  followeeId: string;
}) {
  try {
    const follow = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.followCollectionId,
      ID.unique(),
      {
        followerId,
        followeeId,
      }
    );

    return follow;
  } catch (error) {
    console.log("Failed to follow user:", error);
    throw error;
  }
}

export async function unfollowUser({
  followerId,
  followeeId,
}: {
  followerId: string;
  followeeId: string;
}) {
  try {
    const follows = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.followCollectionId,
      [
        Query.equal("followerId", followerId),
        Query.equal("followeeId", followeeId),
      ]
    );

    if (follows.documents.length > 0) {
      const followId = follows.documents[0].$id;
      await databases.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.followCollectionId,
        followId
      );
    }

    return;
  } catch (error) {
    console.log("Failed to unfollow user:", error);
    throw error;
  }
}

export async function getFollowers(userId: string) {
  try {
    const followers = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.followCollectionId,
      [Query.equal("followeeId", userId)]
    );

    if (!followers) throw Error("Failed to get followers");

    return followers.documents;
  } catch (error) {
    console.log("Failed to get followers:", error);
    throw error;
  }
}

export async function getFollowees(userId: string) {
  try {
    const followees = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.followCollectionId,
      [Query.equal("followerId", userId)]
    );

    if (!followees) throw Error("Failed to get followees");

    return followees.documents;
  } catch (error) {
    console.log("Failed to get followees:", error);
    throw error;
  }
}

export async function getPostsFromFollowedUsers(
  userId: string,
  pageParam = ""
) {
  try {
    const follows = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.followCollectionId,
      [Query.equal("followerId", userId)]
    );

    if (follows.total === 0) {
      return { documents: [] };
    }

    const followeeIds = follows.documents.map((doc) => doc.followeeId);

    // Fetch posts from followed users
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [
        Query.equal("creator", followeeIds),
        Query.orderDesc("$createdAt"),
        Query.limit(5),
        ...(pageParam ? [Query.cursorAfter(pageParam)] : []),
      ]
    );

    return posts;
  } catch (error) {
    console.error("Failed to get posts from followed users:", error);
    throw error;
  }
}


// New functions to fetch user details by IDs
async function getUsersByIds(userIds: string[]) {
  try {
    const users = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("$id", userIds)]
    );

    return users.documents;
  } catch (error) {
    console.error("Failed to fetch user details:", error);
    throw error;
  }
}

export async function getFollowersDetails(userId: string) {
  try {
    const followers = await getFollowers(userId);
    const followerIds = followers.map((follower) => follower.followerId);
    const followerDetails = await getUsersByIds(followerIds);

    return followerDetails;
  } catch (error) {
    console.error("Failed to get follower details:", error);
    throw error;
  }
}

export async function getFolloweesDetails(userId: string) {
  try {
    const followees = await getFollowees(userId);
    const followeeIds = followees.map((followee) => followee.followeeId);
    const followeeDetails = await getUsersByIds(followeeIds);

    return followeeDetails;
  } catch (error) {
    console.error("Failed to get followee details:", error);
    throw error;
  }
}