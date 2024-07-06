import React, { useState } from "react";
import { Box, Avatar, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { styled, keyframes } from "@mui/material/styles";

interface FollowerSkeletonProps {
  user: {
    id: string;
    name: string;
    imageUrl: string;
  };
  onClose: () => void;
}

const pulse = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
  100% {
    opacity: 1;
  }
`;

const Shimmer = styled("div")({
  width: "100%",
  height: "100%",
  background: "#c0c0c0",
  animation: `${pulse} 1.8s infinite`,
  borderRadius: "50%",
});

const FollowerSkeleton: React.FC<FollowerSkeletonProps> = ({
  user,
  onClose,
}) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  return (
    <Box
      component={Link}
      to={`/profile/${user.id}`}
      onClick={onClose}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderRadius: "8px",
        padding: "8px 12px",
        textDecoration: "none",
        color: "white",
        transition: "background-color 0.3s ease",
        "&:hover": {
          backgroundColor: "rgba(255, 255, 255, 0.2)",
        },
      }}
    >
      <Box sx={{ position: "relative", width: 40, height: 40 }}>
        {!isImageLoaded && <Shimmer />}
        <Avatar
          src={user.imageUrl}
          alt={user.name}
          onLoad={handleImageLoad}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 40,
            height: 40,
            display: isImageLoaded ? "block" : "none",
            transition: "opacity 0.3s ease-in-out",
            opacity: isImageLoaded ? 1 : 0,
          }}
        />
      </Box>
      <Typography>{user.name}</Typography>
    </Box>
  );
};

export default FollowerSkeleton;
