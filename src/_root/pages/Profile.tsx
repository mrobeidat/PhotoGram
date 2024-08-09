import { useEffect, useState, useRef, useCallback } from "react";
import {
  Route,
  Routes,
  Link,
  Outlet,
  useParams,
  useLocation,
} from "react-router-dom";
import { LikedPosts } from "@/_root/pages";
import { useUserContext } from "@/context/AuthContext";
import {
  useGetUserById,
  useFollowUser,
  useUnfollowUser,
  useGetFollowers,
  useGetFollowersDetails,
  useGetFolloweesDetails,
} from "@/lib/react-query/queriesAndMutations";
import ProfileLoader from "../../components/Shared/Loaders/ProfileLoader";
import RelatedPosts from "@/components/Shared/RelatedPosts";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import "react-photo-view/dist/react-photo-view.css";
import { PhotoProvider, PhotoView } from "react-photo-view";
import Button from "@mui/material/Button";
import PostsIcon from "@mui/icons-material/Article";
import LikeIcon from "@mui/icons-material/ThumbUp";
import FollowersModal from "@/components/Shared/FollowersModal";
import { IUser } from "@/types";
import { EditNote } from "@mui/icons-material";

interface StatBlockProps {
  value: string | number;
  label: string;
  onClick?: () => void;
}

const StatBlock = ({ value, label, onClick }: StatBlockProps) => (
  <div className="flex-center gap-2 cursor-pointer" onClick={onClick}>
    <p className="text-lg lg:body-bold text-primary-500">{value}</p>
    <p className="text-lg lg:base-medium text-light-2">{label}</p>
  </div>
);

const Profile = () => {
  const { id } = useParams();
  const { user } = useUserContext();
  const { pathname } = useLocation();

  const { data: currentUser, isLoading: isUserLoading } = useGetUserById(
    id || ""
  );
  const { data: followersData, refetch: refetchFollowers } = useGetFollowers(
    id || ""
  );
  const {
    data: followeesData,
    refetch: refetchFollowees,
    isLoading: isFolloweesLoading,
  } = useGetFolloweesDetails(id || "");

  const {
    data: followersDetails,
    refetch: refetchFollowersDetails,
    isLoading: isFollowersLoading,
  } = useGetFollowersDetails(id || "");

  const { data: followeesDetails, refetch: refetchFolloweesDetails } =
    useGetFolloweesDetails(id || "");

  const followMutation = useFollowUser();
  const unfollowMutation = useUnfollowUser();
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [viewCount, setViewCount] = useState<number>(0);
  const [followersCount, setFollowersCount] = useState<number>(0);
  const [followeesCount, setFolloweesCount] = useState<number>(0);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const tabsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const [isFollowersModalOpen, setIsFollowersModalOpen] =
    useState<boolean>(false);
  const [isFolloweesModalOpen, setIsFolloweesModalOpen] =
    useState<boolean>(false);

  const handleFollowersModalOpen = () => {
    refetchFollowersDetails();
    setIsFollowersModalOpen(true);
  };
  const handleFollowersModalClose = () => setIsFollowersModalOpen(false);
  const handleFolloweesModalOpen = () => {
    refetchFolloweesDetails();
    setIsFolloweesModalOpen(true);
  };
  const handleFolloweesModalClose = () => setIsFolloweesModalOpen(false);

  useEffect(() => {
    const storedViewCount = localStorage.getItem(`profileViewCount_${id}`);
    if (storedViewCount) {
      setViewCount(parseInt(storedViewCount, 10));
    } else {
      setViewCount(0);
    }
  }, [id]);

  useEffect(() => {
    if (user.id !== id) {
      setViewCount((prevViewCount) => {
        const newViewCount = prevViewCount + 1;
        localStorage.setItem(`profileViewCount_${id}`, String(newViewCount));
        return newViewCount;
      });
    }
  }, [id, user.id]);

  useEffect(() => {
    if (followersData) {
      const isUserFollowing = followersData.some(
        (follower: any) => follower.followerId === user.id
      );
      setIsFollowing(isUserFollowing);
      setFollowersCount(followersData.length);
    }
  }, [followersData, user.id]);

  useEffect(() => {
    if (followeesData) {
      setFolloweesCount(followeesData.length);
    }
  }, [followeesData]);

  const updateIndicator = useCallback(() => {
    const activeTab = tabsRef.current.find(
      (tab) => tab && tab.classList.contains("active")
    );
    if (activeTab) {
      setIndicatorStyle({
        left: activeTab.offsetLeft,
        width: activeTab.offsetWidth,
      });
    }
  }, []);

  useEffect(() => {
    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    return () => {
      window.removeEventListener("resize", updateIndicator);
    };
  }, [pathname, updateIndicator]);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      updateIndicator();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
    };
  }, [updateIndicator]);

  if (isUserLoading || !currentUser) {
    return (
      <div className="flex-center w-full h-full">
        <ProfileLoader />
      </div>
    );
  }

  const handleFollow = () => {
    setIsFollowing(true);
    followMutation.mutate(
      {
        followerId: user.id,
        followeeId: currentUser.$id,
      },
      {
        onSuccess: () => {
          setFollowersCount((prev) => prev + 1);
          refetchFollowers();
          refetchFollowees();
        },
        onError: () => {
          setIsFollowing(false);
        },
      }
    );
  };

  const handleUnfollow = () => {
    setIsFollowing(false);
    unfollowMutation.mutate(
      {
        followerId: user.id,
        followeeId: currentUser.$id,
      },
      {
        onSuccess: () => {
          setFollowersCount((prev) => prev - 1);
          refetchFollowers();
          refetchFollowees();
        },
        onError: () => {
          setIsFollowing(true);
        },
      }
    );
  };

  const transformDocumentToUser = (doc: any): IUser => ({
    id: doc.$id,
    name: doc.name || "Unknown",
    username: doc.username || "unknown_user",
    email: doc.email || "unknown@example.com",
    imageUrl: doc.imageUrl || "/path/to/default/image.jpg",
    bio: doc.bio || "",
  });

  const transformedFollowers: IUser[] = (followersDetails || []).map(
    transformDocumentToUser
  );
  const transformedFollowees: IUser[] = (followeesDetails || []).map(
    transformDocumentToUser
  );

  const hasThreeOrMorePosts = currentUser.posts.length >= 3;
  const YousefID = import.meta.env.VITE_APPWRITE_YOUSEF_USER_ID;
  const sortedPosts = [...currentUser.posts].reverse();

  return (
    <div className="profile-container">
      <div className="profile-inner_container">
        <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
          <PhotoProvider
            speed={() => 450}
            easing={(type) =>
              type === 2
                ? "cubic-bezier(0.36, 0, 0.66, -0.56)"
                : "cubic-bezier(0.34, 1.56, 0.64, 1)"
            }
            bannerVisible={false}
            maskOpacity={0.8}
          >
            <PhotoView src={currentUser.imageUrl}>
              <img
                src={
                  currentUser.imageUrl ||
                  "/assets/icons/profile-placeholder.svg"
                }
                alt="profile"
                className="w-28 h-28 lg:h-36 lg:w-36 rounded-full object-cover cursor-pointer"
                style={{
                  filter: "drop-shadow(0 0 0.1rem)",
                  boxShadow: "0 0.5rem 1rem rgba(0, 0, 0, 0.15)",
                }}
              />
            </PhotoView>
          </PhotoProvider>
          <div className="flex flex-col flex-1 justify-between md:mt-2">
            <div className="flex flex-col w-full">
              <div className="xl:justify-start flex items-center justify-center w-full">
                <h3 className="text-center xl:text-left h3-bold md:h2-semibold">
                  {currentUser.name}
                </h3>
                {hasThreeOrMorePosts && currentUser.$id !== YousefID && (
                  <div className="group relative pin-icon-container">
                    <img
                      draggable="false"
                      src={"/assets/icons/top-creator.png"}
                      alt="badge"
                      width={17}
                      className="ml-2 object-contain select-none pointer-events-none"
                    />
                    <div className="tooltip-verified-creator absolute transition-opacity duration-300 ">
                      Top Creator
                    </div>
                  </div>
                )}
                {currentUser.$id === YousefID && (
                  <div className="group relative pin-icon-container">
                    <img
                      draggable="false"
                      alt="badge"
                      width={17}
                      src={"/assets/icons/verified-badge.svg"}
                      className="ml-2 object-contain pointer-events-none select-none"
                    />
                    <div className="tooltip-verified absolute transition-opacity duration-300 ">
                      photogram Developer
                    </div>
                  </div>
                )}
              </div>
              <p className="small-regular md:body-medium text-light-3 text-center xl:text-left">
                @{currentUser.username}
              </p>
            </div>
            <div className="flex gap-8 mt-10 items-center justify-center xl:justify-start !text-lg flex-wrap z-20">
              <StatBlock value={currentUser.posts.length} label="Posts" />
              <StatBlock
                value={followersCount}
                label="Followers"
                onClick={handleFollowersModalOpen}
              />
              <StatBlock
                value={followeesCount}
                label="Following"
                onClick={handleFolloweesModalOpen}
              />
            </div>
            <p className="small-medium md:base-medium text-center xl:text-left mt-7 max-w-screen-sm mb-8">
              {currentUser.bio}
            </p>
            {currentUser.$id !== user.id &&
              (isFollowing ? (
                <Button
                  onClick={handleUnfollow}
                  className="!capitalize shad-button_primary !px-8"
                >
                  Unfollow
                </Button>
              ) : (
                <Button
                  onClick={handleFollow}
                  className="!capitalize shad-button_primary !px-8"
                >
                  Follow
                </Button>
              ))}
          </div>
        </div>
        <div className="flex justify-center gap-4">
          <div className={`${user.id !== currentUser.$id && "hidden"}`}>
            <Link
              to={`/update-profile/${currentUser.$id}`}
              className={`h-12 bg-gray-900 px-5 text-light-1 flex-center gap-2 rounded-lg ${
                user.id !== currentUser.$id && "hidden"
              }`}
            >
              <EditNote />
              <p className="flex whitespace-nowrap small-medium">
                Edit Profile
              </p>
            </Link>
            <div className={`${user.id !== currentUser.$id && "hidden"}`}>
              <div className="border border-white rounded-lg backdrop-blur-xl p-2 mt-4 flex gap-2 cursor-default">
                <PeopleAltIcon />
                <h3>Profile Views: {viewCount}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr className="border w-4/5 border-dark-4/80" />
      {currentUser.$id === user.id && (
        <div className="flex max-w-5xl w-full relative">
          <div
            className="horizontal-indicator"
            style={{
              left: `${indicatorStyle.left}px`,
              width: `${indicatorStyle.width}px`,
              transition: "left 0.5s, width 0.5s",
            }}
          ></div>
          <Link
            to={`/profile/${id}`}
            className={`profile-tab rounded-l-lg ${
              pathname === `/profile/${id}` && "active"
            }`}
            ref={(el) => (tabsRef.current[0] = el)}
          >
            <PostsIcon />
            Posts
          </Link>
          <Link
            to={`/profile/${id}/liked-posts`}
            className={`profile-tab rounded-r-lg ${
              pathname === `/profile/${id}/liked-posts` && "active"
            }`}
            ref={(el) => (tabsRef.current[1] = el)}
          >
            <LikeIcon />
            Liked Posts
          </Link>
        </div>
      )}

      <Routes>
        {currentUser.posts.length === 0 ? (
          <Route
            index
            element={
              <img
                draggable="false"
                className="w-80 h-50 mt-32 opacity-30 pointer-events-none select-none"
                width={700}
                src="/assets/icons/NoPostsYet.png"
              />
            }
          />
        ) : (
          <Route
            index
            element={<RelatedPosts posts={sortedPosts} showUser={false} />}
          />
        )}
        {currentUser.$id === user.id && (
          <Route path="/liked-posts" element={<LikedPosts />} />
        )}
      </Routes>
      <Outlet />

      <FollowersModal
        isOpen={isFollowersModalOpen}
        onClose={handleFollowersModalClose}
        title="Followers"
        users={transformedFollowers}
        isLoading={isFollowersLoading}
      />
      <FollowersModal
        isOpen={isFolloweesModalOpen}
        onClose={handleFolloweesModalClose}
        title="Following"
        users={transformedFollowees}
        isLoading={isFolloweesLoading}
      />
    </div>
  );
};

export default Profile;
