export const SkeletonSearchBar = () => {
  return (
    <div className="flex items-center gap-1 px-4 w-full mt-5 rounded-lg bg-gray-300 animate-pulse h-12">
      <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
      <div className="w-full h-6 bg-gray-300 rounded"></div>
    </div>
  );
};

export const SkeletonDropdown = () => {
  return (
    <div className="w-36 h-14 bg-gray-300 rounded-lg animate-pulse ml-auto"></div>
  );
};

export const SkeletonGridPost = () => {
  return (
    <div className="relative w-full h-80 sm:w-46 sm:h-72 bg-gray-300 animate-pulse rounded-lg mb-4">
      <div className="absolute bottom-2 left-2 flex items-center">
        <div className="h-6 w-6 bg-gray-400 rounded-full mr-2"></div>
        <div className="h-6 w-24 bg-gray-400 rounded"></div>
      </div>
    </div>
  );
};
