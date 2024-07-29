import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { Box, Card, Divider, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts";
import {
  PieChart,
  pieArcClasses,
  pieArcLabelClasses,
} from "@mui/x-charts/PieChart";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentQuizzes } from "../../../actions/quiz";
import activity from "../../../images/activity.png";
import clock from "../../../images/clock.png";
import checkmarkIcon from "../../../images/tick.png";
import { getAllQuizzes } from "../../../services/quiz.service";
import "./Analytics.css";
import SearchAnalytics from "./AnalyticsSearch";

import { useLocation } from "react-router-dom";

const pData = [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0];
const xLabels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const Analytics = () => {
  const { user } = useSelector(state => state.auth);
  const { quizzes } = useSelector(state => state.quiz);
  const location = useLocation();
  const search = location?.search;

  const subjectFromUrl = search
    ? new URLSearchParams(search).get("subject")
    : null;

  const [data, setData] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [searchTerm, setSearchTerm] = useState(
    search ? `${subjectFromUrl} Quiz` : ""
  );
  const myQuizzes = quizzes.filter(quiz => quiz.user === user.id);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const quizData = await getAllQuizzes();
        const yourQuizzes = quizData.quizzes.filter(
          quiz => quiz.user === user.id && quiz.hasOwnProperty("score")
        );
        dispatch(setCurrentQuizzes(yourQuizzes));
      } catch (error) {
        console.error(error);
      }
    };

    fetchQuizzes();
  }, [dispatch, user.id]);

  const calculateAverageAccuracy = quizzesByCategory => {
    const averages = {};
    Object.keys(quizzesByCategory).forEach((category, index) => {
      const correctQuestions = [];
      const incorrectQuestions = [];

      const totalQuestions = quizzesByCategory[category].reduce(
        (sum, quiz) => sum + quiz.questions.length,
        0
      );
      const totalCorrectAnswers = quizzesByCategory[category].reduce(
        (sum, quiz) => sum + quiz.score,
        0
      );
      const totalQuizzes = quizzesByCategory[category].length;
      const monthlyQuizCount = quizzesByCategory[category].reduce(
        (acc, quiz) => {
          const createdAt = new Date(quiz.createdAt);
          const monthYear = `${createdAt.toLocaleString("en-US", {
            month: "long",
          })} `;
          acc[monthYear] = (acc[monthYear] || 0) + 1;
          return acc;
        },
        {}
      );

      const allMonths = Array.from({ length: 12 }, (_, i) => {
        const date = new Date(2023, i, 1);
        return date.toLocaleString("en-US", { month: "long" });
      });

      const labels = allMonths.map(month => month + " ");
      const data = labels.map(label => monthlyQuizCount[label] || 0);
      const totalTimeTaken = quizzesByCategory[category].reduce(
        (sum, quiz) => sum + quiz.timeTaken,
        0
      );
      const averageAccuracy = totalCorrectAnswers / totalQuestions || 0;
      const averageTimeTaken =
        totalQuizzes > 0 ? (totalTimeTaken / totalQuizzes).toFixed(0) : 0;
      const maxScore = Math.max(
        ...quizzesByCategory[category].map(quiz => quiz.score)
      );
      const minScore = Math.min(
        ...quizzesByCategory[category].map(quiz => quiz.score)
      );
      const minQuestionsLength =
        quizzesByCategory[category].find(quiz => quiz.score === minScore)
          ?.questions.length || 0;
      const maxQuestionsLength =
        quizzesByCategory[category].find(quiz => quiz.score === maxScore)
          ?.questions.length || 0;

      const minScoreString = `${minScore}/${minQuestionsLength}`;
      const maxScoreString = `${maxScore}/${maxQuestionsLength}`;

      let accuracyImprovement = 0;
      if (index > 0) {
        const prevAccuracy =
          quizzesByCategory[Object.keys(quizzesByCategory)[index - 1]].reduce(
            (sum, quiz) => sum + quiz.score,
            0
          ) /
          quizzesByCategory[Object.keys(quizzesByCategory)[index - 1]].reduce(
            (sum, quiz) => sum + quiz.questions.length,
            0
          );
        accuracyImprovement = (averageAccuracy - prevAccuracy) * 100;
      }

      quizzesByCategory[category].forEach(quiz => {
        const correctQuestionsInQuiz = quiz.questions.filter(
          question => question.isCorrect
        );
        const incorrectQuestionsInQuiz = quiz.questions.filter(
          question => !question.isCorrect
        );

        correctQuestions.push(...correctQuestionsInQuiz);
        incorrectQuestions.push(...incorrectQuestionsInQuiz);
      });

      averages[category] = {
        accuracy: (averageAccuracy * 100).toFixed(0),
        accuracyImprovement: accuracyImprovement.toFixed(0),
        totalQuizzes,
        averageTimeTaken,
        labels,
        data,
        correctQuestions,
        incorrectQuestions,
        maxScore: maxScoreString,
        minScore: minScoreString,
        min: minScore,
        max: maxScore,
      };
    });
    return averages;
  };

  const filterQuizzesByCategory = () => {
    return quizzes.reduce((acc, quiz) => {
      const subject = quiz.title;
      acc[subject] = acc[subject] || [];
      acc[subject].push(quiz);
      return acc;
    }, {});
  };

  const filteredQuizzes = filterQuizzesByCategory();
  const averageAccuracy = calculateAverageAccuracy(filteredQuizzes);
  const subjects = Object.keys(averageAccuracy);

  const TOTAL = data.map(item => item.value).reduce((a, b) => a + b, 0);

  const getArcLabel = params => {
    const percent = params.value / TOTAL;
    return `${(percent * 100).toFixed(0)}%`;
  };

  useEffect(() => {
    if (selectedSubject !== "" && subjects.length !== 0) {
      setData([
        {
          id: 0,
          value: averageAccuracy[selectedSubject].correctQuestions.length,
          label: "Correct",
          color: "rgb(0, 167, 111)",
        },
        {
          id: 1,
          value: averageAccuracy[selectedSubject].incorrectQuestions.length,
          label: "Incorrect",
          color: "rgb(255, 86, 48)",
        },
      ]);
    }
  }, [subjects, selectedSubject, averageAccuracy]);

  const series = [
    {
      data,
      arcLabel: getArcLabel,
    },
  ];
  //   console.log(subjects);
  return (
    <>
      {selectedSubject === "" ? (
        <SearchAnalytics
          myQuizzes={myQuizzes}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            paddingX: 5,
            // paddingTop: 5,
          }}
        >
          <Box
            sx={{
              width: "95%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
            }}
          >
            <Box
              sx={{
                color: "rgb(145, 158, 171)",
                cursor: "pointer",
                backgroundColor: "#141A21",
                borderRadius: "99px",
                width: "40px",
                height: "40px",
                "&:hover": {
                  backgroundColor: "rgb(28, 37, 46)",
                  transition: "0.5s ease-in-out",
                },
                padding: 1,
              }}
              onClick={() => setSelectedSubject("")}
            >
              <ArrowBackIosNewIcon
                fontSize="small"
                sx={{
                  color: "rgb(145, 158, 171)",
                  cursor: "pointer",
                }}
              />
            </Box>
            <Typography
              sx={{
                marginRight: "auto",
                fontWeight: 700,
                fontSize: "1.6rem",
                lineHeight: 1.5,
                marginLeft: 2,
              }}
            >
              Analytics for {selectedSubject.toUpperCase()}
            </Typography>
          </Box>
          <Box
            sx={{
              width: "95%",
              display: "flex",
              gap: 3,
              marginTop: 3,
              justifyContent: "center",
              flex: 1,
            }}
          >
            <Box
              sx={{
                zIndex: 0,
                position: "relative",
                overflow: "hidden",
                boxShadow: "none",
                //   marginRight: "12px",
                borderRadius: "16px",
                backgroundColor: "rgb(255, 255, 255)",
                width: "32%",
                backgroundImage:
                  "linear-gradient(135deg, rgba(255, 233, 213, 0.48), rgba(255, 172, 130, 0.48))",
                color: "rgb(122, 9, 22)",
                p: 3,
              }}
            >
              <Box sx={{ mb: 3 }}>
                {" "}
                <img
                  src={activity}
                  alt="Activities"
                  width={50}
                  height={50}
                />
              </Box>
              <Box>
                <Typography
                  mb={1}
                  sx={{
                    fontSize: "0.875rem",
                    lineHeight: 1.57143,
                    fontWeight: 600,
                    color: "rgb(122, 9, 22)",
                  }}
                >
                  Number of Studies
                </Typography>
                <Typography
                  // variant="h4"
                  fontWeight={700}
                  sx={{
                    color: "rgb(122, 9, 22)",
                    fontSize: "1.8rem",
                    lineHeight: 1.5,
                  }}
                >
                  {averageAccuracy[selectedSubject].totalQuizzes}
                </Typography>
              </Box>

              <Box
                sx={{
                  width: "240px",
                  height: "240px",
                  flexShrink: 0,
                  display: "inline-flex",
                  backgroundColor: "currentcolor",
                  mask: "url(https://pub-c5e31b5cdafb419fb247a8ac2e78df7a.r2.dev/public/assets/background/shape-square.svg) center center / contain no-repeat",
                  top: 0,
                  left: -20,
                  zIndex: -1,
                  opacity: 0.24,
                  position: "absolute",
                  color: "rgb(122, 9, 22)",
                }}
              />
            </Box>

            <Box
              sx={{
                zIndex: 0,
                position: "relative",
                overflow: "hidden",
                boxShadow: "none",
                //   marginRight: "12px",
                borderRadius: "16px",
                backgroundColor: "rgb(255, 255, 255)",
                width: "32%",
                backgroundImage:
                  "linear-gradient(135deg, rgba(200, 250, 214, 0.48), rgba(91, 228, 155, 0.48))",
                color: "#004B50",
                p: 3,
              }}
            >
              <Box sx={{ mb: 3 }}>
                {" "}
                <img
                  src={checkmarkIcon}
                  alt="Checkmark icon"
                  width={50}
                  height={48}
                />
              </Box>
              <Box>
                <Typography
                  variant="h5"
                  fontSize="14px"
                  fontWeight={600}
                  mb={1}
                >
                  Accuracy
                </Typography>
                <Typography
                  // variant="h4"
                  fontWeight={700}
                  sx={{
                    color: "rgb(0, 75, 80)",
                    fontSize: "1.8rem",
                    lineHeight: 1.5,
                  }}
                >
                  {averageAccuracy[selectedSubject].accuracy}%
                </Typography>
              </Box>

              <Box
                sx={{
                  width: "240px",
                  height: "240px",
                  flexShrink: 0,
                  display: "inline-flex",
                  backgroundColor: "currentcolor",
                  mask: "url(https://pub-c5e31b5cdafb419fb247a8ac2e78df7a.r2.dev/public/assets/background/shape-square.svg) center center / contain no-repeat",
                  top: 0,
                  left: -20,
                  zIndex: -1,
                  opacity: 0.24,
                  position: "absolute",
                  color: "rgb(0, 75, 80)",
                }}
              />
            </Box>

            <Box
              sx={{
                zIndex: 0,
                position: "relative",
                overflow: "hidden",
                boxShadow: "none",
                //   marginRight: "12px",
                borderRadius: "16px",
                backgroundColor: "rgb(255, 255, 255)",
                width: "32%",
                backgroundImage:
                  "linear-gradient(135deg, rgba(239, 214, 255, 0.48), rgba(198, 132, 255, 0.48))",
                color: "#ff5630",
                p: 3,
              }}
            >
              <Box sx={{ mb: 3 }}>
                {" "}
                <img src={clock} alt="Clock icon" width={50} height={50} />
              </Box>
              <Box>
                <Typography
                  color="rgb(39, 9, 122)"
                  variant="h5"
                  fontSize="14px"
                  fontWeight={600}
                  mb={1}
                >
                  Time Taken
                </Typography>
                <Typography
                  fontWeight={700}
                  sx={{
                    color: "rgb(39, 9, 122)",
                    fontSize: "1.8rem",
                    lineHeight: 1.5,
                  }}
                >
                  {averageAccuracy[selectedSubject].averageTimeTaken} seconds
                </Typography>
              </Box>

              <Box
                sx={{
                  width: "240px",
                  height: "240px",
                  flexShrink: 0,
                  display: "inline-flex",
                  backgroundColor: "currentcolor",
                  mask: "url(https://pub-c5e31b5cdafb419fb247a8ac2e78df7a.r2.dev/public/assets/background/shape-square.svg) center center / contain no-repeat",
                  top: 0,
                  left: -20,
                  zIndex: -1,
                  opacity: 0.24,
                  position: "absolute",
                  color: "rgb(39, 9, 122)",
                }}
              />
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              width: "95%",
              marginTop: "24px",
              gap: 2,
            }}
          >
            <Card
              sx={{
                width: "32%",
                height: "60vh",
                // marginRight: "12px",
                borderRadius: "15px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: 3,
              }}
            >
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: "1.0625rem",
                  lineHeight: 1.55556,
                  marginRight: "auto",
                }}
              >
                Correct vs Incorrect
              </Typography>
              <PieChart
                series={series}
                margin={{ top: 30, left: 30, right: 30 }}
                sx={{
                  [`& .${pieArcClasses.root}`]: {
                    cornerRadius: 10,
                  },
                  [`& .${pieArcLabelClasses.root}`]: {
                    fill: "white",
                    fontSize: 14,
                    fontFamily: "Public Sans",
                    fontWeight: 600,
                  },
                }}
                slotProps={{
                  legend: {
                    hidden: true,
                  },
                }}
              />
              <Divider
                flexItem
                sx={{
                  borderStyle: "dashed",
                  borderWidth: "0px 0px thin",
                  borderColor: "rgba(145, 158, 171, 0.2)",
                  width: "100%",
                  mb: 4,
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                  gap: 2,
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    fontWeight: 500,
                  }}
                >
                  <Box
                    sx={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      bgcolor: "green",
                    }}
                  />
                  &nbsp;Correct
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    fontWeight: 500,
                  }}
                >
                  <Box
                    sx={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      bgcolor: "red",
                    }}
                  />
                  &nbsp;Incorrect
                </Box>
              </Box>
            </Card>
            <Card
              sx={{
                //   width: "%",
                flex: 1,
                marginLeft: "12px",
                height: "60vh",
                borderRadius: "15px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: 3,
              }}
            >
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: "1.0625rem",
                  lineHeight: 1.55556,
                  marginRight: "auto",
                }}
              >
                Studies by Month
              </Typography>
              <BarChart
                series={[
                  {
                    data: pData,
                    label: "Studies per month",
                    id: "pvId",
                    color: "rgb(0, 167, 111)",
                  },
                ]}
                xAxis={[{ data: xLabels, scaleType: "band" }]}
                slotProps={{
                  legend: {
                    hidden: true,
                  },
                }}
                // slots={{
                //   axisTick: "none",
                //   axisLine: "none",
                //   popper: {},
                // }}
                grid={{ horizontal: true }}
                borderRadius={6}
                sx={
                  {
                    // "& .MuiChartsGrid-horizontalLine": {
                    //   borderStyle: "dashed",
                    //   margin: 20,
                    // },
                    // "& .MuiChartsGrid-line": {
                    //   borderStyle: "dashed",
                    //   margin: 20,
                    // },
                    // "& .MuiChartsGrid-root": {
                    //   borderStyle: "dashed",
                    //   margin: 20
                    // },
                  }
                }
              />
            </Card>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Analytics;
