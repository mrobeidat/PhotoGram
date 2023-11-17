import { Models } from "appwrite";

import Loader from "@/components/Shared/Loader";
import { useGetRecentPosts } from "@/lib/react-query/queriesAndMutations";
import PostCard from "@/components/Shared/PostCard";

const Home = () => {
  // const isPostLoading = true;
  // const posts = null;

  const {
    data: posts,
    isPending: isPostLoading,
    isError: isErrorPosts,
  } = useGetRecentPosts();


  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
          {isPostLoading && !posts ? (
            <Loader />
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full ">
              {posts?.documents.map((post: Models.Document) => (
                <li key={post.$id} className="flex justify-center w-full">
                  <PostCard />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>


    </div>
  );
};

export default Home;