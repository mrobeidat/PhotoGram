import { ID } from "appwrite";
import { account, appwriteConfig, avatars, databases } from "./config";
import { INewUser } from "@/types";

export async function createUserAccount(user: INewUser) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );

    if (!newAccount) throw Error("Account creation failed");

    const avatarUrl = avatars.getInitials(user.name);
    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
      username: user.username,
      imageUrl: avatarUrl,
    });

    return newUser;
  } catch (error) {
    console.log(error);
    return error;
  }
}

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
    console.log(error);
    throw error;
  }
}

export async function logoutAllSessions() {
  try {
    const sessions = await account.listSessions();
    for (const session of sessions.sessions) {
      await account.deleteSession(session.$id);
    }
  } catch (error) {
    console.log(error);
  }
}

export async function checkActiveSession() {
  try {
    const sessions = await account.listSessions();
    return sessions.total > 0;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function SignInAccount(user: { email: string; password: string }) {
  try {
    const activeSession = await checkActiveSession();
    if (activeSession) {
      await logoutAllSessions();
    }

    const session = await account.createEmailSession(user.email, user.password);
    return session;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function SignOutAccount() {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    console.log(error);
  }
}

export async function checkAndHandleSession() {
  try {
    const session = await account.get();
    return session.$id ? true : false;
  } catch (error) {
    await handleLogout();
    return false;
  }
}

export async function handleLogout() {
  try {
    await account.deleteSession("current");
    localStorage.removeItem("userToken");
    localStorage.removeItem("userProfile");
    localStorage.clear();
  } catch (error) {
    console.log("Failed to log out:", error);
    localStorage.removeItem("userToken");
    localStorage.removeItem("userProfile");
  }
}
