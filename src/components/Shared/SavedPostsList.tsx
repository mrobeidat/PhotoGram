import { Models } from "appwrite";
import { Link } from "react-router-dom";

// import PostStats from "@/components/Shared/PostStats";
// import { useUserContext } from "@/context/AuthContext";

type GridPostListProps = {
    posts: Models.Document[];
    showUser?: boolean;
    showStats?: boolean;
};

const GridPostList = ({
    posts,
    showUser = true,
    // showStats = true,
}: GridPostListProps) => {
    // const { user } = useUserContext();

    // replace default appwrite video thumbnail with a custom one
    const VideoThumbnail = "https://cloud.appwrite.io/v1/storage/buckets/654b5f03e5c16593a1c9/files/658d1017b00d237c1ce8/preview?width=2000&height=2000&gravity=top&quality=100&project=65462bfc24ded86416d2"


    return (
        <ul className="grid-container">
            {posts.map((post) => (
                <li key={post.$id} className="relative min-w-80 h-80">
                    <Link to={`/posts/${post.$id}`} className="grid-post_link">
                        {post.imageUrl === VideoThumbnail ? (
                            <img
                                src="/assets/icons/v_thumb.jpg"
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <img
                                src={post.imageUrl}
                                alt="post"
                                className="h-full w-80 object-cover"
                            />
                        )}
                    </Link>

                    <div className="grid-post_user">
                        {showUser && (
                            <div className="flex items-center justify-start gap-2 flex-1">
                                <img
                                    src={
                                        post.creator.imageUrl ||
                                        "/assets/icons/profile-placeholder.svg"
                                    }
                                    alt="creator"
                                    className="w-8 h-8 rounded-full"
                                />
                                <p className="line-clamp-1">{post.creator.name}</p>
                            </div>
                        )}
                        {/* {showStats && <PostStats post={post} userId={user.id} />} */}
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default GridPostList;