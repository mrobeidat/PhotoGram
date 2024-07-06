import LikedPostsList from "@/components/Shared/LikedPosts";
import Loader from "@/components/Shared/Loader";
import { useGetCurrentUser } from "@/lib/react-query/queriesAndMutations";

const LikedPosts = () => {
  const { data: currentUser } = useGetCurrentUser();

  if (!currentUser)
    return (
      <div className="flex-center w-full h-full">
        <div className="flex flex-col sm:flex-row resize-y">
          <Loader />
        </div>
      </div>
    );

  return (
    <>
      {currentUser.liked.length === 0 && (
        <p className="text-light-4">No liked posts</p>
      )}

      <LikedPostsList posts={currentUser.liked} showStats={false} />
    </>
  );
};

export default LikedPosts;
