import React, { Fragment, ReactNode } from "react";
import {
  Box,
  AppBar as AppBarComponent,
  Toolbar,
  Typography,
  Container,
  Grid2,
} from "@mui/material";
import Link from "next/link";

type LayoutProps = {
  children: ReactNode;
};

const AppBar = ({ children }: LayoutProps) => {
  return (
    <Fragment>
      {/* Navigation Bar */}
      <AppBarComponent position="static">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Grid2 container gap={2} alignItems="center">
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              <Link href="/" passHref>
                Chat App
              </Link>
            </Typography>
            <Link href="/chat" passHref>
              <Typography variant="subtitle1">Chat</Typography>
            </Link>
            <Link href="/chat-room" passHref>
              <Typography variant="subtitle1">Chat Room</Typography>
            </Link>
          </Grid2>
          <Link href="/profile" passHref>
            <Typography variant="subtitle1">Profile</Typography>
          </Link>
        </Toolbar>
      </AppBarComponent>

      {/* Main Content */}
      <Container sx={{ mt: 4 }}>
        <Box>{children}</Box>
      </Container>
    </Fragment>
  );
};

export default AppBar;
