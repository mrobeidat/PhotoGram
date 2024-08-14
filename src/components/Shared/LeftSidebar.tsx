import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@mui/material";
import { Logout, Verified } from "@mui/icons-material";
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutations";
import { useEffect, useState, useRef } from "react";
import { useUserContext, INITIAL_USER } from "@/context/AuthContext";
import { sidebarLinks } from "@/constants";
import { INavLink } from "@/types";
import VerifiedIcon from "@mui/icons-material/Verified";

const LeftSidebar = () => {
  const { pathname } = useLocation();
  const { mutate: signOut, isSuccess } = useSignOutAccount();
  const { user, setUser, setIsAuthenticated } = useUserContext();
  const navigate = useNavigate();
  const [activeLinkTop, setActiveLinkTop] = useState(0);
  const [activeLinkHeight, setActiveLinkHeight] = useState(0);
  const linksRef = useRef<(HTMLLIElement | null)[]>([]);

  const updateIndicator = () => {
    const activeLink = linksRef.current.find(
      (link) => link && link.classList.contains("active")
    );
    if (activeLink) {
      setActiveLinkTop(activeLink.offsetTop);
      setActiveLinkHeight(activeLink.offsetHeight);
    }
  };

  useEffect(() => {
    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    return () => {
      window.removeEventListener("resize", updateIndicator);
    };
  }, [pathname]);

  useEffect(() => {
    if (isSuccess) navigate(0);
  }, [isSuccess]);

  useEffect(() => {
    updateIndicator();
  }, [pathname]);

  const handleSignOut = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    signOut();
    setIsAuthenticated(false);
    setUser(INITIAL_USER);
    navigate("/sign-in");
  };

  const YousefID = import.meta.env.VITE_APPWRITE_YOUSEF_USER_ID;
  const TopCreator = import.meta.env.VITE_APPWRITE_TOP_CREATOR;

  return (
    <nav className="leftsidebar">
      <div className="flex flex-col gap-11">
        <Link
          to="/"
          className="flex gap-3 items-center"
          onClick={() => window.location.reload()}
        >
          <img
            src="/assets/images/photogram.png"
            alt="logo"
            width={170}
            className="pointer-events-none select-none"
            draggable="false"
          />
        </Link>
        <Link to={`/profile/${user.id}`} className="flex gap-3 items-center">
          <img
            className="h-14 w-14 rounded-full"
            src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
            style={{ objectFit: "cover" }}
          />
          <div className="flex flex-col">
            <div className="flex items-center">
              <p className="body-bold">{user.name}</p>
              {user.id === YousefID && (
                <div className="group relative pin-icon-container">
                  <VerifiedIcon
                    fontSize="small"
                    className="ml-2 text-blue-500"
                  />
                  <div className="tooltip-verified absolute transition-opacity duration-300 ">
                    Photogram Developer
                  </div>
                </div>
              )}
              {user.id === TopCreator && (
                <div className="group relative pin-icon-container">
                  <Verified fontSize="small" className="ml-2 text-yellow-500" />
                  <div className="tooltip-verified-creator absolute transition-opacity duration-300 ">
                    Top Creator
                  </div>
                </div>
              )}
            </div>
            <p className="small-regular text-light-3">@{user.username}</p>
          </div>
        </Link>

        <ul className="flex flex-col gap-6 relative">
          <div
            className="vertical-indicator"
            style={{
              top: `${activeLinkTop}px`,
              height: `${activeLinkHeight}px`,
            }}
          ></div>
          {sidebarLinks.map((link: INavLink, index) => {
            const isActive = pathname === link.route;
            const IconComponent = link.icon;

            return (
              <li
                key={link.label}
                className={`leftsidebar-link group ${isActive ? "active" : ""}`}
                ref={(el) => (linksRef.current[index] = el)}
              >
                <NavLink
                  to={link.route}
                  className="flex gap-4 items-center p-4 "
                >
                  {IconComponent ? (
                    <IconComponent
                      className={`text-purple-200 group-hover:text-white ${
                        isActive && "text-white"
                      }`}
                    />
                  ) : (
                    <img
                      src={link.imgURL}
                      alt={link.label}
                      className={`text-purple-200 group-hover:invert-white ${
                        isActive && "invert-white"
                      }`}
                    />
                  )}
                  {link.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
      <Button
        variant="outlined"
        className="shad-button_ghost"
        onClick={(e) => handleSignOut(e)}
      >
        <Logout />
        <p>Logout</p>
      </Button>
    </nav>
  );
};

export default LeftSidebar;
