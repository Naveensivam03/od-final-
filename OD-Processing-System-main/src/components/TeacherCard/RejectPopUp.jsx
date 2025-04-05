import React, { useState } from "react";
import { 
  Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  Typography,
  TextField
} from "@mui/material";

export default function PopupReject({ open, onClose, onReject }) {
  const [reason, setReason] = useState("");

  const handleReject = () => {
    onReject(reason);
    setReason("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Reject Request</DialogTitle>
      <DialogContent>
        <Typography sx={{ mb: 2 }}>Please provide a reason for rejecting this request:</Typography>
        <TextField
          autoFocus
          margin="dense"
          label="Reason"
          type="text"
          fullWidth
          multiline
          rows={4}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          sx={{ mt: 1 }}
        />
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} color="primary">Cancel</Button>
        <Button 
          onClick={handleReject}
          color="error" 
          variant="contained"
          disabled={!reason.trim()}
        >
          Reject
        </Button>
      </DialogActions>
    </Dialog>
  );
}
