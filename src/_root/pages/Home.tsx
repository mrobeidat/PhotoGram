import { Models } from "appwrite";
import {
  useGetRecentPosts,
  useGetUsers,
} from "@/lib/react-query/queriesAndMutations";
import PostCard from "@/components/Shared/PostCard";
import HomeLoader from "@/components/Shared/Loaders/HomeLoader";
import UsersLoader from "@/components/Shared/Loaders/UsersLoader";
import UserCard from "@/components/Shared/UserCard";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "@/context/AuthContext";

const Home = () => {
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

  // Fetch recent posts using the custom hook
  const recentPostsQuery = useGetRecentPosts();

  // Memoize the query result using useMemo
  const {
    data: posts,
    isLoading: isPostLoading,
    isError: isErrorPosts,
  } = useMemo(() => {
    return recentPostsQuery;
  }, [recentPostsQuery]);

  // Fetch recent users using the custom hook
  const {
    data: creators,
    isLoading: isUserLoading,
    isError: isErrorCreators,
  } = useGetUsers(10);

  // Handle error cases
  if (isErrorPosts || isErrorCreators) {
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

  // Pin Yousef's post to the top of the array of posts
  if (posts?.documents) {
    const postIdToMoveToTop = import.meta.env.VITE_APPWRITE_POST_ID;

    const updatedPosts = [...posts.documents];

    const postIndex = updatedPosts.findIndex(
      (post) => post.$id === postIdToMoveToTop
    );

    if (postIndex !== -1) {
      const postToMove = updatedPosts.splice(postIndex, 1)[0];
      updatedPosts.unshift(postToMove);
    }
    // Update the posts variable with the modified array
    posts.documents = updatedPosts;
  }

  // Yousef Account ID
  const YousefID = import.meta.env.VITE_APPWRITE_YOUSEF_USER_ID;

  // Pin yousef's post to the top and useMemo to memorize its position
  const sortedCreators = useMemo(() => {
    const sorted = [...(creators?.documents || [])].sort((a, b) => {
      if (a.$id === YousefID) {
        return -1; // Yousef's card comes first
      }
      if (b.$id === YousefID) {
        return 1; // Yousef's card comes first
      }
      return 0;
    });
    return sorted;
  }, [creators]);

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
          {isPostLoading && !posts ? (
            Array.from({ length: 3 }, (_, index) => <HomeLoader key={index} />)
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full ">
              {posts?.documents.map((post: Models.Document) => (
                <li key={post.$id} className="flex justify-center w-full">
                  <PostCard post={post} key={post.caption} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="home-creators">
        <h3 className="h3-bold text-light-1">
          PhotoGrammers <PeopleAltIcon />
        </h3>
        {isUserLoading && !creators ? (
          <div className="grid grid-cols-2 gap-4">
            {[...Array(10)].map((_, index) => (
              <UsersLoader key={index} />
            ))}
          </div>
        ) : (
          <ul className="grid 2xl:grid-cols-2 gap-6">
            {sortedCreators.map((creator) => (
              <li key={creator?.$id}>
                {isUserLoading ? <UsersLoader /> : <UserCard user={creator} />}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Home;
