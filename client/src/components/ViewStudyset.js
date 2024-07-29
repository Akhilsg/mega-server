import { CalendarMonth, KeyboardArrowDown } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Collapse,
  Container,
  Divider,
  FormControl,
  Grid,
  Grow,
  MenuItem,
  Paper,
  Select,
  Skeleton,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from "@mui/material";
import { ListOrdered, Puzzle, School } from "lucide-react";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import noImage from "../images/noImage.png";
import { getQuizById } from "../services/quiz.service";
import { getUserById } from "../services/user.service";
import { Icon } from "@iconify/react/dist/iconify.js";

const SkeletonLoader = () => (
  <Container>
    <Box sx={{ mb: 7 }}>
      <Skeleton
        variant="rectangular"
        width="100%"
        height={300}
        sx={{ borderRadius: "16px", mb: 4 }}
      />
      <Typography variant="h3">
        <Skeleton type="text" width="50%" gutterBottom />
      </Typography>
      <Typography>
        <Skeleton type="text" width="80%" gutterBottom />
      </Typography>
    </Box>
    <Grid container spacing={4}>
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="body2">
              <Skeleton variant="text" width="40%" sx={{ mb: 1 }} />
            </Typography>
            <Typography>
              <Skeleton
                variant="text"
                width="90%"
                sx={{ mb: 3, fontSize: "0.875rem" }}
              />
            </Typography>
            <Typography variant="body2">
              <Skeleton variant="text" width="40%" sx={{ mb: 1 }} />
            </Typography>
            <Typography>
              <Skeleton
                variant="text"
                width="90%"
                sx={{ mb: 3, fontSize: "0.875rem" }}
              />
            </Typography>
            <Typography variant="body2">
              <Skeleton variant="text" width="40%" sx={{ mb: 1 }} />
            </Typography>
            <Typography>
              <Skeleton
                variant="text"
                width="90%"
                sx={{ mb: 3, fontSize: "0.875rem" }}
              />
            </Typography>
            <Typography variant="body2">
              <Skeleton variant="text" width="40%" sx={{ mb: 1 }} />
            </Typography>
            <Typography>
              <Skeleton
                variant="text"
                width="90%"
                sx={{ mb: 3, fontSize: "0.875rem" }}
              />
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={8}>
        <Skeleton
          variant="rectangular"
          width="100%"
          height={400}
          sx={{ borderRadius: "16px", mb: 3 }}
        />
      </Grid>
    </Grid>
  </Container>
);

const ViewStudyset = () => {
  const { studysetId } = useParams();
  const [studysetUser, setStudysetUser] = useState("");
  const [studyset, setStudyset] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadStudyset = async () => {
      setLoading(true);

      try {
        const finalStudyset = await getQuizById(studysetId);
        const studysetCreator = await getUserById(finalStudyset.quiz.user);

        setStudysetUser(studysetCreator?.data.user);
        setStudyset(finalStudyset?.quiz);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    loadStudyset();
  }, []); // eslint-disable-line

  return (
    <>
      {loading ? (
        <SkeletonLoader />
      ) : (
        <div>
          {studyset.length !== 0 && (
            <Container>
              <Box sx={{ position: "relative", mb: 3 }}>
                <img
                  src={noImage}
                  alt="Studyset Cover"
                  style={{
                    width: "100%",
                    height: "300px",
                    objectFit: "cover",
                    borderRadius: "16px",
                    filter: "brightness(60%)",
                  }}
                />
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mt: 6,
                  }}
                >
                  <Box sx={{ position: "absolute", left: "16px", mb: 1 }}>
                    <Typography
                      variant="h4"
                      fontWeight={600}
                      sx={{ color: "white" }}
                    >
                      {studyset.title}
                    </Typography>
                    <Typography color="text.secondary">
                      {studyset.description}
                    </Typography>
                  </Box>
                  <Box sx={{ marginLeft: "auto", mr: 2 }}>
                    <Button variant="contained" sx={{ padding: 0 }}>
                      <FormControl size="small">
                        <Select
                          displayEmpty
                          sx={{
                            "& fieldset": { border: "none" },
                          }}
                          renderValue={() => (
                            <Box
                              sx={{ mr: "6px", fontWeight: 700 }}
                              fontSize="14px"
                            >
                              Study With
                            </Box>
                          )}
                          IconComponent={KeyboardArrowDown}
                        >
                          <MenuItem value="Quizzes">
                            <Box
                              sx={{ display: "flex", fontWeight: 600, gap: 1 }}
                              onClick={() => navigate(`/quiz/${studyset._id}`)}
                            >
                              <Icon
                                icon="solar:document-add-bold"
                                width="24"
                                height="24"
                              />{" "}
                              Quizzes
                            </Box>
                          </MenuItem>
                          <MenuItem value="Flashcards">
                            <Box
                              sx={{ display: "flex", fontWeight: 600, gap: 1 }}
                              onClick={() =>
                                navigate(`/flashcard/${studyset._id}`)
                              }
                            >
                              <Icon
                                icon="solar:documents-bold"
                                width="24"
                                height="24"
                              />{" "}
                              Flashcards
                            </Box>
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Button>
                  </Box>
                </Box>
              </Box>
              <Grid container spacing={4} sx={{ mt: 2 }}>
                <Grid item xs={12} md={4}>
                  <Grow in>
                    <Card>
                      <CardContent>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: "4px",
                            }}
                          >
                            <ListOrdered />

                            <Typography
                              variant="body2"
                              fontSize="0.875rem"
                              color="#919EAB"
                              sx={{ ml: 1 }}
                            >
                              Number of Terms
                            </Typography>
                          </Box>

                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              fontSize: "0.875rem",
                              ml: 4,
                              mb: 2,
                            }}
                          >
                            {studyset.questions.length} terms
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: "4px",
                            }}
                          >
                            <Puzzle />

                            <Typography
                              variant="body2"
                              fontSize="0.875rem"
                              color="#919EAB"
                              sx={{ ml: 1 }}
                            >
                              Difficulty
                            </Typography>
                          </Box>

                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              fontSize: "0.875rem",
                              ml: 4,
                              mb: 2,
                            }}
                          >
                            {studyset?.difficulty
                              ? studyset.difficulty
                              : "This studyset doesn't have a level"}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: "4px",
                            }}
                          >
                            <School />

                            <Typography
                              variant="body2"
                              fontSize="0.875rem"
                              color="#919EAB"
                              sx={{ ml: 1 }}
                            >
                              Level
                            </Typography>
                          </Box>

                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              fontSize: "0.875rem",
                              ml: 4,
                              mb: 2,
                            }}
                          >
                            {studyset.gradeLevel}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: "4px",
                            }}
                          >
                            <CalendarMonth />

                            <Typography
                              variant="body2"
                              fontSize="0.875rem"
                              color="#919EAB"
                              sx={{ ml: 1 }}
                            >
                              Date Posted
                            </Typography>
                          </Box>

                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              fontSize: "0.875rem",
                              ml: 4,
                              mb: 2,
                            }}
                          >
                            {moment(studyset.createdAt).format("MMMM Do, YYYY")}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: "4px",
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              class="lucide lucide-user-pen"
                            >
                              <path d="M11.5 15H7a4 4 0 0 0-4 4v2" />
                              <path d="M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z" />
                              <circle cx="10" cy="7" r="4" />
                            </svg>

                            <Typography
                              variant="body2"
                              fontSize="0.875rem"
                              color="#919EAB"
                              sx={{ ml: 1 }}
                            >
                              Created by
                            </Typography>
                          </Box>

                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              fontSize: "0.875rem",
                              ml: 4,
                              mb: 2,
                            }}
                          >
                            {studysetUser?.username}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grow>
                </Grid>
                <Grid item xs={12} md={8}>
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
                        value={1}
                        textColor="inherit"
                        TabIndicatorProps={{
                          children: <span className="MuiTabs-indicatorSpan" />,
                        }}
                        sx={{
                          px: 1,
                          boxShadow:
                            "inset 0 -2px 0 0 rgba(145 158 171 / 0.08)",
                          "& .MuiTabs-indicator": {
                            display: "flex",
                            justifyContent: "center",
                            backgroundColor: "transparent",
                          },
                          "& .MuiTabs-indicatorSpan": {
                            maxWidth: "90%",
                            width: "100%",
                            backgroundColor: "white",
                          },
                        }}
                      >
                        <Tab
                          label="Terms"
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
                              {studyset?.questions?.length}
                            </Box>
                          }
                        />
                      </Tabs>

                      <Table>
                        <TableHead sx={{ borderBottom: "none" }}>
                          <TableRow sx={{ bgcolor: "#28323D" }}>
                            <TableCell
                              align="left"
                              sx={{
                                color: "#919EAB",
                                fontWeight: 600,
                                fontSize: "16px",
                                borderBottom: 0,
                              }}
                            >
                              Question
                            </TableCell>
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
                              Correct Answer
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {studyset.questions.map((result, index) => (
                            <>
                              <TableRow key={index}>
                                <TableCell component="th" scope="row">
                                  <Typography variant="h6">
                                    {result.question}
                                  </Typography>
                                  <Typography
                                    variant="subtitle2"
                                    color="text.secondary"
                                  >
                                    Question {index + 1}
                                  </Typography>
                                </TableCell>
                                <TableCell></TableCell>

                                <TableCell align="left">
                                  <Typography>{result.answer}</Typography>
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
                                  <Collapse timeout="auto" unmountOnExit>
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
                                      <Divider sx={{ my: 2, mx: -2 }} />
                                      <Typography variant="h6" mb={1}>
                                        {result.question}
                                      </Typography>
                                    </Paper>
                                  </Collapse>
                                </TableCell>
                              </TableRow>
                            </>
                          ))}

                          <TableRow>
                            <TableCell
                              sx={{ borderBottom: 0, height: "48px" }}
                            />
                          </TableRow>
                        </TableBody>
                      </Table>
                    </Paper>
                  </Grow>
                </Grid>
              </Grid>
            </Container>
          )}
        </div>
      )}
    </>
  );
};

export default ViewStudyset;
