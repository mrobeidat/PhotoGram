import { ID, Query } from "appwrite";
import { databases, appwriteConfig } from "./config";
import { uploadFile, deleteFile, getFilePreview } from "./file";
import { checkAndHandleSession, handleLogout } from "./auth";
import { INewPost, IUpdatePost } from "@/types";

export async function createPost(post: INewPost) {
  try {
    const authenticated = await checkAndHandleSession();
    if (!authenticated) {
      await handleLogout();
      return;
    }

    const uploadedFile = await uploadFile(post.file[0]);
    if (!uploadedFile) throw Error;

    const fileUrl = getFilePreview(uploadedFile.$id);
    if (!fileUrl) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    const tags = post.tags?.replace(/ /g, "").split(",") || [];
    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imageUrl: fileUrl,
        imageId: uploadedFile.$id,
        location: post.location,
        tags: tags,
      }
    );

    if (!newPost) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    return newPost;
  } catch (error) {
    console.log(error);
  }
}

export async function updatePost(post: IUpdatePost) {
  const hasFileToUpdate = post.file.length > 0;
  try {
    const authenticated = await checkAndHandleSession();
    if (!authenticated) {
      await handleLogout();
      return;
    }
    let image = {
      imageUrl: post.imageUrl,
      imageId: post.imageId,
    };

    if (hasFileToUpdate) {
      const uploadedFile = await uploadFile(post.file[0]);
      if (!uploadedFile) throw Error;

      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }

      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
    }

    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      post.postId,
      {
        caption: post.caption,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
        location: post.location,
        tags: tags,
        updated: true,
      }
    );

    if (!updatedPost) {
      if (hasFileToUpdate) {
        await deleteFile(image.imageId);
      }

      throw Error;
    }

    if (hasFileToUpdate) {
      await deleteFile(post.imageId);
    }

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}

export async function getRecentPosts() {
  try {
    const authenticated = await checkAndHandleSession();
    if (!authenticated) {
      await handleLogout();
      return;
    }
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(1000)]
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}

export async function likePost(postId: string, likesArray: string[]) {
  try {
    const authenticated = await checkAndHandleSession();
    if (!authenticated) {
      await handleLogout();
      return;
    }
    const likedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
      {
        likes: likesArray,
      }
    );

    if (!likedPost) throw Error;

    return likedPost;
  } catch (error) {
    console.log(error);
  }
}

export async function savePost(postId: string, userId: string) {
  try {
    const authenticated = await checkAndHandleSession();
    if (!authenticated) {
      await handleLogout();
      return;
    }
    const updatedPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      ID.unique(),
      {
        user: userId,
        post: postId,
      }
    );

    if (!updatedPost) throw Error;

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteSavedPost(savedRecordId: string) {
  try {
    const authenticated = await checkAndHandleSession();
    if (!authenticated) {
      await handleLogout();
      return;
    }
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      savedRecordId
    );

    if (!statusCode) throw Error;
    return statusCode;
  } catch (error) {
    console.log(error);
  }
}

export async function getPostById(postId: string) {
  try {
    const authenticated = await checkAndHandleSession();
    if (!authenticated) {
      await handleLogout();
      return;
    }
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    );

    if (!post) throw Error;

    return post;
  } catch (error) {
    console.log(error);
  }
}

export async function deletePost(postId: string, imageId: string) {
  if (!postId || !imageId) throw Error;

  try {
    const authenticated = await checkAndHandleSession();
    if (!authenticated) {
      await handleLogout();
      return;
    }
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    );

    if (!statusCode) throw Error;
    return statusCode;
  } catch (error) {
    console.log(error);
  }
}

export async function getInfinitePosts({ pageParam }: { pageParam?: string }) {
  try {
    const authenticated = await checkAndHandleSession();
    if (!authenticated) {
      await handleLogout();
      return;
    }

    const queries: any[] = [Query.orderDesc("$createdAt"), Query.limit(5)];

    if (pageParam) {
      queries.push(Query.cursorAfter(pageParam));
    }

    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      queries
    );

    if (!posts) throw Error;

    console.log(`Fetched ${posts.documents.length} posts`);
    console.log("Fetched posts:", posts.documents);

    return {
      data: posts.documents,
      nextCursor: posts.documents.length
        ? posts.documents[posts.documents.length - 1].$id
        : null,
    };
  } catch (error) {
    console.log(error);
  }
}

export async function searchPosts(searchTerm: string) {
  try {
    const authenticated = await checkAndHandleSession();
    if (!authenticated) {
      await handleLogout();
      return;
    }
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.search("caption", searchTerm)]
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}

export async function getUserPosts(userId?: string) {
  if (!userId) return;

  try {
    const post = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.equal("creator", userId), Query.orderDesc("$createdAt")]
    );

    if (!post) throw Error;

    return post;
  } catch (error) {
    console.log(error);
  }
}

export async function getPinnedPost(postId: string) {
  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    );
    return post;
  } catch (error) {
    console.error("Failed to get pinned post:", error);
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

export async function sharePost(postId: string, userId: string) {
  try {
    const authenticated = await checkAndHandleSession();
    if (!authenticated) {
      await handleLogout();
      return;
    }

    const originalPost = await getPostById(postId);
    if (!originalPost) throw Error;

    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      ID.unique(),
      {
        creator: userId,
        caption: originalPost.caption,
        imageUrl: originalPost.imageUrl,
        imageId: originalPost.imageId,
        location: originalPost.location,
        tags: originalPost.tags,
        sharedPostId: postId,
        sharedAt: new Date().toISOString(),
      }
    );

    if (!newPost) throw Error;

    return newPost;
  } catch (error) {
    console.log(error);
  }
}

