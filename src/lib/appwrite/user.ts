import { ID, Query } from "appwrite";
import { databases, appwriteConfig, account } from "./config";
import { checkAndHandleSession, handleLogout } from "./auth";
import { IUpdateUser } from "@/types";
import { deleteFile, getFilePreview, uploadFile } from "./file";

export async function saveUserToDB(user: {
  accountId: string;
  email: string;
  name: string;
  imageUrl: URL;
  username?: string;
}) {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user
    );
    return newUser;
  } catch (error) {
    throw Error;
  }
}

export async function getCurrentUser() {
  try {
    const authenticated = await checkAndHandleSession();
    if (!authenticated) {
      await handleLogout();
      return;
    }
    const currentAccount = await account.get();

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    throw Error;
  }
}

export async function updateUser(user: IUpdateUser) {
  const hasFileToUpdate = user.file.length > 0;
  try {
    const authenticated = await checkAndHandleSession();
    if (!authenticated) {
      await handleLogout();
      return;
    }
    let image = {
      imageUrl: user.imageUrl,
      imageId: user.imageId,
    };

    if (hasFileToUpdate) {
      // Upload new file to appwrite storage
      const uploadedFile = await uploadFile(user.file[0]);
      if (!uploadedFile) throw Error;

      // Get new file url
      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }

      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
    }

    //  Update user
    const updatedUser = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      user.userId,
      {
        name: user.name,
        bio: user.bio,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
      }
    );

    // Failed to update
    if (!updatedUser) {
      // Delete new file that has been recently uploaded
      if (hasFileToUpdate) {
        await deleteFile(image.imageId);
      }
      // If no new file uploaded, just throw error
      throw Error;
    }

    // Safely delete old file after successful update
    if (user.imageId && hasFileToUpdate) {
      await deleteFile(user.imageId);
    }

    return updatedUser;
  } catch (error) {
    throw Error;
  }
}

export async function getUsers(limit?: number) {
  const queries: any[] = [Query.orderDesc("$createdAt")];

  if (limit) {
    queries.push(Query.limit(1000));
  }

  try {
    const users = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      queries
    );

    if (!users) throw Error;

    return users;
  } catch (error) {
    throw Error;
  }
}

export async function getUserById(userId: string) {
  try {
    const user = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId
    );

    if (!user) throw Error;

    return user;
  } catch (error) {
    return null;
  }
}

export async function getInfiniteUsers({ pageParam }: { pageParam?: string }) {
  try {
    const authenticated = await checkAndHandleSession();
    if (!authenticated) {
      await handleLogout();
      return;
    }

    const queries: any[] = [Query.orderDesc("$createdAt"), Query.limit(10)];

    if (pageParam) {
      queries.push(Query.cursorAfter(pageParam));
    }

    const users = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      queries
    );

    if (!users) throw Error;

    return {
      data: users.documents,
      nextCursor: users.documents.length
        ? users.documents[users.documents.length - 1].$id
        : null,
    };
  } catch (error) {
    throw error;
  }
}

export async function searchUsers(searchTerm: string) {
  try {
    const authenticated = await checkAndHandleSession();
    if (!authenticated) {
      await handleLogout();
      return;
    }
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.search("name", searchTerm)]
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    throw error;
  }
}
