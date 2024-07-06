import React from "react";
import { Dialog, DialogContent, DialogTitle, DialogActions, Button } from "@mui/material";

interface InfoModalProps {
  open: boolean;
  handleClose: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ open, handleClose }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Welcome to PhotoGrammer!</DialogTitle>
      <DialogContent>
        <p>Follow more users to see their posts here. Start exploring and connecting with others!</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InfoModal;
