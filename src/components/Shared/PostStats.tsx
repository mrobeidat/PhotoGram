import { useDeleteSavedPost, useGetCurrentUser, useLikePost, useSavePost } from "@/lib/react-query/queriesAndMutations"
import { checkIsLiked } from "@/lib/utils"
import { Models } from "appwrite"
import React, { useEffect, useState } from "react"
// import Loader from "./Loader"
import 'primeicons/primeicons.css';

type postStatsPorps = {
  post?: Models.Document,
  userId: string

}
const PostStats = ({ post, userId }: postStatsPorps) => {
  const likesList = post?.likes.map((user: Models.Document) => user.$id)

  const [likes, setLikes] = useState(likesList)
  const [isSaved, setIsSaved] = useState(false)

  const { mutate: likePost } = useLikePost()
  const { mutate: savePost, isPending: isSavingPost } = useSavePost()
  const { mutate: deleteSavedPost, isPending: isDeletingPost } = useDeleteSavedPost()

  const { data: currentUser } = useGetCurrentUser()

  const savedPostRecord = currentUser?.save?.find((record: Models.Document) => record.post.$id === post?.$id)

  useEffect(() => {
    setIsSaved(!!savedPostRecord)
  }, [currentUser])

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault()

    let newLikes = [...likes]

    const hasLiked = newLikes.includes(userId)

    if (hasLiked) {
      newLikes = newLikes.filter((id) => id !== userId)
    } else {
      newLikes.push(userId)
    }
    setLikes(newLikes)
    likePost({ postId: post?.$id || "", likesArray: newLikes })
  }

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation()

    if (savedPostRecord) {
      setIsSaved(false)
      deleteSavedPost(savedPostRecord.$id)
    } else {
      savePost({ postId: post?.$id || "", userId })
      setIsSaved(true)
    }

  }

  return (
    <div className="flex justify-between items-center z-20">
      <div className="flex gap-2 mr-5">
        <i
          className={`pi ${checkIsLiked(likes, userId) ? 'pi-heart-fill' : 'pi-heart'} cursor-pointer`}
          style={{ color: '#ff0000', fontSize: '20px' }}
          onClick={handleLike}
        ></i>
        <p className="small-medium lg:base-medium">{likes.length}</p>
      </div>

      <div className="flex gap-2">
        {isSavingPost || isDeletingPost ? (
          <span className="general-loader"></span>
        ) : (
          <>
            {isSaved ? (
              <i
                className="pi pi-bookmark-fill cursor-pointer"
                style={{
                  fontSize: '20px',
                  backgroundImage: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  transition: 'background-position 0.5s',
                }}
                onClick={handleSave}
              ></i>
            ) : (
              <i
                className="pi pi-bookmark cursor-pointer"
                style={{
                  fontSize: '20px',
                  backgroundImage: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  transition: 'background-position 0.5s',
                }}
                onClick={handleSave}
              ></i>
            )}
          </>
        )}

      </div>
    </div >
  )
}

export default PostStats