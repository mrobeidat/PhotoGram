import { ID } from "appwrite";
import { storage, appwriteConfig } from "./config";
import { checkAndHandleSession, handleLogout } from "./auth";

export async function uploadFile(file: File) {
  try {
    const authenticated = await checkAndHandleSession();
    if (!authenticated) {
      await handleLogout();
      return;
    }
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    );

    return uploadedFile;
  } catch (error) {
    throw Error;
  }
}

export function getFilePreview(fileId: string) {
  try {
    const fileUrl = storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      2000,
      2000,
      "top",
      100
    );

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    throw Error;
  }
}

export async function deleteFile(fileId: string) {
  try {
    const authenticated = await checkAndHandleSession();
    if (!authenticated) {
      await handleLogout();
      return;
    }
    storage.deleteFile(appwriteConfig.storageId, fileId);

    return { status: "ok" };
  } catch (error) {
    throw Error;
    throw error;
  }
}
