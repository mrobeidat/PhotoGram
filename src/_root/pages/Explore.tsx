import { Input } from "@/components/ui/input"
import useDebounce from "@/hooks/useDebounce"
import { useGetPosts, useSearchPosts } from "@/lib/react-query/queriesAndMutations"
import { useEffect, useState } from "react"
import ExploreLoader from '../../components/Shared/Loaders/ExploreLoader'
import Loader from "@/components/Shared/Loader"
import { useInView } from "react-intersection-observer"
import GridPostList from "@/components/Shared/GridPostsList"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export type SearchResultProps = {
  isSearchFetching: boolean;
  searchedPosts: any;
};

const SearchResults = ({ isSearchFetching, searchedPosts }: SearchResultProps) => {
  if (isSearchFetching) {
    return <Loader />;
  } else if (searchedPosts && searchedPosts.documents?.length > 0) {
    return <GridPostList posts={searchedPosts.documents} />;
  } else {
    return (
      <p className="text-light-4 mt-10 text-center w-full">No results found</p>
    );
  }
};

const Explore = () => {
  const hasShownAlert = sessionStorage.getItem('hasShownAlert');
  const showAlert = () => {
    if (!hasShownAlert) {
      toast.info('This page displays posts created within this week!', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
        style: {
          backgroundColor: "rgb(63, 94, 251)",
          background: "radial-gradient(circle, rgb(29, 43, 110) 0%, rgba(0, 0, 0, 1) 100%)",
          width: "fit-content"
        },
      });
    }
    sessionStorage.setItem('hasShownAlert', 'true');

  };

  useEffect(() => {
    showAlert()
  }, [])

  const { ref, inView } = useInView();
  const { data: posts, fetchNextPage, hasNextPage } = useGetPosts();
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 500);
  const { data: searchedPosts, isFetching: isSearchFetching } = useSearchPosts(debouncedSearch);

  useEffect(() => {
    if (inView && !searchValue) {
      fetchNextPage();
    }
  }, [inView, searchValue]);

  if (!posts) {
    return (
      <div className="flex-center w-full h-full">
        <div className="flex flex-col sm:flex-row resize-y">
          {/* Mobile */}
          <div className="explore-loader-wrapper mb-2 sm:mb-0">
            <ExploreLoader />
          </div>

          {/* Desktop */}
          <div className="explore-loader-wrapper hidden sm:block">
            <ExploreLoader />
          </div>
          <div className="explore-loader-wrapper hidden sm:block">
            <ExploreLoader />
          </div>
        </div>
      </div>
    )
  }
  const shouldShowSearchResults = searchValue !== "";
  const shouldShowPosts = !shouldShowSearchResults &&
    posts.pages.every((item) => item.documents.length === 0);


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
          <Input type="text"
            placeholder="Search by caption"
            className="explore-search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>
      <div className="flex-between w-full max-w-5xl mt-16 mb-7">
        <h3 className="body-bold md:h3-bold">Popular this week</h3>
        <div className="flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer">
          <p className="small-medium md:base-medium text-light-2">All</p>
          <img src="/assets/icons/filter.svg"
            width={20}
            height={20}
            alt="filter"
          />
        </div>
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
          posts.pages.map((item, index) => (
            <GridPostList key={`page-${index}`} posts={item.documents} />
          ))
        )}
      </div>
      {hasNextPage && !searchValue && (
        <div ref={ref} className="mt-10 flex-center w-full h-full">
          <Loader />
        </div>
      )}
    </div>
  )
}

export default Explore