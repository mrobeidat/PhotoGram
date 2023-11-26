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
  return (
    <div className="common-container">
      <div className="user-container">
        <h2 className="h3-bold md:h2-bold text-left w-full">All Users</h2>
        {isLoading && !creators ? (
          <div className="flex-center w-full h-full">
            <div className="flex flex-col-center sm:flex-row resize-y">
              <UsersLoader />
            </div>
          </div>
        ) : (
          <ul className="user-grid">
            {creators?.documents.map((creator) => (
              <li key={creator?.$id} className="flex-1 min-w-[200px] w-full  ">
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
