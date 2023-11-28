import { Models } from "appwrite";
import { Link } from "react-router-dom";

import { Button } from "../ui/button";

type UserCardProps = {
  user: Models.Document;
};
const YousefID = import.meta.env.VITE_APPWRITE_YOUSEF_USER_ID;

const UserCard = ({ user }: UserCardProps) => {
  return (
    <Link to={`/profile/${user.$id}`} className="user-card">
      <img
        src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
        alt="creator"
        className="rounded-full w-14 h-14"
      />

      <div className="flex-center flex-col gap-1">
        <div className="flex">
          <p className="base-medium text-light-1 text-center line-clamp-1">
            {user.name}
          </p>
          {user.$id === YousefID && (
            <img
              alt="badge"
              width={18}
              src={"/assets/icons/verified-1.png"}
              className="ml-2 object-contain"
              title="Website Creator"
            />
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