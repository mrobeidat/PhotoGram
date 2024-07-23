import { Models } from "appwrite";
import { useEffect, useState } from "react";
import {
  useGetUserPosts,
  useFollowUser,
  useUnfollowUser,
  useGetFollowees,
} from "@/lib/react-query/queriesAndMutations";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { useUserContext } from "@/context/AuthContext";

type UserCardProps = {
  user: Models.Document;
};

const YousefID = import.meta.env.VITE_APPWRITE_YOUSEF_USER_ID;

const UserCard = ({ user }: UserCardProps) => {
  const { user: currentUser } = useUserContext();
  const { data: userPosts } = useGetUserPosts(user.$id);
  const { data: followeesData } = useGetFollowees(currentUser.id);

  const [creatorPostCount, setCreatorPostCount] = useState<number | null>(null);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  const { mutate: followUser } = useFollowUser();
  const { mutate: unfollowUser } = useUnfollowUser();

  useEffect(() => {
    if (userPosts) {
      setCreatorPostCount(userPosts.documents.length);
    }
  }, [userPosts]);

  useEffect(() => {
    if (followeesData) {
      const isUserFollowed = followeesData.some(
        (followee: Models.Document) => followee.followeeId === user.$id
      );
      setIsFollowing(isUserFollowed);
    }
  }, [followeesData, user.$id]);

  const handleFollowClick = () => {
    if (isFollowing) {
      setIsFollowing(false);
      unfollowUser(
        { followerId: currentUser.id, followeeId: user.$id },
        {
          onError: () => {
            setIsFollowing(true);
          },
        }
      );
    } else {
      setIsFollowing(true);
      followUser(
        { followerId: currentUser.id, followeeId: user.$id },
        {
          onError: () => {
            setIsFollowing(false);
          },
        }
      );
    }
  };

  return (
    <div className="user-card">
      <Link to={`/profile/${user.$id}`} className="flex-center flex-col gap-1">
        <img
          src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
          alt="creator"
          className="rounded-full w-14 h-14 mb-2"
          style={{ objectFit: "cover" }}
        />

        <div className="flex items-center">
          <p className="base-medium text-light-1 text-center line-clamp-1">
            {user.name}
          </p>
          {creatorPostCount !== null &&
            creatorPostCount >= 3 &&
            user.$id !== YousefID && (
              <div className="group relative pin-icon-container">
                <img
                  alt="badge"
                  width={16}
                  src={"/assets/icons/top-creator.png"}
                  className="ml-2 object-contain"
                />
                <div className="tooltip-verified-creator absolute transition-opacity duration-300 ">
                  Top Creator
                </div>
              </div>
            )}
          {user.$id === YousefID && (
            <div className="group relative pin-icon-container">
              <img
                alt="badge"
                width={16}
                src={"/assets/icons/verified-badge.svg"}
                className="ml-2 object-contain pointer-events-none select-none"
                draggable="false"
              />
              <div className="tooltip-verified absolute transition-opacity duration-300 ">
                Photogram Founder & Developer
              </div>
            </div>
          )}
        </div>
        <p className="small-regular text-light-3 text-center line-clamp-1">
          @{user.username}
        </p>
      </Link>

      <div className="flex flex-col gap-2">
        <Button
          type="button"
          className="!capitalize shad-button_primary !px-4 !rounded-md"
          onClick={handleFollowClick}
        >
          {isFollowing ? "Unfollow" : "Follow"}
        </Button>
        <Link to={`/profile/${user.$id}`}>
          <Button
            type="button"
            className="!capitalize w-36 shad-button_primary !px-4"
          >
            View Profile
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default UserCard;
