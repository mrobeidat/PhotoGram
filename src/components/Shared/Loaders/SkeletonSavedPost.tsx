const SkeletonSavedPost = () => {
    return (
      <div className="p-4 animate-pulse">
        <div className="h-48 bg-gray-300 rounded-lg mb-4"></div>
        <div className="flex items-center">
          <div className="h-6 w-6 bg-gray-300 rounded-full mr-2"></div>
          <div className="h-6 w-24 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  };
  
  export default SkeletonSavedPost;
  