import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import useDebounce from "@/hooks/useDebounce";
import { useToast } from "@/components/ui/use-toast";
import UserCard from "@/components/Shared/UserCard";
import SkeletonUserCard from "@/components/Shared/Loaders/SkeletonUserCard";
import {
  useGetUsers,
  useSearchUsers,
} from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";
import { useInView } from "react-intersection-observer";

const AllUsers = () => {
  const { toast } = useToast();
  const { user: currentUser } = useUserContext();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const {
    data: usersData,
    isLoading: isLoadingUsers,
    isError: isErrorUsers,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetUsers();

  const {
    data: searchData,
    isLoading: isLoadingSearch,
    isError: isErrorSearch,
  } = useSearchUsers(debouncedSearchTerm);

  const observer = useRef<IntersectionObserver | null>(null);

  const { inView } = useInView();

  const lastUserRef = useCallback(
    (node: HTMLElement | null) => {
      if (isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage]
  );

  useEffect(() => {
    if (inView && !debouncedSearchTerm) {
      fetchNextPage();
    }
  }, [inView, debouncedSearchTerm, fetchNextPage]);

  if (isErrorUsers || isErrorSearch) {
    toast({ title: "Something went wrong." });
    return null;
  }

  const users = useMemo(() => {
    const allUsers = usersData?.pages.flatMap((page) => page?.data ?? []) || [];
    return allUsers.filter((user) => user.$id !== currentUser.id);
  }, [usersData, currentUser.id]);

  const searchResults = useMemo(() => {
    const searchUsers = searchData?.documents || [];
    return searchUsers.filter((user) => user.$id !== currentUser.id);
  }, [searchData, currentUser.id]);

  const displayUsers = debouncedSearchTerm ? searchResults : users;

  return (
    <div className="common-container">
      <div className="user-container">
        <h2 className="h3-bold md:h2-bold text-left w-full">All Users</h2>
        <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4 glassmorphism-search">
          <img
            src="/assets/icons/search.svg"
            width={24}
            height={24}
            alt="search"
          />
          <input
            type="text"
            placeholder="Search for a user"
            className="glassmorphism-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {(isLoadingUsers || isLoadingSearch) && !displayUsers.length ? (
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
            {displayUsers.map((user, index) => {
              if (index === displayUsers.length - 1) {
                return (
                  <li
                    ref={lastUserRef}
                    key={user?.$id}
                    className="user-card-item w-full sm:w-1/2 md:w-1/3 p-2"
                  >
                    <UserCard user={user} />
                  </li>
                );
              } else {
                return (
                  <li
                    key={user?.$id}
                    className="user-card-item w-full sm:w-1/2 md:w-1/3 p-2"
                  >
                    <UserCard user={user} />
                  </li>
                );
              }
            })}
          </ul>
        )}
        {isFetchingNextPage && !debouncedSearchTerm && (
          <div className="flex justify-center w-full h-full">
            <div className="flex flex-wrap">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="w-full sm:w-1/2 md:w-1/3 p-2">
                  <SkeletonUserCard />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllUsers;
