import { Models } from "appwrite";
import { Link } from "react-router-dom";

import PostStats from "@/components/Shared/PostStats";
import { useUserContext } from "@/context/AuthContext";

type GridPostListProps = {
    posts: Models.Document[];
    showUser?: boolean;
    showStats?: boolean;
};

const GridPostList = ({
    posts,
    showUser = true,
    showStats = true,
}: GridPostListProps) => {
    const { user } = useUserContext();

    // replace default appwrite video thumbnail with a custom one
    let VideoThumbnail = import.meta.env.VITE_APPWRITE_VIDEO_THUMBNAIL;
    let UpdatedThumbnail = import.meta.env.VITE_APPWRITE_VIDEO_THUMBNAIL_CHANGED
    let changedThumbnail = VideoThumbnail.replace(
        VideoThumbnail,
        UpdatedThumbnail
    );

    return (
        <ul className="grid-container">
            {posts.map((post) => (
                <li key={post.$id} className="relative min-w-80 h-80">
                    <Link to={`/posts/${post.$id}`} className="grid-post_link">
                        {VideoThumbnail && post.imageUrl === VideoThumbnail ? (
                            <img src={changedThumbnail}
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
                        {showStats && <PostStats post={post} userId={user.id} />}
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default GridPostList;