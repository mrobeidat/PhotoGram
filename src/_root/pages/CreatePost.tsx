import PostForm from "@/components/forms/PostForm";
import { useUserContext } from "@/context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
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
  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          <img
            src="/assets/icons/add-post.svg"
            alt="add"
            width={36}
            height={36}
            className="select-none pointer-events-none"
          />
          <h2 className="h3-bold md:h2-bold text-left w-full select-none pointer-events-none">
            Create Post
          </h2>
        </div>
        <PostForm action="Create" />
      </div>
    </div>
  );
};

export default CreatePost;
