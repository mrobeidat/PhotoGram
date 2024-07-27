export const CommentsLoader = () => {
  const numberOfPlaceholders = 2;

  const placeholders = Array.from({ length: numberOfPlaceholders });

  return (
    <div className="space-y-3 mb-5 p-2">
      {placeholders.map((_, index) => (
        <div key={index} className="flex items-start gap-3 pt-2">
          <div className="w-8 h-8 rounded-full bg-gray-200 shimmer" />
          <div className="flex-1">
            <div className="bg-white/10 p-2 rounded-lg">
              <div className="h-4 bg-gray-200 rounded w-full mb-2 shimmer"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2 shimmer"></div>
              <div className="h-3 bg-gray-200 rounded w-full shimmer"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
