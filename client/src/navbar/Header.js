import {
  Avatar,
  Button,
  IconButton,
  AppBar as MuiAppBar,
  SvgIcon,
  Toolbar,
  styled,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import UserService from "../services/user.service";

const drawerWidth = 300;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: prop => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer - 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Header = ({ open }) => {
  const { user } = useSelector(state => state.auth);
  const [avatar, setAvatar] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const imageUrl = await UserService.getProfileImage(user.id);
        setAvatar(imageUrl);
      } catch (error) {
        console.log(error);
      }
    };

    if (!avatar) {
      fetchProfileImage();
    }
  }, [avatar, user.id]);

  return (
    <AppBar
      position="fixed"
      open={open}
      color="transparent"
      sx={theme => ({
        backdropFilter: "blur(6px)",
        backgroundColor: "rgba(20 26 33 / 0.8)",
        height: 64,

        ...(!open && {
          width: `calc(100% - (${theme.spacing(10)} + 1px))`,
          [theme.breakpoints.up("sm")]: {
            width: `calc(100% - (${theme.spacing(11)} + 1px))`,
          },
        }),
      })}
    >
      <Toolbar sx={{ marginLeft: "auto" }}>
        {user ? (
          <>
            <IconButton color="primary">
              <SvgIcon viewBox="0 0 24 24" fill="currentColor">
                <path
                  fill="currentColor"
                  d="M18.75 9v.704c0 .845.24 1.671.692 2.374l1.108 1.723c1.011 1.574.239 3.713-1.52 4.21a25.794 25.794 0 0 1-14.06 0c-1.759-.497-2.531-2.636-1.52-4.21l1.108-1.723a4.393 4.393 0 0 0 .693-2.374V9c0-3.866 3.022-7 6.749-7s6.75 3.134 6.75 7"
                  opacity="0.5"
                ></path>
                <path
                  fill="currentColor"
                  d="M12.75 6a.75.75 0 0 0-1.5 0v4a.75.75 0 0 0 1.5 0zM7.243 18.545a5.002 5.002 0 0 0 9.513 0c-3.145.59-6.367.59-9.513 0"
                ></path>
              </SvgIcon>
            </IconButton>
            <IconButton
              color="primary"
              sx={{ mr: 1, animation: "rotate 2s linear infinite" }}
            >
              <SvgIcon viewBox="0 0 24 24" fill="currentColor">
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="M14.279 2.152C13.909 2 13.439 2 12.5 2s-1.408 0-1.779.152a2.008 2.008 0 0 0-1.09 1.083c-.094.223-.13.484-.145.863a1.615 1.615 0 0 1-.796 1.353a1.64 1.64 0 0 1-1.579.008c-.338-.178-.583-.276-.825-.308a2.026 2.026 0 0 0-1.49.396c-.318.242-.553.646-1.022 1.453c-.47.807-.704 1.21-.757 1.605c-.07.526.074 1.058.4 1.479c.148.192.357.353.68.555c.477.297.783.803.783 1.361c0 .558-.306 1.064-.782 1.36c-.324.203-.533.364-.682.556a1.99 1.99 0 0 0-.399 1.479c.053.394.287.798.757 1.605c.47.807.704 1.21 1.022 1.453c.424.323.96.465 1.49.396c.242-.032.487-.13.825-.308a1.64 1.64 0 0 1 1.58.008c.486.28.774.795.795 1.353c.015.38.051.64.145.863c.204.49.596.88 1.09 1.083c.37.152.84.152 1.779.152s1.409 0 1.779-.152a2.008 2.008 0 0 0 1.09-1.083c.094-.223.13-.483.145-.863c.02-.558.309-1.074.796-1.353a1.64 1.64 0 0 1 1.579-.008c.338.178.583.276.825.308c.53.07 1.066-.073 1.49-.396c.318-.242.553-.646 1.022-1.453c.47-.807.704-1.21.757-1.605a1.99 1.99 0 0 0-.4-1.479c-.148-.192-.357-.353-.68-.555c-.477-.297-.783-.803-.783-1.361c0-.558.306-1.064.782-1.36c.324-.203.533-.364.682-.556a1.99 1.99 0 0 0 .399-1.479c-.053-.394-.287-.798-.757-1.605c-.47-.807-.704-1.21-1.022-1.453a2.026 2.026 0 0 0-1.49-.396c-.242.032-.487.13-.825.308a1.64 1.64 0 0 1-1.58-.008a1.615 1.615 0 0 1-.795-1.353c-.015-.38-.051-.64-.145-.863a2.007 2.007 0 0 0-1.09-1.083"
                  clipRule="evenodd"
                  opacity="0.5"
                ></path>
                <path
                  fill="currentColor"
                  d="M15.523 12c0 1.657-1.354 3-3.023 3c-1.67 0-3.023-1.343-3.023-3S10.83 9 12.5 9c1.67 0 3.023 1.343 3.023 3"
                ></path>
              </SvgIcon>
            </IconButton>
            <Avatar
              src={avatar && avatar}
              sx={{
                cursor: "pointer",
                transition: "transform 0.25s ease",
                "&:hover": {
                  transform: "scale(1.05) translateZ(0px)",
                },
              }}
            >
              {avatar ? "" : user.username.charAt(0).toUpperCase()}
            </Avatar>
          </>
        ) : (
          <>
            <Button onClick={() => navigate("/login")}>Login</Button>
            <Button onClick={() => navigate("/register")}>Register</Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
