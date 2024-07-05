import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/useDebounce";
import {
  useGetPosts,
  useSearchPosts,
} from "@/lib/react-query/queriesAndMutations";
import { memo, useEffect, useState, useCallback } from "react";
import ExploreLoader from "../../components/Shared/Loaders/ExploreLoader";
import Loader from "@/components/Shared/Loader";
import { useInView } from "react-intersection-observer";
import GridPostList from "@/components/Shared/GridPostsList";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";

export type SearchResultProps = {
  isSearchFetching: boolean;
  searchedPosts: any;
};

const SearchResults = memo(
  ({ isSearchFetching, searchedPosts }: SearchResultProps) => {
    if (isSearchFetching) {
      return <Loader />;
    } else if (searchedPosts && searchedPosts.documents?.length > 0) {
      return <GridPostList posts={searchedPosts.documents} filter="week" />;
    } else {
      return (
        <p className="text-light-4 mt-10 text-center w-full">
          No results found
        </p>
      );
    }
  }
);

const Explore = () => {
  const hasShownAlert = sessionStorage.getItem("hasShownAlert");
  const showAlert = useCallback(() => {
    if (!hasShownAlert) {
      toast.info("This page displays posts created within this week!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        style: {
          backgroundColor: "rgb(63, 94, 251)",
          background:
            "radial-gradient(circle, rgb(29, 43, 110) 0%, rgba(0, 0, 0, 1) 100%)",
          width: "fit-content",
        },
      });
    }
    sessionStorage.setItem("hasShownAlert", "true");
  }, [hasShownAlert]);

  useEffect(() => {
    showAlert();
  }, [showAlert]);

  const { ref, inView } = useInView();
  const {
    data: posts,
    fetchNextPage,
    hasNextPage,
    isLoading: isLoadingPosts,
  } = useGetPosts();
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 500);
  const { data: searchedPosts, isFetching: isSearchFetching } =
    useSearchPosts(debouncedSearch);

  const [filter, setFilter] = useState<"week" | "month" | "year">("year");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (inView && !searchValue) {
      fetchNextPage();
    }
  }, [inView, searchValue, fetchNextPage]);

  const handleFilterChange = (
    event: SelectChangeEvent<"week" | "month" | "year">
  ) => {
    setFilter(event.target.value as "week" | "month" | "year");
  };

  const handleDropdownOpen = () => {
    setIsDropdownOpen(true);
  };

  const handleDropdownClose = () => {
    setIsDropdownOpen(false);
  };

  if (isLoadingPosts) {
    return (
      <div className="flex justify-center items-center w-full h-full">
        <div className="flex flex-col sm:flex-row resize-y">
          <div className="explore-loader-wrapper mb-2 sm:mb-0">
            <ExploreLoader />
          </div>
          <div className="explore-loader-wrapper hidden sm:block">
            <ExploreLoader />
          </div>
          <div className="explore-loader-wrapper hidden sm:block">
            <ExploreLoader />
          </div>
        </div>
      </div>
    );
  }

  const shouldShowSearchResults = searchValue !== "";
  const shouldShowPosts =
    !shouldShowSearchResults &&
    posts?.pages.every((item) => item.documents.length === 0);

  return (
    <div className="explore-container">
      <ToastContainer />
      <div className="explore-inner_container">
        <h2 className="h3-bold md:h2-bold w-full">Search Posts</h2>
        <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
          <img
            src="/assets/icons/search.svg"
            width={24}
            height={24}
            alt="search"
          />
          <Input
            type="text"
            placeholder="Search by caption"
            className="explore-search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>
      <div className="flex justify-between items-center w-full max-w-5xl mt-16 mb-7 text-white">
        <h3 className="body-bold md:h3-bold">Popular this week</h3>
        <FormControl variant="outlined" sx={{ minWidth: 150, color: "white" }}>
          <InputLabel sx={{ color: "white" }}>Filter</InputLabel>
          <Select
            value={filter}
            onChange={handleFilterChange}
            onOpen={handleDropdownOpen}
            onClose={handleDropdownClose}
            label="Filter"
            MenuProps={{
              sx: {
                "& .MuiPaper-root": {
                  backdropFilter: "blur(30px)",
                  backgroundColor: "rgba(0, 0, 0, 0.3)",
                },
              },
            }}
            sx={{
              color: "white",
              ".MuiOutlinedInput-notchedOutline": {
                borderColor: "white",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor:
                  "linear-gradient(90deg, rgba(63,94,251,1) 0%, rgba(29,43,110,1) 100%)",
              },
              ".MuiSvgIcon-root": {
                color: "white",
                transition: "transform 0.3s ease",
                transform: isDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
              },
            }}
          >
            <MenuItem value="week" sx={{ color: "white" }}>
              This Week
            </MenuItem>
            <MenuItem value="month" sx={{ color: "white" }}>
              This Month
            </MenuItem>
            <MenuItem value="year" sx={{ color: "white" }}>
              This Year
            </MenuItem>
          </Select>
        </FormControl>
      </div>
      <div className="flex flex-wrap gap-9 w-full max-w-5xl">
        {shouldShowSearchResults ? (
          <SearchResults
            isSearchFetching={isSearchFetching}
            searchedPosts={searchedPosts}
          />
        ) : shouldShowPosts ? (
          <p className="text-light-4 mt-10 text-center w-full">End of posts</p>
        ) : (
          posts?.pages.map((item, index) => (
            <GridPostList
              key={`page-${index}`}
              posts={item.documents}
              filter={filter}
            />
          ))
        )}
      </div>
      {hasNextPage && !searchValue && (
        <div
          ref={ref}
          className="mt-10 flex justify-center items-center w-full h-full"
        >
          <Loader />
        </div>
      )}
    </div>
  );
};

export default Explore;
