const SkeletonUserCard = () => {
    return (
      <div className="user-card p-4 animate-pulse">
        <div className="rounded-full bg-gray-300 w-14 h-14 mb-4"></div>
        <div className="flex-center flex-col gap-1">
          <div className="flex items-center">
            <div className="bg-gray-300 h-6 w-24 mb-2 rounded"></div>
          </div>
          <div className="bg-gray-300 h-4 w-20 mb-2 rounded"></div>
        </div>
        <div className="bg-gray-300 h-8 w-32 rounded"></div>
      </div>
    );
  };
  
  export default SkeletonUserCard;
  