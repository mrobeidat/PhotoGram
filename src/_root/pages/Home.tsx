import { useMemo, useRef, useCallback } from "react";
import { useUserContext } from "@/context/AuthContext";
import {
  useGetPostsFromFollowedUsers,
  useGetPinnedPost,
  useGetUsers,
  useGetUserPosts,
} from "@/lib/react-query/queriesAndMutations";
import PostCard from "@/components/Shared/PostCard";
import HomeLoader from "@/components/Shared/Loaders/HomeLoader";
import UsersLoader from "@/components/Shared/Loaders/SkeletonUserCard";
import UserCard from "@/components/Shared/UserCard";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { Models } from "appwrite";

const Home = () => {
  const { user } = useUserContext();
  const postIdToMoveToTop = import.meta.env.VITE_APPWRITE_POST_ID;

  const {
    data,
    isLoading: isPostLoading,
    isError: isErrorPosts,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetPostsFromFollowedUsers(user.id);

  const {
    data: pinnedPostData,
    isLoading: isPinnedPostLoading,
    isError: isErrorPinnedPost,
  } = useGetPinnedPost(postIdToMoveToTop);

  const {
    data: creatorsData,
    isLoading: isUserLoading,
    isError: isErrorCreators,
  } = useGetUsers();

  const {
    data: currentUserPostsData,
    isLoading: isCurrentUserPostsLoading,
    isError: isErrorCurrentUserPosts,
  } = useGetUserPosts(user.id);

  // Intersection Observer for infinite scrolling
  const observer = useRef<IntersectionObserver | null>(null);

  const lastPostRef = useCallback(
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

  // Flatten paginated data, include pinned post, merge with user posts, and sort by creation date
  const posts = useMemo(() => {
    const allPosts = data?.pages.flatMap((page) => page?.documents ?? []) || [];
    const currentUserPosts = currentUserPostsData?.documents ?? [];
    const combinedPosts = [...allPosts, ...currentUserPosts];
    const filteredPosts = combinedPosts.filter(
      (post) => post.$id !== postIdToMoveToTop
    );
    const sortedPosts = filteredPosts.sort(
      (a, b) =>
        new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime()
    );
    if (pinnedPostData) {
      sortedPosts.unshift(pinnedPostData);
    }

    return sortedPosts;
  }, [data, pinnedPostData, currentUserPostsData, postIdToMoveToTop]);

  if (
    isErrorPosts ||
    isErrorCreators ||
    isErrorPinnedPost ||
    isErrorCurrentUserPosts
  ) {
    return (
      <div className="flex flex-1">
        <div className="home-container">
          <p className="body-medium text-light-1">Something bad happened</p>
        </div>
        <div className="home-creators">
          <p className="body-medium text-light-1">Something bad happened</p>
        </div>
      </div>
    );
  }

  const YousefID = import.meta.env.VITE_APPWRITE_YOUSEF_USER_ID;
  const sortedCreators = useMemo(() => {
    if (!creatorsData?.pages) return [];
    const allCreators = creatorsData.pages.flatMap((page) => page?.data ?? []);

    const filteredCreators = allCreators.filter(
      (creator) => creator.$id !== user.id
    );

    return filteredCreators.sort((a, b) => {
      if (a.$id === YousefID) return -1;
      if (b.$id === YousefID) return 1;
      return 0;
    });
  }, [creatorsData, YousefID, user.id]);

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
          {isPostLoading || isPinnedPostLoading || isCurrentUserPostsLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <HomeLoader key={index} />
            ))
          ) : (
            <>
              {posts.length === 0 ? (
                <p className="body-medium text-light-1">No posts to display.</p>
              ) : (
                <ul className="flex flex-col flex-1 gap-9 w-full">
                  {posts.map((post: Models.Document, index) => {
                    if (index === posts.length - 1) {
                      return (
                        <li
                          ref={lastPostRef}
                          key={post.$id}
                          className="flex justify-center w-full"
                        >
                          <PostCard post={post} />
                        </li>
                      );
                    } else {
                      return (
                        <li
                          key={post.$id}
                          className="flex justify-center w-full"
                        >
                          <PostCard post={post} />
                        </li>
                      );
                    }
                  })}
                </ul>
              )}
              {isFetchingNextPage && <HomeLoader />}
            </>
          )}
        </div>
      </div>
      <div className="home-creators">
        <h3 className="h3-bold text-light-1">
          PhotoGrammers <PeopleAltIcon />
        </h3>
        {isUserLoading ? (
          <div className="grid grid-cols-2 gap-4">
            {[...Array(10)].map((_, index) => (
              <UsersLoader key={index} />
            ))}
          </div>
        ) : (
          <ul className="grid 2xl:grid-cols-2 gap-6">
            {sortedCreators.map((creator: Models.Document) => (
              <li key={creator.$id}>
                <UserCard user={creator} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Home;
