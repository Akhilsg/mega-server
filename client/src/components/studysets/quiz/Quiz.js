import {
  CheckCircleOutlineRounded,
  HighlightOffOutlined,
  RadioButtonUnchecked
} from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Fade,
  Grid,
  Paper,
  Stack,
  Typography
} from "@mui/material";
import axios from "axios";
import {
  Clock
} from "lucide-react";
import React, { useEffect, useState } from "react";
import ConfettiExplosion from "react-confetti-explosion";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { setCurrentQuiz } from "../../../actions/quiz";
import { getQuizById } from "../../../services/quiz.service";
import ExplanationModal from "./ExplanationModal";
import QuizResults from "./QuizResults";

const Quiz = () => {
  const dispatch = useDispatch();
  const { currentQuiz } = useSelector(state => state.quiz);
  const { quizId } = useParams();

  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [clickedButtonIndex, setClickedButtonIndex] = useState(null);
  const [zoomOut, setZoomOut] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [isExplanationModalOpen, setIsExplanationModalOpen] = useState(false);
  const [explanations, setExplanations] = useState([]);
  const [results, setResults] = useState(null);
  const [timer, setTimer] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const quizData = await getQuizById(quizId);
        dispatch(setCurrentQuiz(quizData.quiz));
        setLoading(false);

        if (quizData.quiz.questions.some(q => q.userAnswer)) {
          setSubmitted(true);
        }
      } catch (error) {
        console.error("Error fetching quiz:", error);
      }
    };

    fetchQuiz();
  }, [currentQuiz, quizId, submitted, dispatch]);

  useEffect(() => {
    if (!submitted) {
      setTimeout(() => setTimer(prevTimer => prevTimer + 1), 1000);
    }
  }, [timer, submitted]);

  useEffect(() => {
    if (submitted) {
      const updateQuestions = async () => {
        try {
          await axios.put(
            `http://localhost:8080/api/updateQuestions/${quizId}`,
            {
              questions: answeredQuestions,
              timeTaken: timer,
              score,
            }
          );
        } catch (error) {
          console.error("Error submitting answers:", error);
        }
      };
      const fetchExplanations = async () => {
        try {
          const quizData = await getQuizById(quizId);
          setExplanations(quizData.quiz.explanations);
        } catch (err) {
          console.log(err);
        }
      };

      fetchExplanations();

      if (!currentQuiz.questions.some(q => q.userAnswer)) {
        setResults({
          selectedAnswers,
          timeTaken: timer,
          score,
        });
        updateQuestions();
      } else {
        const questions = currentQuiz.questions;
        const selectedAnswers = [];
        let score = 0;

        questions.forEach(question => {
          const isCorrect = question.isCorrect;
          selectedAnswers.push({
            questionId: question._id,
            question: question.question,
            correctAnswer: question.answer,
            option: question.userAnswer,
            isCorrect,
          });

          if (isCorrect) score += 1;
        });

        setResults({
          selectedAnswers,
          timeTaken: currentQuiz.timeTaken,
          score,
        });
      }
    }
  }, [
    submitted,
    selectedAnswers,
    answeredQuestions,
    quizId,
    score,
    timer,
    currentQuiz.questions,
    currentQuiz.timeTaken,
  ]);

  if (loading) return <CircularProgress />;

  const { title, description, questions } = currentQuiz;
  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerClick = (option, index) => {
    const question = currentQuiz.questions[currentQuestionIndex];
    const isCorrect = option === question.answer;

    const isQuestionAlreadyAnswered = selectedAnswers.some(
      answered => answered.questionId === question._id
    );

    const answeredQuestion = {
      questionId: currentQuestion._id,
      isCorrect,
      userAnswer: option,
    };

    if (!isQuestionAlreadyAnswered) {
      setSelectedAnswers(prevSelectedAnswers => [
        ...prevSelectedAnswers,
        {
          questionId: question._id,
          question: question.question,
          correctAnswer: question.answer,
          option,
          isCorrect,
        },
      ]);

      setScore(prevScore => prevScore + (isCorrect ? 1 : 0));
      setAnsweredQuestions(prev => [...prev, answeredQuestion]);
    }

    setClickedButtonIndex(index);

    setTimeout(() => setZoomOut(true), 500);

    setTimeout(() => {
      if (currentQuestionIndex < currentQuiz.questions.length - 1) {
        setCurrentQuestionIndex(prevQuestionIndex => prevQuestionIndex + 1);
        setClickedButtonIndex(null);
      } else {
        setSubmitted(true);
      }

      setZoomOut(false);
    }, 1000);
  };

  return (
    <>
      {currentQuiz && !submitted && (
        <Paper
          sx={{
            width: "70%",
            margin: "auto",
            padding: 5,
            marginTop: "20px",
            borderRadius: 4,
            boxShadow:
              "rgba(0, 0, 0, 0.2) 0px 0px 2px 0px, rgba(0, 0, 0, 0.12) 0px 8px 20px -4px",
          }}
        >
          <Typography variant="h4">{title}</Typography>
          <Typography variant="body1" color="text.secondary">
            {description}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Fade in={!zoomOut} timeout={500}>
            <div style={{ marginBottom: "20px" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Stack>
                  <Typography variant="body2" color="text.secondary">
                    Question {currentQuestionIndex + 1}/{questions.length}
                  </Typography>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    {currentQuestion.question}
                  </Typography>
                </Stack>
                <Box>
                  <Clock />
                  &nbsp;
                  {timer}
                </Box>
              </Box>
              <Grid container spacing={2}>
                {currentQuestion.options.map((option, index) => {
                  const isCorrect =
                    clickedButtonIndex === index
                      ? clickedButtonIndex === index &&
                        currentQuiz.questions[currentQuestionIndex].answer ===
                          option
                      : "";

                  return (
                    <Grid key={index} item xs={6}>
                      <Button
                        variant="outlined"
                        size="large"
                        startIcon={
                          isCorrect ? (
                            <CheckCircleOutlineRounded fontSize="large" />
                          ) : clickedButtonIndex === index && !isCorrect ? (
                            <HighlightOffOutlined fontSize="large" />
                          ) : (
                            <RadioButtonUnchecked fontSize="large" />
                          )
                        }
                        sx={[
                          {
                            marginBottom: "10px",
                            width: "100%",
                            minHeight: "100%",
                            position: "relative",
                            backgroundColor: "rgba(80, 193, 60, 0.04)",
                            "&:hover": {
                              backgroundColor: "rgba(80, 193, 60, 0.09)",
                            },
                            "& .MuiButton-startIcon": {
                              position: "absolute",
                              left: 16,
                            },
                          },
                          isCorrect
                            ? {
                                backgroundColor: "primary.light",
                                borderColor: "green",
                                color: "green",
                                "&:hover": {
                                  backgroundColor: "primary.light",
                                  borderColor: "green",
                                  color: "green",
                                },
                              }
                            : clickedButtonIndex === index && !isCorrect
                            ? {
                                backgroundColor: "#ffc4c4",
                                borderColor: "red",
                                color: "red",
                                "&:hover": {
                                  backgroundColor: "#ffc4c4",
                                  borderColor: "red",
                                  color: "red",
                                },
                              }
                            : "",
                        ]}
                        onClick={() => handleAnswerClick(option, index)}
                      >
                        {clickedButtonIndex === index && isCorrect && (
                          <ConfettiExplosion
                            force={0.4}
                            duration={2200}
                            particleCount={30}
                            width={400}
                          />
                        )}
                        <Box width="85%">{option}</Box>
                      </Button>
                    </Grid>
                  );
                })}
              </Grid>
            </div>
          </Fade>
        </Paper>
      )}
      {submitted && results && (
        <QuizResults
          explanations={explanations}
          setExplanations={setExplanations}
          setIsExplanationModalOpen={setIsExplanationModalOpen}
          quizId={quizId}
          currentQuiz={currentQuiz}
          questions={currentQuiz.questions}
          results={results}
          timer={timer}
        />
      )}
      <ExplanationModal
        isOpen={isExplanationModalOpen}
        handleClose={() => setIsExplanationModalOpen(false)}
        explanations={explanations}
        questions={currentQuiz.questions}
        results={results}
      />
    </>
  );
};

export default Quiz;
