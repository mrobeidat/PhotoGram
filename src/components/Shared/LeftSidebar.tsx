import { Link, NavLink, useNavigate, useLocation } from "react-router-dom"
import { Button } from "../ui/button"
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutations"
import { useEffect } from "react"
import { useUserContext, INITIAL_USER } from "@/context/AuthContext"
import { sidebarLinks } from "@/constants"
import { INavLink } from "@/types"

const LeftSidebar = () => {
  const { pathname } = useLocation()
  const { mutate: signOut, isSuccess } = useSignOutAccount()
  const { user, setUser, setIsAuthenticated } = useUserContext()
  const navigate = useNavigate()
  useEffect(() => {
    if (isSuccess)
      navigate(0)
  }, [isSuccess])

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
  const TopCreator = import.meta.env.VITE_APPWRITE_TOP_CREATOR

  return (
    <nav className='leftsidebar'>
      <div className='flex flex-col gap-11'>
        <Link to='/' className="flex gap-3 items-center" onClick={() => window.location.reload()}>
          <img
            src="/assets/images/photogram.png"
            alt="logo"
            width={170}
            className="pointer-events-none select-none"
            draggable="false"
          />
        </Link>
        <Link to={`/profile/${user.id}`}
          className="flex gap-3 items-center"
        >
          <img
            className="h-14 w-14 rounded-full"
            src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
            style={{ objectFit: "cover" }}
          />
          <div className="flex flex-col">
            <div className="flex items-center">
              <p className="body-bold">
                {user.name}
              </p>
              {user.id === YousefID && (
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
              {user.id === TopCreator && (
                <div className="group relative pin-icon-container">
                  <img
                    alt="badge"
                    width={17}
                    src={"/assets/icons/top-creator.png"}
                    className="ml-2 object-contain pointer-events-none select-none"
                    draggable="false"
                  />
                  <div className="tooltip-verified-creator absolute transition-opacity duration-300 ">
                    Top Creator
                  </div>
                </div>
              )}
            </div>
            <p className="small-regular text-light-3">
              @{user.username}
            </p>
          </div>
        </Link>

        <ul className="flex flex-col gap-6 ">
          {sidebarLinks.map((link: INavLink) => {
            const isActive = pathname === link.route
            return (
              <li key={link.label} className={`leftsidebar-link group ${isActive && 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'}`}>
                <NavLink to={link.route}
                  className="flex gap-4 items-center p-4 "
                >
                  <img
                    src={link.imgURL}
                    alt={link.label}
                    className={`text-orange-800 group-hover:invert-white ${isActive && 'invert-white'}`}
                  />
                  {link.label}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </div>
      <Button variant="ghost" className="shad-button_ghost" onClick={(e) => handleSignOut(e)}>
        <img src="/assets/icons/logout.svg" alt="logout" />
        <p className="">Logout</p>
      </Button>
    </nav>
  )
}

export default LeftSidebar