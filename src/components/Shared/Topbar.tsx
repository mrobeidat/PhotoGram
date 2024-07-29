import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutations";
import { useEffect } from "react";
import { useUserContext } from "@/context/AuthContext";
import { Logout } from "@mui/icons-material";

const Topbar = () => {
  const { mutate: signOut, isSuccess } = useSignOutAccount();
  const { user } = useUserContext();
  const navigate = useNavigate();
  useEffect(() => {
    if (isSuccess) navigate(0);
  }, [isSuccess]);

  return (
    <section className="topbar">
      <div className="flex-between py-2.5 px-5">
        <Link to="/" className="flex gap-3 items-center">
          <img
            className="pointer-events-none select-none"
            draggable="false"
            src="/assets/images/photogram.png"
            alt="logo"
            width={110}
          />
        </Link>
        <div className="flex gap-4">
          <Button
            variant="secondary"
            className="shad-button_ghost"
            onClick={() => signOut()}
          >
            <Logout />
          </Button>
          <Link to={`/profile/${user.id}`} className="flex-center gap-3">
            <img
              src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
              alt="profile"
              className="w-8 h-8 rounded-full"
              style={{ objectFit: "cover" }}
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Topbar;
