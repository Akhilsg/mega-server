import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Grow,
  Slide,
  Typography,
} from "@mui/material";
import {
  Check,
  ChevronLeft,
  Settings as SettingsIcon,
  XCircle,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { setCurrentQuiz } from "../../../actions/quiz";
import { getQuizById } from "../../../services/quiz.service";
import Flashcard from "./Flashcard";
import FlashcardResults from "./FlashcardResults";
import Settings from "./Settings";

export default function Flashcards() {
  const dispatch = useDispatch();
  const { currentQuiz } = useSelector(state => state.quiz);
  const { quizId } = useParams();

  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [slideIn, setSlideIn] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [showAnswerFirst, setShowAnswerFirst] = useState(false);
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [timerDuration, setTimerDuration] = useState(30);
  const [repeatIncorrect, setRepeatIncorrect] = useState(true);
  const [incorrectQuestions, setIncorrectQuestions] = useState([]);
  const [currentIncorrectIndex, setCurrentIncorrectIndex] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      setLoading(true);

      try {
        const quizData = await getQuizById(quizId);
        dispatch(setCurrentQuiz(quizData.quiz));

        let questions = quizData.quiz.questions;

        if (shuffle) {
          questions = questions.sort(() => Math.random() - 0.5);
          dispatch(setCurrentQuiz({ ...quizData.quiz, questions }));
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching quiz:", error);
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId, dispatch, shuffle]);

  const handleNext = correct => {
    setFlipped(false);
    setSlideIn(false);

    if (!correct) {
      setIncorrectQuestions(prev => [
        ...prev,
        currentQuiz.questions[currentIndex],
      ]);
    }

    setScore(prevScore => prevScore + (correct ? 1 : 0));
    setTimeout(() => {
      setCurrentIndex(prevIndex =>
        prevIndex === currentQuiz.questions.length - 1
          ? setSubmitted(true)
          : prevIndex + 1
      );
      setSlideIn(true);
    }, 350);
  };

  const handleRepeatSubmit = () => {
    setSubmitted(true);
    setIncorrectQuestions([]);
    setSlideIn(true);
  };

  const handleRepeatNext = () => {
    setFlipped(false);
    setSlideIn(false);
    setTimeout(() => {
      setCurrentIncorrectIndex(prevIndex =>
        prevIndex === incorrectQuestions.length - 1
          ? handleRepeatSubmit()
          : prevIndex + 1
      );
      setSlideIn(true);
    }, 350);
  };

  return (
    <>
      <Box>
        <Link to={`/studyset/${quizId}`}>
          <Button variant="outlined" startIcon={<ChevronLeft />}>
            Back
          </Button>
        </Link>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 2,
          }}
        >
          <Box
            sx={{
              width: "100%",
              padding: "10px",
            }}
          >
            <Typography id="text" variant="h4" sx={{ mb: 1 }}>
              Reviewing{" "}
              <strong
                style={{
                  textTransform: "capitalize",
                  textDecoration: "underline",
                }}
              >
                {currentQuiz.title}
              </strong>{" "}
              with Flashcards
            </Typography>
            <Typography color="text.secondary">
              {currentQuiz.description}
            </Typography>
          </Box>
          <Button
            size="large"
            color="inherit"
            startIcon={<SettingsIcon />}
            onClick={() => setSettingsOpen(true)}
          >
            Settings
          </Button>
        </Box>
        <Divider sx={{ my: 2, borderStyle: "dashed" }} />

        {!submitted && (
          <Box
            ref={containerRef}
            sx={{
              display: "flex",
              justifyContent: "center",
              overflow: "hidden",
              flexDirection: "column",
              alignItems: "center",
              height: "100%",
              width: "90%",
              margin: "auto",
              mt: 5,
            }}
          >
            {loading ? (
              <CircularProgress />
            ) : (
              <>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",

                    height: "100%",
                  }}
                >
                  <Slide
                    container={containerRef.current}
                    direction={slideIn ? "right" : "left"}
                    in={slideIn && !loading}
                    mountOnEnter
                    unmountOnExit
                  >
                    <div>
                      {currentQuiz?.questions && (
                        <Flashcard
                          flashcard={currentQuiz?.questions[currentIndex]}
                          flipped={flipped}
                          setFlipped={setFlipped}
                          showAnswerFirst={showAnswerFirst}
                          timerEnabled={timerEnabled}
                          timerDuration={timerDuration}
                        />
                      )}
                    </div>
                  </Slide>
                </Box>
                {(flipped && !showAnswerFirst) ||
                (!flipped && showAnswerFirst) ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      margin: "auto",
                      width: 500,
                    }}
                  >
                    <Grow in timeout={600}>
                      <Button
                        color="error"
                        startIcon={<XCircle />}
                        onClick={() => handleNext(false)}
                      >
                        Incorrect
                      </Button>
                    </Grow>
                    <Grow in timeout={600}>
                      <Button
                        startIcon={<Check />}
                        onClick={() => handleNext(true)}
                      >
                        Correct
                      </Button>
                    </Grow>
                  </Box>
                ) : null}
              </>
            )}
          </Box>
        )}
      </Box>
      {submitted && repeatIncorrect && incorrectQuestions?.length > 0 ? (
        <>
          <Typography variant="h6" color="error" align="center" sx={{ my: 2 }}>
            Repeating incorrect questions: {currentIncorrectIndex + 1}/
            {incorrectQuestions.length}
          </Typography>
          <Box
            ref={containerRef}
            sx={{
              display: "flex",
              justifyContent: "center",
              overflow: "hidden",
              flexDirection: "column",
              alignItems: "center",
              width: "90%",
              margin: "auto",
              marginTop: "3%",
            }}
          >
            <Box
              sx={{ width: "20%", display: "flex", justifyContent: "center" }}
            >
              <Slide
                container={containerRef.current}
                direction={slideIn ? "right" : "left"}
                in={slideIn && !loading}
                mountOnEnter
                unmountOnExit
              >
                <div>
                  {incorrectQuestions.length > 0 && (
                    <Flashcard
                      flashcard={incorrectQuestions[currentIncorrectIndex]}
                      flipped={flipped}
                      setFlipped={setFlipped}
                      showAnswerFirst={showAnswerFirst}
                      timerEnabled={timerEnabled}
                      timerDuration={timerDuration}
                    />
                  )}
                </div>
              </Slide>
            </Box>
            {(flipped && !showAnswerFirst) || (!flipped && showAnswerFirst) ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  margin: "auto",
                  width: 500,
                }}
              >
                <Grow in timeout={600}>
                  <Button
                    color="error"
                    startIcon={<XCircle />}
                    onClick={() => handleRepeatNext()}
                  >
                    Incorrect
                  </Button>
                </Grow>
                <Grow in timeout={600}>
                  <Button
                    startIcon={<Check />}
                    onClick={() => handleRepeatNext()}
                  >
                    Correct
                  </Button>
                </Grow>
              </Box>
            ) : null}
          </Box>
        </>
      ) : (
        submitted &&
        incorrectQuestions.length === 0 && (
          <FlashcardResults score={score} flashcards={currentQuiz?.questions} />
        )
      )}
      <Settings
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        shuffle={shuffle}
        setShuffle={setShuffle}
        showAnswerFirst={showAnswerFirst}
        setShowAnswerFirst={setShowAnswerFirst}
        timerEnabled={timerEnabled}
        setTimerEnabled={setTimerEnabled}
        timerDuration={timerDuration}
        setTimerDuration={setTimerDuration}
        repeatIncorrect={repeatIncorrect}
        setRepeatIncorrect={setRepeatIncorrect}
      />
    </>
  );
}
