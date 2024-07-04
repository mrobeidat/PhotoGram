import { ID, Query } from 'appwrite'
import { INewPost, INewUser, IUpdatePost, IUpdateUser } from "@/types";
import { account, appwriteConfig, avatars, databases, storage } from "./config";

export async function createUserAccount(user: INewUser) {
    try {
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name
        )

        if (!newAccount) throw Error("Account creation failed"
        )

        const avatarUrl = avatars.getInitials(user.name)
        const newUser = await saveUserToDB({
            accountId: newAccount.$id,
            name: newAccount.name,
            email: newAccount.email,
            username: user.username,
            imageUrl: avatarUrl,
        })

        return newUser;
    }

    catch (error) {
        console.log(error);
        return error
    }

}

export async function saveUserToDB(user: {

    accountId: string,
    email: string,
    name: string,
    imageUrl: URL,
    username?: string,


}) {
    try {
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            user
        )
        return newUser
    }
    catch (error) {
        console.log(error);
    }

}

async function logoutAllSessions() {
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


export async function SignInAccount(user: { email: string, password: string }) {
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

export async function getCurrentUser() {
    try {
        const authenticated = await checkAndHandleSession();
        if (!authenticated) return;

        const currentAccount = await account.get()

        if (!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)],
        )

        if (!currentUser) throw Error;

        return currentUser.documents[0]
    }
    catch (error) {
        console.log(error);
    }
}

export async function SignOutAccount() {
    try {
        const session = await account.deleteSession('current')
        return session
    }
    catch (error) {
        console.log(error);
    }
}

async function checkAndHandleSession() {
    try {
        const session = await account.get();
        return session.$id ? true : false;
    } catch (error) {
        await handleLogout();
        return false;
    }
}

async function handleLogout() {
    try {
        await account.deleteSession('current');

        localStorage.removeItem('userToken');
        localStorage.removeItem('userProfile');
        localStorage.clear();

        // Redirect to login page
        window.location.href = '/sign-in';
    } catch (error) {
        console.log('Failed to log out:', error);
        // If session deletion fails, clear local storage and redirect to login page
        localStorage.removeItem('userToken');
        localStorage.removeItem('userProfile');
        localStorage.clear();
        window.location.href = '/sign-in';
    }
}


// ============================== CREATE POST

export async function createPost(post: INewPost) {
    try {
        const authenticated = await checkAndHandleSession();
        if (!authenticated) return;

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

// ============================== UPLOAD FILE
export async function uploadFile(file: File) {
    try {
        const authenticated = await checkAndHandleSession();
        if (!authenticated) return;

        const uploadedFile = await storage.createFile(
            appwriteConfig.storageId,
            ID.unique(),
            file
        );

        return uploadedFile;
    } catch (error) {
        console.log(error);
    }
}

// ============================== GET FILE URL
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
        console.log(error);
    }
}
export async function deleteFile(fileId: string) {
    try {
        const authenticated = await checkAndHandleSession();
        if (!authenticated) return;
        // Initiating the deletion in the background
        storage.deleteFile(appwriteConfig.storageId, fileId);

        // Returning a response immediately
        return { status: 'ok' };
    } catch (error) {
        console.error(error);
        // You might want to throw the error to propagate it or handle it accordingly
        throw error;
    }
}


export async function updatePost(post: IUpdatePost) {
    const hasFileToUpdate = post.file.length > 0;
    try {
        const authenticated = await checkAndHandleSession();
        if (!authenticated) return;

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
                updated: true
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

// ============================== GET HOME POSTS
export async function getRecentPosts() {
    try {
        const authenticated = await checkAndHandleSession();
        if (!authenticated) return;
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
        if (!authenticated) return;
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
        if (!authenticated) return;

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
        if (!authenticated) return;

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
        if (!authenticated) return;

        const post = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId
        )

        if (!post) throw Error;

        return post;
    }
    catch (error) {
        console.log(error);
    }
}



export async function deletePost(postId: string, imageId: string) {
    if (!postId || !imageId) throw Error;

    try {
        const authenticated = await checkAndHandleSession();
        if (!authenticated) return;

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


export async function getInfinitePosts({ pageParam }: { pageParam: number }) {
    const authenticated = await checkAndHandleSession();
    if (!authenticated) return;

    const queries: any[] = [Query.orderDesc('$updatedAt'), Query.limit(10)]

    if (pageParam) {
        queries.push(Query.cursorAfter(pageParam.toString()))
    }
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            queries
        )
        if (!posts) throw Error
        return posts
    } catch (error) {
        console.log(error);

    }
}

export async function searchPosts(searchTerm: string) {
    try {
        const authenticated = await checkAndHandleSession();
        if (!authenticated) return;

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
        console.log(error);
    }
}

export async function updateUser(user: IUpdateUser) {
    const hasFileToUpdate = user.file.length > 0;
    try {
        const authenticated = await checkAndHandleSession();
        if (!authenticated) return;

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
        console.log(error);
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

// ============================== Comments
export async function createComment(comment: { postId: string; userId: string; text: string }) {
    try {
        const newComment = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.commentsCollectionId,
            ID.unique(),
            {
                postId: comment.postId,
                userId: comment.userId,
                text: comment.text,
                likes: [], // Initialize the likes field as an empty array
            }
        );
        return newComment;
    } catch (error) {
        console.error('Failed to create comment:', error);
        throw error;
    }
}


export async function likeComment(commentId: string, userId: string) {
    try {
        const authenticated = await checkAndHandleSession();
        if (!authenticated) return;

        // Fetch the current comment document
        const comment = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.commentsCollectionId,
            commentId
        );

        // Check if the user has already liked the comment
        if (comment.likes.includes(userId)) {
            throw new Error('User has already liked this comment');
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
        console.error('Failed to like comment:', error);
        throw error;
    }
}


export async function unlikeComment(commentId: string, userId: string) {
    try {
        const authenticated = await checkAndHandleSession();
        if (!authenticated) return;

        // Fetch the current comment document
        const comment = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.commentsCollectionId,
            commentId
        );

        // Check if the user has not liked the comment yet
        if (!comment.likes.includes(userId)) {
            throw new Error('User has not liked this comment');
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
        console.error('Failed to unlike comment:', error);
        throw error;
    }
}



export async function getCommentsByPost(postId: string) {
    try {
        const authenticated = await checkAndHandleSession();
        if (!authenticated) return;

        const comments = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.commentsCollectionId,
            [Query.equal('postId', postId)]
        );
        return comments;
    } catch (error) {
        console.error('Failed to retrieve comments:', error);
        throw error;
    }
}


export async function deleteComment(commentId: string) {
    try {
        const authenticated = await checkAndHandleSession();
        if (!authenticated) return;

        const result = await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.commentsCollectionId,
            commentId
        );
        return result;
    } catch (error) {
        console.error('Failed to delete comment:', error);
        throw error;
    }
}