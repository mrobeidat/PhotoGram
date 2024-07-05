import LikedPostsList from "@/components/Shared/LikedPosts";
import ExploreLoader from "@/components/Shared/Loaders/ExploreLoader";
import { useUserContext } from "@/context/AuthContext";

import { useGetCurrentUser } from "@/lib/react-query/queriesAndMutations";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LikedPosts = () => {
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