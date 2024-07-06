const SkeletonUserCard = () => {
  return (
    <div className="user-card p-4 animate-pulse">
      <div className="rounded-full bg-gray-100 w-14 h-14 mb-4 opacity-50"></div>
      <div className="flex-center flex-col gap-1">
        <div className="flex items-center">
          <div className="bg-gray-100 h-6 w-24 mb-2 rounded opacity-50"></div>
        </div>
        <div className="bg-gray-100 h-4 w-20 mb-2 rounded opacity-50"></div>
      </div>
      <div className="bg-gray-100 h-8 w-32 rounded opacity-50"></div>
    </div>
  );
};

export default SkeletonUserCard;
