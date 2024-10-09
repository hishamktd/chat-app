import React from "react";
import { Typography, Button, Box } from "@mui/material";
import Link from "next/link";

export default function Home() {
  return (
    <Box sx={{ textAlign: "center", mt: 4 }}>
      <Typography variant="h2">Welcome to Our Chat App</Typography>
      <Box sx={{ mt: 2 }}>
        <Button
          component={Link}
          href="/login"
          variant="contained"
          sx={{ mr: 2 }}
        >
          Login
        </Button>
        <Button component={Link} href="/register" variant="outlined">
          Register
        </Button>
      </Box>
    </Box>
  );
}
