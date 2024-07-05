import { useToast } from "@/components/ui/use-toast";
import UsersLoader from "@/components/Shared/Loaders/UsersLoader";
import UserCard from "@/components/Shared/UserCard";
import { useGetUsers } from "@/lib/react-query/queriesAndMutations";
import { useEffect, useMemo } from "react";
import { useUserContext } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const AllUsers = () => {
  const navigate = useNavigate();
  const { checkAuthUser } = useUserContext();

  useEffect(() => {
    const verifyAuth = async () => {
      const isValid = await checkAuthUser();
      if (!isValid) {
        navigate("/sign-in");
      }
    };

    verifyAuth();
  }, [checkAuthUser, navigate]);
  
  const { toast } = useToast();
  const { data: creators, isLoading, isError: isErrorCreators } = useGetUsers();

  if (isErrorCreators) {
    toast({ title: "Something went wrong." });
    return;
  }

  const TopCreator = import.meta.env.VITE_APPWRITE_TOP_CREATOR;
  const YousefID = import.meta.env.VITE_APPWRITE_YOUSEF_USER_ID;

  let sortedCreators = creators?.documents || [];

  // Memoize indices using useMemo
  const indices = useMemo(() => {
    const yousefIndex = sortedCreators.findIndex(
      (creator) => creator?.$id === YousefID
    );
    const topCreatorIndex = sortedCreators.findIndex(
      (creator) => creator?.$id === TopCreator
    );
    return { yousefIndex, topCreatorIndex };
  }, [sortedCreators, YousefID, TopCreator]);

  // Create a new array with the desired order
  const newSortedCreators = [];

  if (indices.yousefIndex !== -1) {
    // Add Yousef's card to the new array
    newSortedCreators.push(sortedCreators[indices.yousefIndex]);
  }

  if (indices.topCreatorIndex !== -1) {
    // Add TOP Creator's card to the new array
    newSortedCreators.push(sortedCreators[indices.topCreatorIndex]);
  }

  // Add the remaining cards to the new array
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
            {newSortedCreators.map((creator) => (
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
