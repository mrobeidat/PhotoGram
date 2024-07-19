import { Models } from "appwrite";
import SavedPostsList from "@/components/Shared/SavedPostsList";
import { useGetCurrentUser } from "@/lib/react-query/queriesAndMutations";
import SkeletonSavedPost from "@/components/Shared/Loaders/SkeletonSavedPost";

const Saved = () => {
  const { data: currentUser } = useGetCurrentUser();

  const savePosts = currentUser?.save
    .map((savePost: Models.Document) => ({
      ...savePost.post,
      creator: {
        imageUrl: currentUser.imageUrl,
      },
    }))
    .reverse();

  return (
    <div className="saved-container">
      <div className="flex gap-2 w-full max-w-5xl">
        <img
          src="/assets/icons/save.svg"
          width={36}
          height={36}
          alt="edit"
          className="invert-white"
        />
        <h2 className="h3-bold md:h2-bold text-left w-full">Saved Posts</h2>
      </div>

      <div className="flex flex-wrap">
        {!currentUser ? (
          [...Array(6)].map((_, index) => (
            <div key={index} className="w-full sm:w-1/2 lg:w-1/3 p-2">
              <SkeletonSavedPost />
            </div>
          ))
        ) : (
          <ul className="w-full flex justify-center max-w-5xl gap-9">
            {savePosts.length === 0 ? (
              <p className="text-light-4">You haven't saved any posts yet</p>
            ) : (
              <SavedPostsList posts={savePosts} showStats={false} />
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Saved;
