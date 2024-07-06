import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Button } from "@/components/ui/button";

const DeleteButton: React.FC<{ onDelete: () => void }> = ({ onDelete }) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirmDelete = () => {
    setOpen(false);
    onDelete();
  };

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Tooltip title="Delete" arrow>
        <IconButton
          onClick={handleClickOpen}
          size="small"
          style={{ color: "white" }}
        >
          <DeleteOutlineIcon className="text-red !text-[20px] hover:scale-110 transform duration-800" />
        </IconButton>
      </Tooltip>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          "& .MuiPaper-root": {
            backdropFilter: "blur(40px)",
            backgroundColor: "rgba(0, 0, 0, 0.1)",
            color: "white",
            borderRadius: "20px",
            maxWidth: "25rem",
          },
        }}
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            className="!text-white"
          >
            Are you sure you want to delete this comment? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} className="bg-white/20 rounded-full">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            autoFocus
            className="bg-red rounded-full cursor-pointer"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DeleteButton;
