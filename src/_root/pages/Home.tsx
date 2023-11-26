import { Models } from "appwrite";

// import Loader from "@/components/Shared/Loader";
import { useGetRecentPosts, useGetUsers } from "@/lib/react-query/queriesAndMutations";
import PostCard from "@/components/Shared/PostCard";
import HomeLoader from '../../components/Shared/Loaders/HomeLoader'
import UsersLoader from "@/components/Shared/Loaders/UsersLoader";
import UserCard from "@/components/Shared/UserCard";

const Home = () => {

  const {
    data: posts,
    isLoading: isPostLoading,
    isError: isErrorPosts,
  } = useGetRecentPosts();
  const {
    data: creators,
    isLoading: isUserLoading,
    isError: isErrorCreators,
  } = useGetUsers(10);

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

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
          {isPostLoading && !posts ? (
            Array.from({ length: 3 }, (_, index) => (
              <HomeLoader key={index} />
            ))
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
        <h3 className="h3-bold text-light-1">Top Creators</h3>
        {isUserLoading && !creators ? (
          <div className="grid grid-cols-2 gap-4">
            {[...Array(10)].map((_, index) => (
              <UsersLoader key={index} />
            ))}
          </div>
        ) : (
          <ul className="grid 2xl:grid-cols-2 gap-6">
            {creators?.documents.map((creator) => (
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