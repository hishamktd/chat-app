import React from "react";
import { Typography, TextField, Button, Box } from "@mui/material";

export default function Register() {
  return (
    <Box sx={{ maxWidth: 400, margin: "auto", mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Register
      </Typography>
      <form>
        <TextField fullWidth label="Username" margin="normal" />
        <TextField fullWidth label="Email" type="email" margin="normal" />
        <TextField fullWidth label="Password" type="password" margin="normal" />
        <TextField
          fullWidth
          label="Confirm Password"
          type="password"
          margin="normal"
        />
        <Button fullWidth variant="contained" sx={{ mt: 2 }}>
          Register
        </Button>
      </form>
    </Box>
  );
}
