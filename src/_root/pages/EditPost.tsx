import PostForm from "@/components/forms/PostForm";
import { useGetPostById } from "@/lib/react-query/queriesAndMutations";
import { useParams } from "react-router-dom";
import Loader from "@/components/Shared/Loader";

const EditPost = () => {
  const { id } = useParams();
  const { data: post, isPending } = useGetPostById(id || "");
  if (isPending)
    return (
      <div className="flex flex-1">
        <div className="home-container">
          <div className="home-posts">
            <Loader />
          </div>
        </div>
      </div>
    );

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          <img src="/assets/icons/edit.svg" alt="add" width={36} height={36} />
          <h2 className="h3-bold md:h2-bold text-left w-full">Edit Post</h2>
        </div>
        <PostForm action="Update" post={post} />
      </div>
    </div>
  );
};

export default EditPost;
