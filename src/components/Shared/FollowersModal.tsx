import React from "react";
import { Modal, Box, Typography, IconButton, Fade } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SkeletonLoader from "./Loaders/SkeletonLoader";
import FollowerSkeleton from "./Loaders/FollowerSkeleton";

interface IUser {
  id: string;
  name: string;
  imageUrl: string;
}

interface FollowersModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  users: IUser[];
  isLoading: boolean;
}

const EmptyState: React.FC<{ message: string }> = ({ message }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        textAlign: "center",
        color: "white",
      }}
    >
      <svg
        width={100}
        height={100}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13l-1.41 1.41L12 13.41 8.41 16.59 7 15.17l3.59-3.59L7 8l1.41-1.41L12 10.59l3.59-3.59L17 8l-3.59 3.59L17 15z"
          fill="white"
        />
      </svg>
      <Typography variant="h6" sx={{ mt: 2 }}>
        {message}
      </Typography>
    </Box>
  );
};

const FollowersModal: React.FC<FollowersModalProps> = ({
  isOpen,
  onClose,
  title,
  users,
  isLoading,
}) => {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      closeAfterTransition
      BackdropProps={{
        timeout: 500,
        sx: { backdropFilter: "blur(10px)" },
      }}
    >
      <Fade in={isOpen} timeout={300}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: "500px",
            maxHeight: "50%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(15px)",
            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
            padding: 4,
            // borderRadius: "16px",
            color: "white",
            overflowY: "scroll",
            transition: "all 0.3s ease",
            "&:focus-visible": {
              outline: "none",
            },
            "&::-webkit-scrollbar": {
              borderRadius: "50px",
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              borderRadius: "50px",
              background: "rgba(255, 255, 255, 0.1)",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgb(77, 0, 112, 0.7)",
              borderRadius: "50px",
              border: "2px solid rgba(30, 30, 30, 0.9)",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: "rgb(77, 0, 112, 1)",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6" component="h2">
              {title}
            </Typography>
            <IconButton onClick={onClose} sx={{ color: "white" }}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {isLoading ? (
              Array.from(new Array(5)).map((_, index) => (
                <SkeletonLoader key={index} />
              ))
            ) : users.length === 0 ? (
              <EmptyState message="No users to display" />
            ) : (
              users.map((user) => (
                <FollowerSkeleton key={user.id} user={user} onClose={onClose} />
              ))
            )}
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default FollowersModal;
