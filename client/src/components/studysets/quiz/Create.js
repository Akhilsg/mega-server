import {
  Autocomplete,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  FormHelperText,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  TextField,
  Typography,
  linearProgressClasses,
} from "@mui/material";
import { CopyCheck, PencilLine } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createQuiz } from "../../../actions/quiz";
import LoadingDots from "../../../common/components/LoadingText";
import loadingImage from "../../../images/loading.png";
import createWebSocketConnection from "./socket";

const educationLevels = [
  "Preschool",
  "Kindergarten",
  "1st Grade",
  "2nd Grade",
  "3rd Grade",
  "4th Grade",
  "5th Grade",
  "6th Grade",
  "7th Grade",
  "8th Grade",
  "9th Grade (Freshman)",
  "10th Grade (Sophomore)",
  "11th Grade (Junior)",
  "12th Grade (Senior)",
  "College/University (Undergraduate)",
  "Graduate School (Master's)",
  "Graduate School (Doctorate/Ph.D.)",
  "Medical School",
  "Law School",
  "Business School",
  "Engineering School",
  "Nursing School",
  "Dental School",
  "Pharmacy School",
  "Veterinary School",
  "Pre-Med",
  "Pre-Law",
  "Pre-Business",
  "Pre-Engineering",
  "Pre-Nursing",
  "Pre-Dental",
  "Pre-Pharmacy",
  "Pre-Veterinary",
];

const loadingTexts = [
  "Creating quiz, please wait",
  "Generating questions",
  "Compiling quiz data",
  "Fetching additional resources",
  "Preparing quiz for you",
  "Almost there, just a moment",
];

const CreateQuizCard = () => {
  const { socket, isConnected } = createWebSocketConnection();
  const { loading, finished } = useSelector(state => state.quiz);
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const history = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [numQuestions, setNumQuestions] = useState(1);
  const [gradeLevel, setGradeLevel] = useState(educationLevels[0]);
  const [gameType, setGameType] = useState("mcq");
  const [subject, setSubject] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState(loadingTexts[0]);
  const [errors, setErrors] = useState({
    subject: "",
    difficulty: "",
    numQuestions: "",
  });

  useEffect(() => {
    if (isConnected) {
      socket.addEventListener("message", event => {
        const data = JSON.parse(event.data);

        switch (data.type) {
          case "quizCreated":
            console.log(`Quiz created by another user: ${data.quizId}`);
            break;

          default:
            console.warn(`Unknown message type: ${data.type}`);
        }
      });

      return () => {
        socket.close();
      };
    }
  }, [isConnected, socket]);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (finished) return 100;
          if (prev === 100) {
            return 0;
          }
          if (Math.random() < 0.1) {
            return prev + 2;
          }
          return prev + 0.5;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [finished, isLoading]);

  useEffect(() => {
    const interval = setInterval(() => {
      let randomIndex = Math.floor(Math.random() * loadingTexts.length);
      setLoadingText(loadingTexts[randomIndex]);
    }, 2000);
    return () => clearInterval(interval);
  }, [isLoading]);

  useEffect(() => {
    setIsLoading(loading);
  }, [loading]);

  const handleSubjectChange = e => {
    setSubject(e.target.value);
    setErrors({ ...errors, subject: "" });
  };

  const handleNumQuestionsChange = e => {
    setNumQuestions(e.target.value);
    setErrors({ ...errors, numQuestions: "" });
  };

  const handleDifficultyChange = e => {
    setDifficulty(e.target.value);
    setErrors({ ...errors, difficulty: "" });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      subject: "",
      difficulty: "",
      numQuestions: "",
    };

    if (!subject.trim()) {
      newErrors.subject = "Subject is required";
      isValid = false;
    }

    if (!difficulty) {
      newErrors.difficulty = "Difficulty is required";
      isValid = false;
    }

    if (numQuestions < 1) {
      newErrors.numQuestions = "Must be ≥ 1";
      isValid = false;
    }

    setErrors({ ...errors, ...newErrors });
    return isValid;
  };

  const handleCreateQuiz = async () => {
    const isValid = validateForm();

    if (isValid) {
      setIsLoading(true);

      try {
        const createdQuiz = await dispatch(
          createQuiz(user.id, {
            grade_level: gradeLevel,
            game_type: gameType,
            num: numQuestions,
            difficulty,
            subject,
          })
        );

        const quizId = createdQuiz;
        if (isConnected) {
          const message = JSON.stringify({
            type: "quizCreated",
            quizId,
          });

          socket.send(message);
        }

        setIsLoading(true);
        setLoadingProgress(0);
        const interval = setInterval(() => {
          clearInterval(interval);
          setIsLoading(false);
          history(`/quiz/${quizId}`);
        }, 1000);
      } catch (error) {
        console.error(error);

        setIsLoading(false);
        setLoadingProgress(0);
      }
    }
  };

  return (
    <>
      {isLoading ? (
        <Box sx={{ p: 2, margin: "auto", width: "80%" }}>
          <>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
              <img src={loadingImage} width={400} height={400} alt="loading" />
            </Box>
            <LinearProgress
              variant="determinate"
              value={loadingProgress}
              sx={{
                height: 10,
                borderRadius: 5,
                width: "70%",
                margin: "auto",
                [`& .${linearProgressClasses.bar}`]: {
                  borderRadius: 5,
                },
              }}
            />
            <Typography variant="h4" align="center" mt={4}>
              <LoadingDots text={loadingText} />
            </Typography>
          </>
        </Box>
      ) : (
        <Card sx={{ maxWidth: "720px", margin: "auto" }}>
          <CardHeader
            title="Create Studyset"
            subheader="AI personalization for your studyset"
            sx={{
              p: theme => theme.spacing(3, 3, 0),
              mb: 3,
              "& .MuiCardHeader-subheader": {
                color: "#919EAB",
              },
            }}
          />
          <Divider />
          <CardContent sx={{ p: 4 }}>
            <Box
              sx={{ display: "flex", alignItems: "flex-start", gap: 3, mb: 1 }}
            >
              <TextField
                label="Subject to give to AI"
                variant="outlined"
                fullWidth
                margin="none"
                value={subject}
                error={Boolean(errors.subject)}
                onChange={handleSubjectChange}
                helperText={
                  Boolean(errors.subject)
                    ? errors.subject
                    : "Type any topic that you want to give to AI to generate a studyset"
                }
              />
              <TextField
                label="Num Q's"
                variant="outlined"
                fullWidth
                value={numQuestions}
                type="number"
                margin="none"
                error={Boolean(errors.numQuestions)}
                helperText={errors.numQuestions}
                inputProps={{
                  min: 1,
                  style: { textAlign: "center" },
                }}
                onChange={handleNumQuestionsChange}
                sx={{ width: "30%" }}
              />
            </Box>
            <TextField
              label="Title for Studyset"
              variant="outlined"
              fullWidth
              margin="normal"
              value={title}
              error={Boolean(errors.subject)}
              onChange={e => setTitle(e.target.value)}
              sx={{ mt: 2 }}
            />
            <FormControl
              fullWidth
              variant="outlined"
              margin="normal"
              error={Boolean(errors.difficulty)}
              sx={{ mb: 2 }}
            >
              <InputLabel>Difficulty</InputLabel>
              <Select
                value={difficulty}
                onChange={handleDifficultyChange}
                label="Difficulty"
              >
                <MenuItem value="easy">Easy</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="hard">Hard</MenuItem>
              </Select>
              {Boolean(errors.difficulty) && (
                <FormHelperText>{errors.difficulty}</FormHelperText>
              )}
            </FormControl>
            <FormControl
              fullWidth
              variant="outlined"
              margin="normal"
              sx={{ mb: 2 }}
            >
              <Autocomplete
                options={educationLevels}
                value={gradeLevel}
                onChange={(event, newValue) => setGradeLevel(newValue)}
                renderInput={params => (
                  <TextField
                    {...params}
                    label="Grade Level"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            </FormControl>
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              margin="normal"
              value={description}
              multiline
              minRows={4}
              onChange={e => setDescription(e.target.value)}
              sx={{ mb: 2 }}
            />
            <FormControl margin="normal" fullWidth>
              <ButtonGroup fullWidth>
                <Button
                  startIcon={<CopyCheck />}
                  sx={{
                    boxShadow: gameType === "mcq" ? 1 : 0,
                    py: "10px",
                    "&:hover": {
                      borderColor: "#919EAB",
                    },
                  }}
                  variant={gameType === "mcq" ? "contained" : "outlined"}
                  onClick={() => setGameType("mcq")}
                >
                  Multiple choice
                </Button>
                <Button
                  startIcon={<PencilLine />}
                  sx={{
                    boxShadow: gameType === "open_ended" ? 1 : 0,
                    "&:hover": {
                      borderColor: "#919EAB",
                    },
                  }}
                  variant={gameType === "open_ended" ? "contained" : "outlined"}
                  onClick={() => setGameType("open_ended")}
                >
                  Open ended
                </Button>
              </ButtonGroup>
            </FormControl>
            <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCreateQuiz}
                disabled={isLoading}
              >
                Create Quiz
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default CreateQuizCard;
