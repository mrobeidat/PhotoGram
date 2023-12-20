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
import { useGetUserById } from "@/lib/react-query/queriesAndMutations";
import ProfileLoader from '../../components/Shared/Loaders/ProfileLoader'
import RelatedPosts from "@/components/Shared/RelatedPosts";
import { useEffect, useState } from "react";
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

interface StabBlockProps {
  value: string | number;
  label: string;
}

const StatBlock = ({ value, label }: StabBlockProps) => (
  <div className="flex-center gap-2">
    <p className="small-semibold lg:body-bold text-primary-500">{value}</p>
    <p className="small-medium lg:base-medium text-light-2">{label}</p>
  </div>
);

const getRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const Profile = () => {
  // Generate random follower and following counts
  const randomFollowers = getRandomNumber(100, 200);
  const randomFollowing = getRandomNumber(100, 200);

  // Extract user ID from route parameters
  const { id } = useParams();

  // Access user context
  const { user } = useUserContext();
  const { pathname } = useLocation();

  // Fetch user data by ID using a custom hook
  const { data: currentUser } = useGetUserById(id || "");


  // State for profile view count
  const [viewCount, setViewCount] = useState<number>(0);

  useEffect(() => {
    // Retrieve the view count from localStorage
    const storedViewCount = localStorage.getItem(`profileViewCount_${id}`);

    if (storedViewCount) {
      setViewCount(parseInt(storedViewCount, 10));
    } else {
      // Initialize view count if not stored
      setViewCount(0);
    }
  }, [id]);

  useEffect(() => {
    // Increment view count when component mounts or when 'viewCount' changes
    if (user.id !== id) {
      setViewCount((prevViewCount) => {
        const newViewCount = prevViewCount + 1;
        // Update localStorage with the new view count
        localStorage.setItem(`profileViewCount_${id}`, String(newViewCount));
        return newViewCount;
      });
    }
  }, [id, user.id]);


  // Display loader while fetching user data
  if (!currentUser)
    return (
      <div className="flex-center w-full h-full">
        <ProfileLoader />
      </div>
    );

  // Determine if the user has three or more posts
  const hasThreeOrMorePosts = currentUser.posts.length >= 3;
  const YousefID = import.meta.env.VITE_APPWRITE_YOUSEF_USER_ID;

  return (
    <div className="profile-container">
      <div className="profile-inner_container">
        <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
          <img
            src={currentUser.imageUrl || "/assets/icons/profile-placeholder.svg"}
            alt="profile"
            className="w-28 h-28 lg:h-36 lg:w-36 rounded-full object-cover"
          />
          <div className="flex flex-col flex-1 justify-between md:mt-2">
            <div className="flex flex-col w-full">
              <div className="xl:justify-start flex items-center justify-center w-full"> {/* Center the content */}
                <h3 className="text-center xl:text-left h3-bold md:h2-semibold">
                  {currentUser.name}
                </h3>
                {/* Display the badge only for top creators */}
                {hasThreeOrMorePosts && currentUser.$id !== YousefID && (
                  <div className="group relative pin-icon-container">
                    <img
                      draggable="false"
                      src={"/assets/icons/top-creator.png"}
                      alt="badge"
                      width={17}
                      className="ml-2 object-contain"
                    />
                    <div className="tooltip-verified-creator absolute transition-opacity duration-300 ">
                      Top Creator
                    </div>
                  </div>
                )}
                {/* This badge for the website creator */}
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
                      Website Creator
                    </div>
                  </div>
                )}
              </div>
              <p className="small-regular md:body-medium text-light-3 text-center xl:text-left">
                @{currentUser.username}
              </p>
            </div>
            <div className="flex gap-8 mt-10 items-center justify-center xl:justify-start flex-wrap z-20">
              <StatBlock value={currentUser.posts.length} label="Posts" />
              <StatBlock value={randomFollowers} label="Followers" />
              <StatBlock value={randomFollowing} label="Following" />
              {/* <StatBlock value={viewCount} label="Profile Views" /> */}
            </div>

            <p className="small-medium md:base-medium text-center xl:text-left mt-7 max-w-screen-sm">
              {currentUser.bio}
            </p>
          </div>

        </div>
        <div className="flex justify-center gap-4">
          <div className={`${user.id !== currentUser.$id && "hidden"}`}>
            <Link
              to={`/update-profile/${currentUser.$id}`}
              className={`h-12 bg-gray-900 px-5 text-light-1 flex-center gap-2 rounded-lg ${user.id !== currentUser.$id && "hidden"
                }`}>
              <img
                src={"/assets/icons/edit.svg"}
                alt="edit"
                width={20}
                height={20}
              />
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
        <div className="flex max-w-5xl w-full">
          <Link
            to={`/profile/${id}`}
            className={`profile-tab rounded-l-lg ${pathname === `/profile/${id}` && "!bg-dark-3"
              }`}>
            <img
              src={"/assets/icons/posts.svg"}
              alt="posts"
              width={20}
              height={20}
            />
            Posts
          </Link>
          <Link
            to={`/profile/${id}/liked-posts`}
            className={`profile-tab rounded-r-lg ${pathname === `/profile/${id}/liked-posts` && "!bg-dark-3"
              }`}>
            <img
              src={"/assets/icons/like.svg"}
              alt="like"
              width={20}
              height={20}
            />
            Liked Posts
          </Link>
        </div>
      )}

      <Routes>
        {currentUser.posts.length === 0 ? (
          <Route
            index
            element={<img draggable="false" className="w-80 h-50 mt-32 pointer-events-none select-none" width={700} src="/assets/icons/NoPostsYet.png" />}
          />
        ) : (
          <Route
            index
            element={<RelatedPosts posts={currentUser.posts.reverse()} showUser={false} />}
          />
        )}
        {currentUser.$id === user.id && (
          <Route path="/liked-posts" element={<LikedPosts />} />
        )}
      </Routes>
      <Outlet />
    </div>
  );
};

export default Profile;