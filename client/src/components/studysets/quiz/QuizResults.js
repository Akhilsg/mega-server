import { Icon } from "@iconify/react/dist/iconify.js";
import { KeyboardArrowUp, Search } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Collapse,
  Container,
  Divider,
  Grid,
  Grow,
  IconButton,
  InputAdornment,
  ListItem,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { ChevronLeft, History } from "lucide-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import check from "../../../images/ic-check.png";
import clock from "../../../images/ic-clock.png";
import ResultsImage from "./ResultsImage";

export default function QuizResults({
  explanations,
  setExplanations,
  setIsExplanationModalOpen,
  quizId,
  results,
  currentQuiz,
  questions,
  timer,
}) {
  const { user } = useSelector(state => state.auth);
  const [questionOpenStates, setQuestionOpenStates] = useState({});
  const [explLoading, setExplLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleExplanationButtonClick = async () => {
    setExplLoading(true);

    try {
      if (!explanations || !explanations.length) {
        const response = await axios.post(
          `http://localhost:8080/api/quiz/explain/${quizId}`
        );
        setExplanations(response.data.explanations);
      }

      setExplLoading(false);
      console.log(explanations);
      setIsExplanationModalOpen(true);
    } catch (error) {
      console.error("Error fetching explanations:", error);
    }
  };

  const calculateElapsedTime = time => {
    if (time < 60) return `${time} sec`;
    if (time < 3600) return `${Math.floor(time / 60)} min ${time % 60} sec`;
    return `${Math.floor(time / 3600)} hrs ${Math.floor(
      (time % 3600) / 60
    )} min`;
  };

  const handleCollapseToggle = questionId => {
    setQuestionOpenStates(prevStates => ({
      ...prevStates,
      [questionId]: !prevStates[questionId],
    }));
  };

  const filteredQuestions = results.selectedAnswers.filter(result =>
    currentTab === 0
      ? true
      : currentTab === 1
      ? result.isCorrect
      : !result.isCorrect
  );

  return (
    <Container maxWidth="lg">
      <Grid container alignItems="start">
        <Grid item xs={12}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
            <Link to={`/studyset/${quizId}`} style={{ textDecoration: "none" }}>
              <Grow in>
                <Button
                  startIcon={<ChevronLeft />}
                  variant="outlined"
                  color="inherit"
                >
                  Back
                </Button>
              </Grow>
            </Link>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Grow in>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundImage:
                  "linear-gradient(to right, rgb(20, 26, 33) 25%, rgba(0, 75, 80, 0.88)), url(https://pub-c5e31b5cdafb419fb247a8ac2e78df7a.r2.dev/public/assets/background/background-6.webp)",
                boxShadow:
                  "rgba(0, 0, 0, 0.2) 0px 0px 2px 0px, rgba(0, 0, 0, 0.12) 0px 8px 20px -4px",
                backgroundColor: "rgba(0, 0, 0, 0)",
                backgroundPosition: "center center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                border: "1px solid rgb(28, 37, 46)",
                borderRadius: 4,
                padding: "40px 24px 40px 40px",
                gap: "40px",
                mb: 3,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minHeight: "100%",
                }}
              >
                <div>
                  <Typography variant="h4" gutterBottom>
                    Congratulations 🎉
                    <div>
                      {user.fName} {user.lName}
                    </div>
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ mb: 4 }}
                  >
                    Finished{" "}
                    <span
                      style={{
                        textTransform: "capitalize",
                      }}
                    >
                      {currentQuiz.title}
                    </span>{" "}
                    quiz with a score of {results.score} out of{" "}
                    {questions.length}!
                  </Typography>
                </div>
                <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                  <Link to="/studysets" style={{ textDecoration: "none" }}>
                    <Grow in>
                      <Button variant="contained" startIcon={<History />}>
                        Go to recent studysets now
                      </Button>
                    </Grow>
                  </Link>
                  <Link
                    to={`/analytics?search=${currentQuiz.title}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Grow in>
                      <Button
                        variant="contained"
                        color="info"
                        sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                        startIcon={<History />}
                      >
                        Or view analytics
                      </Button>
                    </Grow>
                  </Link>
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  width: "320px",
                  margin: "auto",
                  height: "auto",
                  maxWidth: "100%",
                  flexShrink: 0,
                }}
              >
                <ResultsImage />
              </Box>
            </Box>
          </Grow>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={4}>
            <Grow in>
              <Paper
                sx={{
                  backgroundImage: "none",
                  boxShadow:
                    "rgba(0, 0, 0, 0.2) 0px 0px 2px 0px, rgba(0, 0, 0, 0.12) 0px 12px 24px -4px",
                  borderRadius: 4,
                  overflow: "hidden",
                  position: "relative",
                  padding: "24px 20px 24px 24px",
                  zIndex: 0,
                }}
              >
                <Box
                  sx={{
                    flexGrow: 1,
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      lineHeight: 1.5,
                    }}
                  >
                    {((results.score / questions.length) * 100).toFixed(0)}%
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    Accuracy
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: "40px",
                    height: "40px",
                    display: "inline-flex",
                    mask: `url(${check}) center center / contain no-repeat`,
                    top: "24px",
                    right: "17px",
                    position: "absolute",
                    background:
                      "linear-gradient(135deg, #22C55E 0%, #118D57 100%)",
                  }}
                />
                <Box
                  sx={{
                    top: "-44px",
                    width: "160px",
                    zIndex: -1,
                    height: "160px",
                    right: "-104px",
                    opacity: 0.12,
                    borderRadius: "24px",
                    position: "absolute",
                    transform: "rotate(40deg)",
                    background:
                      "linear-gradient(to right, #22C55E 0%, rgba(255 171 0 / 0) 100%)",
                  }}
                />
              </Paper>
            </Grow>
          </Grid>
          <Grid item xs={4}>
            <Grow in>
              <Paper
                sx={{
                  backgroundImage: "none",
                  boxShadow:
                    "rgba(0, 0, 0, 0.2) 0px 0px 2px 0px, rgba(0, 0, 0, 0.12) 0px 8px 20px -4px",
                  borderRadius: 4,
                  overflow: "hidden",
                  position: "relative",
                  padding: "24px 20px 24px 24px",
                  zIndex: 0,
                }}
              >
                <Box
                  sx={{
                    flexGrow: 1,
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      lineHeight: 1.5,
                    }}
                  >
                    {calculateElapsedTime(
                      results.timeTaken ? results.timeTaken : timer
                    )}
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    Taken for this quiz
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: "36px",
                    height: "36px",
                    display: "inline-flex",
                    mask: `url(${clock}) center center / contain no-repeat`,
                    top: "24px",
                    right: "20px",
                    position: "absolute",
                    background:
                      "linear-gradient(135deg, #FFAB00 0%, #B76E00 100%)",
                  }}
                />
                <Box
                  sx={{
                    top: "-44px",
                    width: "160px",
                    zIndex: -1,
                    height: "160px",
                    right: "-104px",
                    opacity: 0.12,
                    borderRadius: "24px",
                    position: "absolute",
                    transform: "rotate(40deg)",
                    background:
                      "linear-gradient(to right, #FFAB00 0%, rgba(255 171 0 / 0) 100%)",
                  }}
                />
              </Paper>
            </Grow>
          </Grid>
          <Grid item xs={4}>
            <Grow in>
              <Paper
                sx={{
                  backgroundImage: "none",
                  boxShadow:
                    "rgba(0, 0, 0, 0.2) 0px 0px 2px 0px, rgba(0, 0, 0, 0.12) 0px 12px 24px -4px",
                  borderRadius: 4,
                  overflow: "hidden",
                  position: "relative",
                  padding: "24px 20px 24px 24px",
                  zIndex: 0,
                }}
              >
                <Box
                  sx={{
                    flexGrow: 1,
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      lineHeight: 1.5,
                    }}
                  >
                    {questions.length}
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    Questions
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: "40px",
                    height: "40px",
                    display: "inline-flex",
                    mask: "url(https://pub-c5e31b5cdafb419fb247a8ac2e78df7a.r2.dev/public/assets/icons/courses/ic-courses-progress.svg) center center / contain no-repeat",
                    top: "24px",
                    right: "17px",
                    position: "absolute",
                    background:
                      "linear-gradient(135deg, #8E33FF 0%, #5119B7 100%)",
                  }}
                />
                <Box
                  sx={{
                    top: "-44px",
                    width: "160px",
                    zIndex: -1,
                    height: "160px",
                    right: "-104px",
                    opacity: 0.12,
                    borderRadius: "24px",
                    position: "absolute",
                    transform: "rotate(40deg)",
                    background:
                      "linear-gradient(to right, #8E33FF 0%, rgba(255 171 0 / 0) 100%)",
                  }}
                />
              </Paper>
            </Grow>
          </Grid>
        </Grid>
      </Grid>
      <Divider sx={{ my: 4 }} />
      <Grow in>
        <Paper
          sx={{
            borderRadius: 4,
            boxShadow:
              "rgba(0, 0, 0, 0.2) 0px 0px 2px 0px, rgba(0, 0, 0, 0.12) 0px 8px 20px -4px",
            backgroundImage: "none",
          }}
        >
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            textColor="inherit"
            TabIndicatorProps={{
              children: <span className="MuiTabs-indicatorSpan" />,
            }}
            sx={{
              px: 1,
              boxShadow: "inset 0 -2px 0 0 rgba(145 158 171 / 0.08)",
              "& .MuiTabs-indicator": {
                display: "flex",
                justifyContent: "center",
                backgroundColor: "transparent",
              },
              "& .MuiTabs-indicatorSpan": {
                maxWidth: "80%",
                width: "100%",
                backgroundColor:
                  currentTab === 0
                    ? "white"
                    : currentTab === 1
                    ? "success.main"
                    : "error.main",
              },
            }}
          >
            <Tab
              label="All"
              iconPosition="end"
              disableRipple
              sx={{ minHeight: "48px", minWidth: 0 }}
              icon={
                <Box
                  sx={{
                    height: "24px",
                    minWidth: "24px",
                    bgcolor: "white",
                    color: "background.paper",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "6px",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    px: "6px",
                  }}
                >
                  {questions.length}
                </Box>
              }
            />
            <Tab
              label="Correct"
              iconPosition="end"
              disableRipple
              sx={{ minHeight: "48px", minWidth: 0 }}
              icon={
                <Box
                  sx={{
                    height: "24px",
                    minWidth: "24px",
                    bgcolor: "rgba(34, 197, 94, 0.16)",
                    color: "success.main",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "6px",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    px: "6px",
                  }}
                >
                  {questions.filter(question => question.isCorrect).length}
                </Box>
              }
            />
            <Tab
              label="Incorrect"
              iconPosition="end"
              disableRipple
              sx={{ minHeight: "48px", minWidth: 0 }}
              icon={
                <Box
                  sx={{
                    height: "24px",
                    minWidth: "24px",
                    bgcolor: "rgba(255, 86, 48, 0.16)",
                    color: "error.main",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "6px",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    px: "6px",
                  }}
                >
                  {questions.filter(question => !question.isCorrect).length}
                </Box>
              }
            />
          </Tabs>
          <Box
            sx={{
              p: "20px",
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ width: "40%" }}>
              <TextField
                fullWidth
                placeholder="Search question by title"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            {results.score < questions.length && (
              <LoadingButton
                onClick={handleExplanationButtonClick}
                startIcon={
                  <Icon icon="tabler:file-text-ai" width="24" height="24" />
                }
                loadingPosition="start"
                loading={explLoading}
                variant="outlined"
              >
                <span>Explain Incorrect Questions</span>
              </LoadingButton>
            )}
          </Box>
          <Table>
            <TableHead sx={{ borderBottom: "none" }}>
              <TableRow sx={{ bgcolor: "#28323D" }}>
                <TableCell sx={{ borderBottom: 0 }} />
                <TableCell
                  align="left"
                  sx={{
                    color: "#919EAB",
                    fontWeight: 600,
                    fontSize: "16px",
                    borderBottom: 0,
                  }}
                >
                  No. & Question
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    color: "#919EAB",
                    fontWeight: 600,
                    fontSize: "16px",
                    borderBottom: 0,
                  }}
                >
                  Your answer
                </TableCell>
                <TableCell
                  align="left"
                  sx={{
                    color: "#919EAB",
                    fontWeight: 600,
                    fontSize: "16px",
                    borderBottom: 0,
                  }}
                >
                  Correct Answer
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredQuestions.map((result, index) => (
                <>
                  <TableRow
                    key={index}
                    sx={{
                      "&:hover": {
                        bgcolor: "rgba(145 158 171 / 0.08)",
                      },
                    }}
                  >
                    <TableCell
                      sx={{ padding: theme => theme.spacing(0, 0, 0, 1.5) }}
                    >
                      <IconButton
                        size="small"
                        onClick={() => handleCollapseToggle(result.questionId)}
                      >
                        <KeyboardArrowUp
                          sx={{
                            transform: questionOpenStates[result.questionId]
                              ? "rotate(0deg)"
                              : "rotate(180deg)",
                            transition: theme =>
                              theme.transitions.create("transform", {
                                duration: theme.transitions.duration.shortest,
                              }),
                          }}
                        />
                      </IconButton>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <Typography variant="h6">{result.question}</Typography>
                      <Typography variant="subtitle2" color="text.secondary">
                        Question No. {index + 1}
                      </Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Typography
                        sx={{
                          color: result.isCorrect
                            ? "success.main"
                            : "error.main",
                        }}
                      >
                        {result.option}
                      </Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Typography>{result.correctAnswer}</Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow
                    sx={{
                      bgcolor: "#28323D",
                      backgroundImage: "none",
                    }}
                  >
                    <TableCell
                      style={{
                        paddingTop: 0,
                        paddingBottom: 0,
                        borderBottom: "none",
                      }}
                      colSpan={6}
                    >
                      <Collapse
                        in={questionOpenStates[result.questionId]}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Paper
                          sx={{
                            margin: 1,
                            my: 3,
                            backgroundImage: "none",
                            boxShadow: "none",
                            borderRadius: 2,
                            padding: 2,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <Box
                              sx={{
                                width: "20px",
                                height: "20px",
                                borderRadius: 1,
                                bgcolor: "success.main",
                              }}
                            />{" "}
                            &nbsp; = Correct answer&nbsp;
                            <strong>
                              {result.isCorrect && "(Your answer)"}
                            </strong>
                            {!result.isCorrect && (
                              <>
                                <Divider
                                  flexItem
                                  orientation="vertical"
                                  sx={{ mx: 2 }}
                                />
                                <Box
                                  sx={{
                                    width: "20px",
                                    height: "20px",
                                    borderRadius: 1,
                                    bgcolor: "error.main",
                                  }}
                                />{" "}
                                &nbsp; = Wrong answer&nbsp;
                                <strong>(Your answer)</strong>
                              </>
                            )}
                            <Divider
                              flexItem
                              orientation="vertical"
                              sx={{ mx: 2 }}
                            />
                            <Box
                              sx={{
                                width: "20px",
                                height: "20px",
                                borderRadius: 1,
                                bgcolor: "rgb(99, 115, 129)",
                              }}
                            />{" "}
                            &nbsp; = Other options&nbsp;
                          </Box>
                          <Divider sx={{ my: 2, mx: -2 }} />
                          <Typography variant="h6" mb={1}>
                            {result.question}
                          </Typography>
                          {currentQuiz.questions
                            .find(q => q._id === result.questionId)
                            .options.map((option, i) => {
                              const color = result.isCorrect
                                ? option === result.option
                                  ? "success.main"
                                  : "rgb(99, 115, 129)"
                                : option === result.option
                                ? "error.main"
                                : option === result.correctAnswer
                                ? "success.main"
                                : "rgb(99, 115, 129)";

                              return (
                                <ListItem key={i}>
                                  <Box
                                    sx={{
                                      mr: 1,
                                      width: "20px",
                                      height: "20px",
                                      borderRadius: 1,
                                      bgcolor: color,
                                    }}
                                  />
                                  &nbsp;
                                  <Typography sx={{ color: color }}>
                                    {option}
                                  </Typography>
                                </ListItem>
                              );
                            })}
                        </Paper>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </>
              ))}
              {!filteredQuestions.length && (
                <TableRow>
                  <TableCell colSpan={4} sx={{ borderBottom: 0 }}>
                    <Grow in>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          flexDirection: "column",
                          borderRadius: "16px",
                          padding: theme => theme.spacing(10, 3),
                          border: "1px dashed rgba(145 158 171 / 0.08)",
                          bgcolor: "rgba(145 158 171 / 0.04)",
                          width: "100%",
                          m: 1,
                        }}
                      >
                        <img
                          src={
                            "https://pub-c5e31b5cdafb419fb247a8ac2e78df7a.r2.dev/public/assets/icons/empty/ic-content.svg"
                          }
                          alt="No results found for AI generated quizzes that you searched for"
                          width={160}
                          height={160}
                        />
                        <Typography
                          color="#637381"
                          fontWeight={600}
                          fontSize="18px"
                          sx={{ mt: 1 }}
                        >
                          No Data
                        </Typography>
                      </Box>
                    </Grow>
                  </TableCell>
                </TableRow>
              )}
              <TableRow>
                <TableCell sx={{ borderBottom: 0, height: "48px" }} />
              </TableRow>
            </TableBody>
          </Table>
        </Paper>
      </Grow>
    </Container>
  );
}
