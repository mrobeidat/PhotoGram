import { Models } from "appwrite";
import { Link } from "react-router-dom";

import { Button } from "../ui/button";

type UserCardProps = {
  user: Models.Document;
};
const YousefID = import.meta.env.VITE_APPWRITE_YOUSEF_USER_ID;
const TopCreator = import.meta.env.VITE_APPWRITE_TOP_CREATOR

const UserCard = ({ user }: UserCardProps) => {
  return (
    <Link to={`/profile/${user.$id}`} className="user-card">
      <img
        src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
        alt="creator"
        className="rounded-full w-14 h-14"
        style={{ objectFit: "cover" }}
      />

      <div className="flex-center flex-col gap-1">
        <div className="flex items-center">
          <p className="base-medium text-light-1 text-center line-clamp-1">
            {user.name}
          </p>
          {user.$id === TopCreator && (
            <div className="group relative pin-icon-container">
              <img
                alt="badge"
                width={14}
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
                width={14}
                src={"/assets/icons/verified-1.svg"}
                className="ml-2 object-contain"
              />
              <div className="tooltip-verified absolute transition-opacity duration-300 ">
                Website Creator
              </div>
            </div>
          )}
        </div>
        <p className="small-regular text-light-3 text-center line-clamp-1">
          @{user.username}
        </p>
      </div>

      <Button type="button" size="sm" className="shad-button_primary px-5">
        View Profile
      </Button>
    </Link>
  );
};

export default UserCard;