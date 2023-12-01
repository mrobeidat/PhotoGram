import { useToast } from "@/components/ui/use-toast";
import UsersLoader from "@/components/Shared/Loaders/UsersLoader";
import UserCard from "@/components/Shared/UserCard";
import { useGetUsers } from "@/lib/react-query/queriesAndMutations";

const AllUsers = () => {
  const { toast } = useToast();
  const { data: creators, isLoading, isError: isErrorCreators } = useGetUsers();

  if (isErrorCreators) {
    toast({ title: "Something went wrong." });
    return;
  }
  const TopCreator = import.meta.env.VITE_APPWRITE_TOP_CREATOR;
  let sortedCreators = creators?.documents || [];
  const YousefID = import.meta.env.VITE_APPWRITE_YOUSEF_USER_ID;

  // Find Yousef's card and move it to the beginning of the array
  const yousefIndex = sortedCreators.findIndex(
    (creator) => creator?.$id === YousefID && TopCreator
  );

  if (yousefIndex !== -1) {
    // Move Yousef's card to the beginning
    sortedCreators.unshift(sortedCreators.splice(yousefIndex, 1)[0]);
  }

  // Find the index of the TOP CREATOR card 
  const topCreatorIndex = sortedCreators.findIndex(
    (creator) => creator?.$id === TopCreator
  );

  if (topCreatorIndex !== -1) {
    // Move the TOP Creator card to the second position
    sortedCreators.splice(1, 0, sortedCreators.splice(topCreatorIndex, 1)[0]);
  }

  return (
    <div className="common-container">
      <div className="user-container">
        <h2 className="h3-bold md:h2-bold text-left w-full">All Users</h2>
        {isLoading && !creators ? (
          <div className="flex-center w-full h-full">
            <div className="flex flex-wrap">
              {[...Array(16)].map((_, index) => (
                <div key={index} className="w-1/4 p-2">
                  <div className="flex flex-col-center sm:flex-row resize-y">
                    <UsersLoader />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <ul className="user-grid">
            {sortedCreators.map((creator) => (
              <li key={creator?.$id} className="flex-1 min-w-[200px] w-full">
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
