import HomeIcon from "@mui/icons-material/Home";
import ExploreIcon from "@mui/icons-material/Explore";
import PeopleIcon from "@mui/icons-material/People";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import CreateIcon from "@mui/icons-material/Create";
import { INavLink } from "@/types";

export const sidebarLinks: INavLink[] = [
  {
    icon: HomeIcon,
    route: "/",
    label: "Home",
  },
  {
    icon: ExploreIcon,
    route: "/explore",
    label: "Explore",
  },
  {
    icon: PeopleIcon,
    route: "/all-users",
    label: "People",
  },
  {
    icon: BookmarkIcon,
    route: "/saved",
    label: "Saved",
  },
  {
    icon: CreateIcon,
    route: "/create-post",
    label: "Create Post",
  },
];

  export const bottombarLinks :INavLink[] = [
    {
      icon: HomeIcon,
      route: "/",
      label: "Home",
    },
    {
      icon: PeopleIcon,
      route: "/all-users",
      label: "People",
    },
    {
      icon: ExploreIcon,
      route: "/explore",
      label: "Explore",
    },
    {
      icon: BookmarkIcon,
      route: "/saved",
      label: "Saved",
    },
    {
      icon: CreateIcon,
      route: "/create-post",
      label: "Create",
    },
  ];