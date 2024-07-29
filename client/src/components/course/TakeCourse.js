import {
  CheckCircle,
  ExpandMoreOutlined,
  RadioButtonUnchecked,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Collapse,
  Container,
  Divider,
  Drawer,
  Grid,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import axios from "axios";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import Scrollbars from "react-custom-scrollbars-2";
import ReactPlayer from "react-player/youtube";
import { useParams } from "react-router-dom";
import { ExpandMore } from "../../common/components/ExpandMore";

const TakeCourse = () => {
  const drawerWidth = 320;

  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [expandedChapters, setExpandedChapters] = useState({ 0: true });
  const [expandedQuestions, setExpandedQuestions] = useState({ 0: true });
  const [conceptCheckAnswers, setConceptCheckAnswers] = useState({});
  const [conceptCheckCorrect, setConceptCheckCorrect] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const questionRefs = useRef([]);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/course/${courseId}`
        );
        setCourse(response.data);
        setSelectedTopic(response.data.chapters[0].topics[0]);
      } catch (error) {
        console.error("Error fetching course:", error);
      }
    };
    fetchCourse();
  }, [courseId]);

  const completeTopic = async (courseId, chapterIndex, topicIndex) => {
    const allConceptChecksCorrect = selectedTopic.conceptChecks.every(
      (_, index) => conceptCheckCorrect[index]
    );
    if (!allConceptChecksCorrect) {
      return;
    }

    try {
      await axios.post(
        `http://localhost:8080/api/course/${courseId}/complete/${chapterIndex}/${topicIndex}`
      );
      const updatedCourse = { ...course };
      updatedCourse.chapters[chapterIndex].topics[topicIndex].completed = true;
      setCourse(updatedCourse);

      goToNextStep();

      if (
        topicIndex === course.chapters[chapterIndex].topics.length - 1 &&
        chapterIndex < course.chapters.length - 1
      ) {
        setExpandedChapters(prev => ({
          ...prev,
          [chapterIndex + 1]: true,
        }));
      }
    } catch (error) {
      console.error("Error completing topic:", error);
    }
  };

  const handleConceptCheckAnswer = (index, answer) => {
    setConceptCheckAnswers(prev => ({ ...prev, [index]: answer }));
    const isCorrect = selectedTopic.conceptChecks[index].answer === answer;
    setConceptCheckCorrect(prev => ({ ...prev, [index]: isCorrect }));

    if (index < selectedTopic.conceptChecks.length - 1) {
      questionRefs.current[index + 1].scrollIntoView({ behavior: "smooth" });
      toggleQuestion(index + 1);
    }
  };

  const isPreviousTopicCompleted = (chapterIndex, topicIndex) => {
    if (chapterIndex === 0 && topicIndex === 0) return true;
    if (topicIndex === 0) {
      return (
        chapterIndex > 0 &&
        course.chapters[chapterIndex - 1].topics.every(topic => topic.completed)
      );
    }
    return course.chapters[chapterIndex].topics[topicIndex - 1].completed;
  };

  const toggleChapter = chapterIndex => {
    setExpandedChapters(prev => ({
      ...prev,
      [chapterIndex]: !prev[chapterIndex],
    }));
  };

  const toggleQuestion = questionIndex => {
    setExpandedQuestions(prev => ({
      ...prev,
      [questionIndex]: !prev[questionIndex],
    }));
  };

  const goToNextStep = () => {
    if (currentStep < flatTopics.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setSelectedTopic(flatTopics[nextStep].topic);

      const { chapterIndex: nextChapterIndex } = flatTopics[nextStep];
      if (nextChapterIndex !== currentChapterIndex) {
        setExpandedChapters(prev => ({
          ...prev,
          [nextChapterIndex]: true,
        }));
      }
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setSelectedTopic(
        course.chapters[currentChapterIndex].topics[currentStep - 1]
      );
    }
  };

  const handleTopicClick = (topic, topicIdx) => {
    setSelectedTopic(topic);
    setCurrentStep(topicIdx);
  };

  if (!course) {
    return <Typography>Loading...</Typography>;
  }

  const flatTopics = course.chapters.flatMap((chapter, chapterIndex) =>
    chapter.topics.map((topic, topicIndex) => ({
      topic,
      chapterIndex,
      topicIndex,
    }))
  );

  const { chapterIndex: currentChapterIndex, topicIndex: currentTopicIndex } =
    flatTopics[currentStep];

  return (
    <Box sx={{ display: "flex" }}>
      <Container component="main" sx={{ flexGrow: 1, px: 3 }}>
        {selectedTopic && (
          <>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ fontWeight: 700 }}
            >
              Chapter {currentChapterIndex + 1}{" "}
              <Box
                component="span"
                sx={{
                  display: "inline-block",
                  mx: "2px",
                  transform: "scale(1.5)",
                }}
              >
                •
              </Box>{" "}
              Topic {currentTopicIndex + 1}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {selectedTopic.title}
            </Typography>
            <Box sx={{ mt: 2 }}>
              <ReactPlayer
                width="100%"
                url={selectedTopic.videoUrl && selectedTopic.videoUrl}
              />
            </Box>
            <Typography variant="body1" sx={{ mt: 2 }}>
              {selectedTopic.summary}
            </Typography>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}
            >
              <div>
                <Button
                  variant="outlined"
                  onClick={goToPreviousStep}
                  disabled={currentStep === 0}
                  startIcon={<ChevronLeft />}
                  sx={{ mr: 2 }}
                >
                  Previous
                </Button>
                <Button
                  variant="contained"
                  onClick={goToNextStep}
                  endIcon={<ChevronRight />}
                  disabled={
                    currentStep ===
                      course.chapters.flatMap(c => c.topics).length - 1 ||
                    !selectedTopic.conceptChecks.every(
                      (_, index) => conceptCheckCorrect[index]
                    )
                  }
                >
                  Next
                </Button>
              </div>
              <Button
                startIcon={<Check />}
                variant="contained"
                disabled={
                  flatTopics[currentStep].topic.completed ||
                  !selectedTopic.conceptChecks.every(
                    (_, index) => conceptCheckCorrect[index]
                  )
                }
                onClick={() =>
                  completeTopic(
                    courseId,
                    currentChapterIndex,
                    currentTopicIndex
                  )
                }
              >
                Complete Step
              </Button>
            </Box>
            <Divider sx={{ my: 3 }} />
            <Typography variant="h6">Concept Check</Typography>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ mb: 4 }}
            >
              Let's quickly check your understanding of this topic.
            </Typography>
            {selectedTopic.conceptChecks &&
              selectedTopic.conceptChecks.map((check, index) => (
                <Box
                  key={index}
                  ref={el => (questionRefs.current[index] = el)}
                  sx={{
                    bgcolor: "#28323D",
                    borderRadius: 2,
                    p: 2,
                    mb: 3,
                  }}
                >
                  <Box
                    onClick={() => toggleQuestion(index)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                      mb: expandedQuestions[index] && 2,
                    }}
                  >
                    <ExpandMore
                      disabled={index > 0 && !conceptCheckAnswers[index - 1]}
                      expand={expandedQuestions[index]}
                    >
                      <ExpandMoreOutlined />
                    </ExpandMore>
                    <Typography
                      variant="body1"
                      color={
                        index > 0 &&
                        !conceptCheckAnswers[index - 1] &&
                        "#637381"
                      }
                      sx={{
                        fontWeight: "bold",
                        pointerEvents: "none",
                        userSelect: "none",
                      }}
                    >
                      {check.question}
                    </Typography>
                  </Box>
                  <Collapse
                    in={expandedQuestions[index]}
                    timeout="auto"
                    unmountOnExit
                  >
                    <Grid container spacing={2}>
                      {check.options.map((option, optionIndex) => (
                        <Grid item xs={6} key={optionIndex}>
                          <Button
                            variant="outlined"
                            startIcon={
                              <RadioButtonUnchecked fontSize="small" />
                            }
                            fullWidth
                            onClick={() =>
                              handleConceptCheckAnswer(index, option)
                            }
                            disabled={
                              index > 0 && !conceptCheckAnswers[index - 1]
                            }
                            sx={{
                              justifyContent: "flex-start",
                              fontWeight: 600,
                              borderColor:
                                conceptCheckAnswers[index] === option
                                  ? conceptCheckCorrect[index]
                                    ? "success.main"
                                    : "error.main"
                                  : "none",
                              backgroundColor:
                                conceptCheckAnswers[index] === option
                                  ? conceptCheckCorrect[index]
                                    ? "rgba(80, 193, 60, 0.08)"
                                    : "rgba(255, 86, 48, 0.08)"
                                  : "inherit",
                              color:
                                conceptCheckAnswers[index] === option
                                  ? conceptCheckCorrect[index]
                                    ? "success.main"
                                    : "error.main"
                                  : "inherit",
                              "&:hover": {
                                backgroundColor:
                                  conceptCheckAnswers[index] === option
                                    ? conceptCheckCorrect[index]
                                      ? "rgba(80, 193, 60, 0.16)"
                                      : "rgba(255, 72, 66, 0.16)"
                                    : "none",
                                borderColor:
                                  conceptCheckAnswers[index] === option
                                    ? conceptCheckCorrect[index]
                                      ? "success.main"
                                      : "error.main"
                                    : "none",
                              },
                            }}
                          >
                            {option}
                          </Button>
                        </Grid>
                      ))}
                    </Grid>
                  </Collapse>
                </Box>
              ))}
          </>
        )}
      </Container>
      <Drawer
        variant="permanent"
        anchor="right"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            bgcolor: "#28323D",
            backgroundImage: "none",
            border: "none",
          },
        }}
      >
        <Scrollbars
          autoHide
          style={{ border: 0, outline: 0 }}
          renderThumbVertical={({ style, ...props }) => (
            <div
              {...props}
              style={{
                ...style,
                backgroundColor: "#39454f",
                borderRadius: 3,
                height: "10%",
                outline: "none",
                border: "none",
              }}
            />
          )}
        >
          <Box
            sx={{ position: "sticky", top: 0, zIndex: 1, bgcolor: "#28323D" }}
          >
            <Typography variant="h6" sx={{ p: 2, textTransform: "capitalize" }}>
              {course.title}
            </Typography>
          </Box>
          <Divider />
          <List sx={{ padding: 2 }}>
            {course.chapters.map((chapter, chapterIndex) => (
              <React.Fragment key={chapterIndex}>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
                >
                  <div onClick={() => toggleChapter(chapterIndex)}>
                    <ExpandMore expand={expandedChapters[chapterIndex]}>
                      <ExpandMoreOutlined />
                    </ExpandMore>
                  </div>
                  <div>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      sx={{ fontWeight: 700 }}
                    >
                      Chapter {chapterIndex + 1}
                    </Typography>

                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                      {chapter.title}
                    </Typography>
                  </div>
                </Box>
                <Collapse
                  in={expandedChapters[chapterIndex]}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {chapter.topics.map((topic, topicIndex) => (
                      <ListItemButton
                        selected={selectedTopic === topic}
                        key={topicIndex}
                        onClick={() => handleTopicClick(topic, topicIndex)}
                        disabled={
                          !isPreviousTopicCompleted(chapterIndex, topicIndex)
                        }
                        sx={{
                          borderRadius: 2,
                          mb: 1,
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
                        }}
                      >
                        <ListItemIcon sx={{ mr: -2 }}>
                          {topic.completed ? (
                            <CheckCircle color="success" />
                          ) : (
                            <RadioButtonUnchecked />
                          )}
                        </ListItemIcon>
                        <ListItemText primary={topic.title} />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
                {chapterIndex < course.chapters.length - 1 && (
                  <Divider
                    sx={{ borderStyle: "dashed", ml: -3, mr: -4, my: 2 }}
                  />
                )}
              </React.Fragment>
            ))}
          </List>
        </Scrollbars>
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "50px",
            background: "linear-gradient(to top, #28323D, transparent)",
            pointerEvents: "none",
          }}
        />
      </Drawer>
    </Box>
  );
};

export default TakeCourse;
