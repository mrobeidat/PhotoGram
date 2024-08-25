import PostForm from "@/components/forms/PostForm";
import { useGetPostById } from "@/lib/react-query/queriesAndMutations";
import { useParams } from "react-router-dom";
import { CSSProperties } from "react";
import ScaleLoader from "react-spinners/ScaleLoader";

const EditPost = () => {
  const { id } = useParams();
  const { data: post, isPending } = useGetPostById(id || "");

  const override: CSSProperties = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };

  if (isPending)
    return (
      <ScaleLoader
        color={"#ff014f"}
        cssOverride={override}
        height={35}
        width={5}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
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
