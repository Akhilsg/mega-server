import {
  Box,
  CssBaseline,
  ThemeProvider,
  createTheme,
  linearProgressClasses,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import { clearMessage } from "./actions/message";
import { ColorModeContext } from "./common/components/ColorModeContext";
import BoardAdmin from "./components/BoardAdmin";
import BoardModerator from "./components/BoardModerator";
import BoardUser from "./components/BoardUser";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import ResetPassword from "./components/ResetPassword";
import CreateCourseCard from "./components/course/Create";
import Dashboard from "./components/dashboard/Dashboard";
import AccountNav from "./components/profile/AccountNav";
import Profile from "./components/profile/Profile";
import Flashcards from "./components/studysets/flashcard/Flashcards";
import Analytics from "./components/studysets/quiz/Analytics";
import CreateQuizCard from "./components/studysets/quiz/Create";
import Quiz from "./components/studysets/quiz/Quiz";
import QuizList from "./components/studysets/quiz/Quizzes";
import Header from "./navbar/Header";
import MiniDrawer from "./sidebar/Sidebar";
import ViewStudyset from "./components/ViewStudyset";
import TakeCourse from "./components/course/TakeCourse";

const pxToRem = value => {
  return `${value / 16}rem`;
};

const responsiveFontSizes = ({ sm, md, lg }) => {
  return {
    "@media (min-width:600px)": {
      fontSize: pxToRem(sm),
    },
    "@media (min-width:900px)": {
      fontSize: pxToRem(md),
    },
    "@media (min-width:1200px)": {
      fontSize: pxToRem(lg),
    },
  };
};

const primaryFont = "Public Sans, sans-serif";
const secondaryFont = "Barlow, sans-serif";

const App = () => {
  const [open, setOpen] = useState(true);
  const [mode, setMode] = useState("dark");
  const location = useLocation();
  const dispatch = useDispatch();

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode(prevMode => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  useEffect(() => {
    if (["/login", "/register"].includes(location.pathname)) {
      dispatch(clearMessage());
    }
  }, [dispatch, location]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: mode,
          primary: {
            darker: "#004B50",
            lighter: "#C8FAD6",
            dark: "#007867",
            main: "#00A76F",
            light: "#5BE49B",
            contrastText: "#FFFFFF",
          },
          secondary: {
            main: "#8E33FF",
            light: "#C684FF",
            dark: "#5119B7",
            contrastText: "#FFFFFF",
          },
          error: {
            light: "#FFAC82",
            main: "#FF5630",
            dark: "#B71D18",
          },
          warning: {
            main: "#FFAB00",
          },
          disabled: {
            main: "rgba(145 158 171 / 0.24)",
          },
          success: {
            main: "#22C55E",
          },
          background: {
            default: mode === "dark" ? "#141A21" : "rgb(251, 251, 255)",
            paper: mode === "dark" ? "#1C252E" : "rgb(241, 245, 249)",
            neutral: mode === "dark" ? "#28323D" : "rgb(241, 245, 249)",
          },
          text: {
            secondary: mode === "dark" ? "#919EAB" : "#374151",
          },
        },
        shadows: [
          "none",
          "none",
          "rgba(0, 0, 0, 0.04) 0px 5px 22px, rgba(0, 0, 0, 0.03) 0px 0px 0px 0.5px",
          ...Array(22).fill("none"),
        ],
        components: {
          MuiTooltip: {
            styleOverrides: {
              tooltip: {
                backgroundColor: "#454f5b",
                borderRadius: "8px",
              },
            },
          },
          MuiDivider: {
            styleOverrides: {
              root: {
                borderColor:
                  mode === "dark"
                    ? "rgba(145, 158, 171, 0.2)"
                    : "rgb(241, 245, 249)",
              },
            },
          },
          MuiAlert: {
            styleOverrides: {
              root: {
                borderRadius: "8px",
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              contained: {
                boxShadow: "none",
              },
              outlined: {
                borderColor:
                  mode === "dark" ? "rgb(55, 65, 81)" : "rgb(229, 231, 235)",
                color: mode === "dark" ? "white" : "inherit",
                "&:hover": {
                  borderColor: mode === "dark" ? "white" : "rgb(241, 245, 249)",
                  backgroundColor: "inherit",
                },
              },
              root: {
                padding: "6px 12px",
                textTransform: "capitalize",
                borderRadius: "10px",
                fontWeight: 700,
              },
            },
          },
          MuiMenu: {
            styleOverrides: {
              list: {
                padding: "0px",
              },
              paper: {
                position: "absolute",
                minWidth: "148px",
                outline: "0px",
                backdropFilter: "blur(20px)",
                backgroundColor: "rgba(28, 37, 46, 0.9)",
                backgroundImage:
                  "url(https://pub-c5e31b5cdafb419fb247a8ac2e78df7a.r2.dev/public/assets/cyan-blur.png), url(https://pub-c5e31b5cdafb419fb247a8ac2e78df7a.r2.dev/public/assets/red-blur.png)",
                backgroundRepeat: "no-repeat, no-repeat",
                backgroundPosition: "right top, left bottom",
                backgroundSize: "50%, 50%",
                padding: "4px",
                boxShadow:
                  "rgba(0, 0, 0, 0.24) 0px 0px 2px 0px, rgba(0, 0, 0, 0.24) -20px 20px 40px -4px",
                borderRadius: "10px",
                overflow: "inherit",
              },
            },
          },
          MuiTableCell: {
            styleOverrides: {
              root: {
                borderBottom: "1px dashed rgba(145, 158, 171, 0.2)",
                fontWeight: 500,
                color: mode === "dark" ? "white" : "inherit",
              },
            },
          },
          MuiMenuItem: {
            styleOverrides: {
              root: {
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "14px",
                borderRadius: "6px",
                padding: "6px 8px",
                margin: "0px 0px 4px",
                "&:hover": {
                  backgroundColor: "rgba(145 158 171 / 0.08)",
                },
                "&.Mui-selected": {
                  backgroundColor: "rgba(145 158 171 / 0.16)",
                  backgroundImage: "transparent",
                  "&:hover": {
                    backgroundColor: "rgba(145 158 171 / 0.16)",
                  },
                },
                "&:last-child": {
                  marginBottom: 0,
                },
              },
            },
          },
          MuiDialog: {
            styleOverrides: {
              paper: {
                borderRadius: "16px",
                backgroundImage: "none",
                backgroundColor: mode === "dark" && "#1C252E",
                boxShadow: "rgba(0, 0, 0, 0.24) -40px 40px 80px -8px",
              },
              backdrop: {
                backgroundColor: "rgba(28, 37, 46, 0.4)",
              },
            },
          },
          MuiDialogTitle: {
            styleOverrides: {
              root: {
                fontWeight: 600,
                fontSize: "1.125rem",
                padding: "24px 24px 16px",
              },
            },
          },
          MuiIconButton: {
            styleOverrides: {
              root: {
                color: mode === "dark" && "rgb(156, 163, 175)",
              },
            },
          },
          MuiAutocomplete: {
            styleOverrides: {
              paper: {
                borderRadius: "10px",
                backgroundColor: mode === "dark" && "rgb(58,67,79)",
              },
            },
          },
          MuiChip: {
            styleOverrides: {
              root: {
                margin: "3px",
                maxWidth: "calc(100% - 6px)",
                fontSize: "0.8125rem",
                height: "28px",
                backgroundColor: "rgba(145 158 171 / 0.16)",
                borderRadius: "8px",
                "&:hover": {
                  backgroundColor: "rgba(145 158 171 / 0.24)",
                },
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: "16px",
                backgroundImage: "none",
                boxShadow:
                  "rgba(0, 0, 0, 0.2) 0px 0px 2px 0px, rgba(0, 0, 0, 0.12) 0px 12px 24px -4px",
              },
            },
          },
          MuiDrawer: {
            styleOverrides: {
              paper: {
                backgroundColor: mode === "dark" && "#141A21",
                borderRight: "1px solid #1d242b",
              },
            },
          },

          MuiOutlinedInput: {
            styleOverrides: {
              root: {
                borderRadius: "10px",
                "& fieldset": {
                  color: "#9CA3AF",
                  borderColor:
                    mode === "dark"
                      ? "rgba(145 158 171 / 0.2)"
                      : "rgb(229, 231, 235)",
                },
              },
            },
          },
          MuiLinearProgress: {
            styleOverrides: {
              root: {
                height: 10,
                borderRadius: 5,

                [`& .${linearProgressClasses.bar}`]: {
                  borderRadius: 5,
                  backgroundColor: "rgb(0, 167, 111)",
                },
              },
            },
          },
        },
        typography: {
          fontFamily: primaryFont,
          fontSecondaryFamily: secondaryFont,
          fontWeightRegular: 400,
          fontWeightMedium: 500,
          fontWeightSemiBold: 600,
          fontWeightBold: 700,
          h1: {
            fontWeight: 800,
            lineHeight: 80 / 64,
            fontSize: pxToRem(40),
            ...responsiveFontSizes({ sm: 52, md: 58, lg: 64 }),
          },
          h2: {
            fontWeight: 800,
            lineHeight: 64 / 48,
            fontSize: pxToRem(32),
            ...responsiveFontSizes({ sm: 40, md: 44, lg: 48 }),
          },
          h3: {
            fontWeight: 700,
            lineHeight: 1.5,
            fontSize: pxToRem(24),
            ...responsiveFontSizes({ sm: 26, md: 30, lg: 32 }),
          },
          h4: {
            fontWeight: 700,
            lineHeight: 1.5,
            fontSize: pxToRem(20),
            ...responsiveFontSizes({ sm: 20, md: 24, lg: 24 }),
          },
          h5: {
            fontWeight: 700,
            lineHeight: 1.5,
            fontSize: pxToRem(18),
            ...responsiveFontSizes({ sm: 19, md: 20, lg: 20 }),
          },
          h6: {
            fontWeight: 700,
            lineHeight: 28 / 18,
            fontSize: pxToRem(17),
            ...responsiveFontSizes({ sm: 18, md: 18, lg: 18 }),
          },
          subtitle1: {
            fontWeight: 600,
            lineHeight: 1.5,
            fontSize: pxToRem(16),
          },
          subtitle2: {
            fontWeight: 600,
            lineHeight: 22 / 14,
            fontSize: pxToRem(14),
          },
          body1: {
            lineHeight: 1.5,
            fontSize: pxToRem(16),
          },
          body2: {
            lineHeight: 22 / 14,
            fontSize: pxToRem(14),
          },
          caption: {
            lineHeight: 1.5,
            fontSize: pxToRem(12),
          },
          overline: {
            fontWeight: 700,
            lineHeight: 1.5,
            fontSize: pxToRem(12),
            textTransform: "uppercase",
          },
          button: {
            fontWeight: 700,
            lineHeight: 24 / 14,
            fontSize: pxToRem(14),
            textTransform: "unset",
          },
        },
      }),
    [mode]
  );
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <Box sx={{ display: "flex" }}>
            <CssBaseline />
            <Header open={open} />
            <MiniDrawer open={open} setOpen={setOpen} />

            <Box
              component="main"
              sx={{
                flexGrow: 1,
                p: "8px 24px 64px",
                mt: "80px",
              }}
            >
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/home" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/profile"
                  element={<Navigate to="/profile/settings" />}
                />
                <Route path="/profile/settings" element={<Profile />} />
                <Route path="/profile/*" element={<AccountNav />} />
                <Route path="/user" element={<BoardUser />} />
                <Route path="/mod" element={<BoardModerator />} />
                <Route path="/admin" element={<BoardAdmin />} />
                <Route path="/generate/studyset" element={<CreateQuizCard />} />
                <Route path="/generate/course" element={<CreateCourseCard />} />
                <Route path="/course/:courseId" element={<TakeCourse />} />
                <Route path="/quiz/:quizId" element={<Quiz />} />
                <Route path="/flashcard/:quizId" element={<Flashcards />} />
                <Route path="/studysets" element={<QuizList />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route
                  path="/studyset/:studysetId"
                  element={<ViewStudyset />}
                />
              </Routes>
            </Box>
          </Box>
          {/* <AuthVerify logOut={logOut}/> */}
        </ThemeProvider>
      </ColorModeContext.Provider>
    </LocalizationProvider>
  );
};

export default App;
