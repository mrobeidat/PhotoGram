import { useToast } from "@/components/ui/use-toast";
import UserCard from "@/components/Shared/UserCard";
import SkeletonUserCard from "@/components/Shared/Loaders/SkeletonUserCard";
import { useGetUsers } from "@/lib/react-query/queriesAndMutations";
import { useMemo } from "react";

const AllUsers = () => {
  const { toast } = useToast();
  const { data: creators, isLoading, isError: isErrorCreators } = useGetUsers();

  if (isErrorCreators) {
    toast({ title: "Something went wrong." });
    return;
  }

  const TopCreator = import.meta.env.VITE_APPWRITE_TOP_CREATOR;
  const YousefID = import.meta.env.VITE_APPWRITE_YOUSEF_USER_ID;

  let sortedCreators = creators?.documents || [];

  const indices = useMemo(() => {
    const yousefIndex = sortedCreators.findIndex(
      (creator) => creator?.$id === YousefID
    );
    const topCreatorIndex = sortedCreators.findIndex(
      (creator) => creator?.$id === TopCreator
    );
    return { yousefIndex, topCreatorIndex };
  }, [sortedCreators, YousefID, TopCreator]);

  const newSortedCreators = [];

  if (indices.yousefIndex !== -1) {
    newSortedCreators.push(sortedCreators[indices.yousefIndex]);
  }

  if (indices.topCreatorIndex !== -1) {
    newSortedCreators.push(sortedCreators[indices.topCreatorIndex]);
  }

  newSortedCreators.push(
    ...sortedCreators.filter(
      (_, index) =>
        index !== indices.yousefIndex && index !== indices.topCreatorIndex
    )
  );

  return (
    <div className="common-container">
      <div className="user-container">
        <h2 className="h3-bold md:h2-bold text-left w-full">All Users</h2>
        {isLoading && !creators ? (
          <div className="flex justify-center w-full h-full">
            <div className="flex flex-wrap">
              {[...Array(9)].map((_, index) => (
                <div key={index} className="w-full sm:w-1/2 md:w-1/3 p-2">
                  <SkeletonUserCard />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <ul className="flex flex-wrap">
            {newSortedCreators.map((creator) => (
              <li key={creator?.$id} className="w-full sm:w-1/2 md:w-1/3 p-2">
                <UserCard user={creator} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AllUsers;
