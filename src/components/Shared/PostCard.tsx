import { useUserContext } from "@/context/AuthContext"
import { formatDate } from "@/lib/utils"
import { Models } from "appwrite"
import { Link } from "react-router-dom"
import PostStats from "./PostStats"
import { sanitizeHTML } from "@/_root/pages/PostDetails"
import { useEffect, useState } from "react"
// import { useGetRecentPosts } from "@/lib/react-query/queriesAndMutations";
import Loader from "./Loader"
import { PhotoProvider, PhotoView } from "react-photo-view"
import { isAndroid, isWindows, isMacOs } from 'react-device-detect';

type PostCardProps = {
  post: Models.Document
}

const PostCard = ({ post }: PostCardProps) => {
  const [contentType, setContentType] = useState('');
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  // const { isLoading: isPostLoading } = useGetRecentPosts();
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const { user } = useUserContext()

  if (!post.creator) return;

  const sanitizedCaption = sanitizeHTML(post.caption).__html;


  const YousefID = import.meta.env.VITE_APPWRITE_YOUSEF_USER_ID
  const TopCreator = import.meta.env.VITE_APPWRITE_TOP_CREATOR


  // For displaying the video player
  const imageUrl = post?.imageUrl.replace('/preview', '/view');

  // Check for the content type depending on the response
  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(imageUrl);

        if (response.ok) {
          const contentTypeHeader = response.headers.get('Content-Type');
          setContentType(contentTypeHeader || '');
          console.log("headers = " + contentTypeHeader);
        } else {
          console.error('Failed to fetch image');
        }
      } catch (error) {
        console.error('Error fetching image:', error);
      } finally {
        setIsVideoLoading(false);
      }
    };
    fetchImage();
  }, [imageUrl]);

  // Play the video on scroll only 
  useEffect(() => {
    const videoElement = document.getElementById(`video-${post.$id}`) as HTMLVideoElement | null;

    if (videoElement) {
      const handleIntersection = (entries: IntersectionObserverEntry[]) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVideoPlaying(true);
          videoElement.play();
        } else {
          setIsVideoPlaying(false);
          videoElement.pause();
        }
      };

      const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5,
      };

      const observer = new IntersectionObserver(handleIntersection, options);
      observer.observe(videoElement);

      return () => {
        observer.disconnect();
      };
    } else {
      console.error(`Video element with ID 'video-${post.$id}' not found.`);
    }
  }, [post.$id]);

  const handleTap = () => {
    const videoElement = document.getElementById(`video-${post.$id}`) as HTMLVideoElement;
    const ShowingOn = isAndroid || isWindows || isMacOs

    videoElement.muted = ShowingOn ? !isMuted : false
    setIsMuted(ShowingOn ? !isMuted : false)
  };

  return (
    <div className={`${post.$id === import.meta.env.VITE_APPWRITE_POST_ID ? "post-card-pinned" : "post-card"}`}>
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.creator.$id}`}>
            <img
              src={post?.creator?.imageUrl || 'assets/icons/profile-placeholder.svg'}
              alt="avatar"
              className="w-12 h-12 lg:h-12 rounded-full object-cover"
            />
          </Link>
          <div className="flex flex-col">
            <div className="flex items-center">
              <Link to={`/profile/${post.creator.$id}`}>
                <p className="base-medium lg:body-bold text-light-1">{post.creator.name}</p>
              </Link>
              {post.creator.$id === TopCreator && (
                <div className="group relative pin-icon-container">
                  <img
                    alt="badge"
                    width={17}
                    src={"/assets/icons/top-creator.png"}
                    className="ml-2 object-contain pointer-events-none select-none"
                    draggable='false'
                  />
                  <div className="tooltip-verified-creator absolute transition-opacity duration-300 ">
                    Top Creator
                  </div>
                </div>
              )}
              {post.creator.$id === YousefID && (
                <div className="group relative pin-icon-container">
                  <img
                    alt="badge"
                    width={17}
                    src={"/assets/icons/verified-badge.svg"}
                    className="ml-2 object-contain pointer-events-none select-none"
                    draggable="false"
                  />
                  <div className="tooltip-verified absolute transition-opacity duration-300 ">
                    Website Creator
                  </div>
                </div>
              )}
            </div>
            <div className="flex-center gap-2 text-light-3">
              <p className="subtle-semibold lg:small-regular">{formatDate(post.$createdAt)}</p>
              -
              <p className="subtle-semibold lg:small-regular">{post.location}</p>
            </div>
          </div>
        </div>

        {post.$id === import.meta.env.VITE_APPWRITE_POST_ID ? (
          <div className="pin-icon">
            <img
              src="assets/icons/post-pin.png"
              alt="pin"
              width={35}
              height={20}
              className="resize-none pointer-events-none select-none"
            />
            <span className="tooltip">📌 Pinned Post</span>
          </div>
        ) : (
          <Link className={`${user.id !== post.creator.$id && "hidden"}`} to={`/update-post/${post.$id}`}>
            <img src="assets/icons/edit.svg" alt="edit" width={20} height={50} />
          </Link>
        )}
      </div>

      <Link to={`/posts/${post.$id}`}>
        <div className="small-medium lg:base-medium py-5">
          {/* Render caption as readonly */}
          <p dangerouslySetInnerHTML={{ __html: sanitizedCaption }} style={{ fontSize: "14px", fontWeight: "100" }} />
          <ul className="flex gap-1 mt-2">
            {post.tags.map((tag: string, index: number) => (
              <li key={`${tag}${index}`} className="text-light-3 small-regular">
                #{tag}
              </li>
            ))}
          </ul>
        </div>
      </Link>

      <PhotoProvider
        speed={() => 450}
        easing={(type) => (type === 2 ? 'cubic-bezier(0.36, 0, 0.66, -0.56)' : 'cubic-bezier(0.34, 1.56, 0.64, 1)')}
        bannerVisible={false} maskOpacity={0.8}
      >
        {contentType.startsWith('image/') ? (
          <PhotoView src={post?.imageUrl}>
            <img src={post.imageUrl} alt="Image" className="post-card_img hover:cursor-pointer" />
          </PhotoView>
        ) : (
          <div style={{ position: 'relative', borderRadius: '25px' }}>
            {isVideoLoading ? (
              <div className="flex justify-center items-center h-full">
                <Loader />
              </div>
            ) : (
              <>
                {imageUrl && (
                  <div className="post_details-img object-cover !w-full !h-auto !p-0" style={{ position: 'relative', borderRadius: "10px" }}>
                    <>
                      {isAndroid || isWindows || isMacOs ? (
                        <video
                          id={`video-${post?.$id}`}
                          autoPlay
                          loop
                          controls={false}
                          onClick={handleTap}
                          className="post-card_img"
                          style={{
                            width: '100%',
                            borderRadius: '10px',
                            boxShadow: 'rgba(17, 67, 98, 0.841) 0px 20px 30px -10px',
                          }}
                        >
                          <source src={imageUrl} type="video/mp4" />
                        </video>
                      ) : (
                        <video
                          id={`video-${post?.$id}`}
                          autoPlay
                          loop
                          controls={true}
                          onClick={handleTap}
                          className="post-card_img"
                          style={{
                            width: '100%',
                            borderRadius: '10px',
                            boxShadow: 'rgba(17, 67, 98, 0.841) 0px 20px 30px -10px',
                          }}
                        >
                          <source src={imageUrl} type="video/mp4" />
                        </video>
                      )}
                    </>
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '5px',
                        right: '10px',
                        cursor: 'pointer',
                      }}
                      onClick={handleTap}
                    >
                      {isAndroid || isWindows || isMacOs ? (
                        isMuted ? (
                          <img height={21} width={21} src="/assets/icons/mute.png" alt="Mute" />
                        ) : (
                          <img height={22} width={22} src="/assets/icons/volume.png" alt="Unmute" />
                        )
                      ) : null}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </PhotoProvider>

      <PostStats post={post} userId={user.id} />
    </div>
  );

}

export default PostCard
