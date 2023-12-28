import { Models } from "appwrite";
import { Link } from "react-router-dom";
import PostStats from "@/components/Shared/PostStats";
import { useUserContext } from "@/context/AuthContext";

type RelatedPostsListProps = {
    posts: Models.Document[];
    showUser?: boolean;
    showStats?: boolean;
};

const RelatedPostsList = ({
    posts,
    showUser = true,
    showStats = true,
}: RelatedPostsListProps) => {
    const { user } = useUserContext();

    const YousefID = import.meta.env.VITE_APPWRITE_YOUSEF_USER_ID;
    const VideoThumbnail = "https://cloud.appwrite.io/v1/storage/buckets/654b5f03e5c16593a1c9/files/658d1017b00d237c1ce8/preview?width=2000&height=2000&gravity=top&quality=100&project=65462bfc24ded86416d2"

    return (
        <ul className="grid-container">
            {posts.length === 0 &&
                <p className="text-light-3">No related posts available</p>
            }
            {posts.map((post) => (
                <li key={post.$id} className="relative min-w-80 h-80">
                    <Link to={`/posts/${post.$id}`} className="grid-post_link">
                        {VideoThumbnail === post.imageUrl ? (
                            <img
                                src="/assets/icons/v_thumb.jpg"
                                alt="post"
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <img
                                src={post.imageUrl}
                                alt="post"
                                className="h-full w-full object-cover"
                            />
                        )}
                    </Link>
                    <div className="grid-post_user">
                        {showUser && (
                            <div className="flex items-center justify-start gap-2 flex-1">
                                <img
                                    src={post?.creator?.imageUrl || 'assets/icons/profile-placeholder.svg'}
                                    alt="creator"
                                    className="w-8 h-8 rounded-full"
                                />
                                <p className="line-clamp-1">{post?.creator?.name}</p>
                                {post.creator.$id === YousefID && (
                                    <div className="group relative pin-icon-container">
                                        <img
                                            alt="badge"
                                            width={17}
                                            src={"/assets/icons/verified-badge.svg"}
                                            className="ml-0 object-contain pointer-events-none select-none"
                                            draggable="false"
                                        />
                                        <div className="tooltip-verified absolute transition-opacity duration-300 top-0 left-1/2 transform -translate-x-1/2 z-9999">
                                            Website Creator
                                        </div>
                                    </div>

                                )}
                            </div>
                        )}
                        {showStats && <PostStats post={post} userId={user.id} />}
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default RelatedPostsList;
