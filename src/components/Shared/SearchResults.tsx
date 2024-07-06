import { Models } from "appwrite";
import Loader from "./Loader";
import GridPostList from "./GridPostsList";

type SearchResultsProps = {
  isSearchFetching: boolean;
  searchedPosts: Models.Document[];
  filter: 'week' | 'month' | 'year';
};

const SearchResults = ({ isSearchFetching, searchedPosts, filter }: SearchResultsProps) => {
  if (isSearchFetching) return <Loader />;
  if (searchedPosts && searchedPosts.length > 0) {
    return (
      <GridPostList posts={searchedPosts} filter={filter} isLoading={false} />
    );
  }
  return (
    <p className="text-light-4 mt-10 text-center w-full">No results found</p>
  );
};

export default SearchResults;
