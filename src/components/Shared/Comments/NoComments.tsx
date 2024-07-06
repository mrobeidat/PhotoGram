import React from "react";

const NoComments: React.FC = () => (
  <div className="flex flex-col justify-center items-center text-light-4 text-center pb-5 overflow-hidden">
    <svg
      width="200"
      height="200"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="m-auto mb-4"
    >
      <path
        d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 13.6569 3.59695 15.1566 4.63604 16.3636L3 21L7.63604 19.3636C8.84315 20.4036 10.3439 21 12 21Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-pulse"
      />
    </svg>
    <p>No comments yet. Be the first to comment!</p>
  </div>
);

export default NoComments;
