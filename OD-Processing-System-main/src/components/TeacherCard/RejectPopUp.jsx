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

export default function PopupReject({ open, onClose, request, onReject }) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState(false);

  if (!request) return null; // Ensure request is valid before rendering

  const handleReject = () => {
    if (!reason.trim()) {
      setError(true);
      return;
    }
    onReject(request._id, reason); // Use _id instead of id
    setReason("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Reject Request</DialogTitle>
      <DialogContent>
        <Typography sx={{ mb: 2 }}>Are you sure you want to reject the request from {request.name}?</Typography>
        <TextField
          autoFocus
          required
          margin="dense"
          label="Reason for rejection"
          type="text"
          fullWidth
          multiline
          rows={4}
          value={reason}
          onChange={(e) => {
            setReason(e.target.value);
            setError(false);
          }}
          error={error}
          helperText={error ? "Rejection reason is required" : ""}
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