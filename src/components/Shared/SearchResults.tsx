import { Models } from "appwrite";
import Loader from "./Loader";
import GridPostList from "./GridPostsList";

type searchResultsProps = {
  isSearchFetching: boolean;
  searchedPosts: Models.Document[]
}

const SearchResults = ({ isSearchFetching, searchedPosts }: searchResultsProps) => {
  if (isSearchFetching) return <Loader />
  if (searchedPosts && searchedPosts.length > 0) {
    return (
      <GridPostList posts={searchedPosts} />
    )
  }
  return (
    <p className="tex-light-4 mt-10 text-center w-full">No results found</p>
  )
}

export default SearchResults