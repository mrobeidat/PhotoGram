import LikedPostsList from "@/components/Shared/LikedPosts";
import ExploreLoader from "@/components/Shared/Loaders/ExploreLoader";
import { useGetCurrentUser } from "@/lib/react-query/queriesAndMutations";

const LikedPosts = () => {
  const { data: currentUser } = useGetCurrentUser();

  if (!currentUser)
    return (
      <div className="flex-center w-full h-full">
        <div className="flex flex-col sm:flex-row resize-y">
          <ExploreLoader />
          <ExploreLoader />
          <ExploreLoader />
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
