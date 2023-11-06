import { Client, Account, Databases, Storage, Avatars } from 'appwrite';

export const appwriteConfig = {
    project_id: import.meta.env.VITE_APPWRITE_PROJECT_ID,
    url: import.meta.env.VITE_APPWRITE_URL,
}

export const client = new Client();

client
    .setProject(appwriteConfig.project_id)
    .setEndpoint(appwriteConfig.url)

export const account = new Account(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);
export const databases = new Databases(client);

