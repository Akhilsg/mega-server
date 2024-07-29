import { Icon } from "@iconify/react/dist/iconify.js";
import { AutoAwesome, CheckCircle, HourglassEmpty } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  Divider,
  LinearProgress,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import logo from "../../images/loading.png";
import { useNavigate } from "react-router-dom";

const CreateCourse = () => {
  const { user } = useSelector(state => state.auth);
  const [subject, setSubject] = useState("");
  const [numChapters, setNumChapters] = useState(3);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [courseId, setCourseId] = useState("");
  const [loading, setLoading] = useState(false);
  const [genLoading, setGenLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [currentGeneratingTopic, setCurrentGeneratingTopic] = useState(null);
  const [loadingText, setLoadingText] = useState("Creating course...");
  const [course, setCourse] = useState(null);
  const navigate = useNavigate(); 

  const handleCreateCourse = async e => {
    e.preventDefault();

    setLoading(true);
    setStatus("");
    setLoadingText("Creating course...");

    try {
      const response = await axios.post(
        `http://localhost:8080/api/course/create/${user.id}`,
        {
          subject,
          numChapters,
          manualChapters: [],
        }
      );
      console.log(response.data);
      setCourseId(response.data.message);
      setCourse(response.data.course);
      setLoadingText("Course created!");
      setStatus("Course created. Ready to generate topics.");
      setLoading(false);
    } catch (error) {
      console.error("Error creating course:", error);
      setStatus("Error creating course");
      setLoading(false);
    }
  };

  const handleGenerateTopics = async () => {
    setGenLoading(true);

    try {
      const eventSource = new EventSource(
        `http://localhost:8080/api/course/generateTopics/${courseId}`
      );
      eventSource.onmessage = e => {
        const data = JSON.parse(e.data);
        if (data.error) {
          setStatus(data.error);
          setCurrentGeneratingTopic(null);
          eventSource.close();
        } else {
          if (
            data.chapterIndex !== undefined &&
            data.topicIndex !== undefined
          ) {
            setCourse(prevCourse => {
              const newCourse = { ...prevCourse };
              newCourse.chapters[data.chapterIndex].topics[
                data.topicIndex
              ].generated = true;
              return newCourse;
            });

            let nextChapterIndex = data.chapterIndex;
            let nextTopicIndex = data.topicIndex + 1;

            if (
              nextTopicIndex >= course.chapters[nextChapterIndex].topics.length
            ) {
              nextChapterIndex++;
              nextTopicIndex = 0;
            }

            if (nextChapterIndex < course.chapters.length) {
              setCurrentGeneratingTopic({
                chapterIndex: nextChapterIndex,
                topicIndex: nextTopicIndex,
              });
            } else {
              setCurrentGeneratingTopic(null);
            }
          }
          if (data.message === "All topics generated successfully") {
            setStatus("All topics generated successfully");
            setCurrentGeneratingTopic(null);
            eventSource.close();
          }
        }
      };
      eventSource.onerror = () => {
        setStatus("Error occurred while generating topics.");
        setCurrentGeneratingTopic(null);
        eventSource.close();
      };

      setCurrentGeneratingTopic({ chapterIndex: 0, topicIndex: 0 });
    } catch (error) {
      console.error("Error generating topics:", error);
      setStatus("Error generating topics");
      setCurrentGeneratingTopic(null);
    }
  };

  return (
    <Container maxWidth="md">
      {!course && (
        <>
          {loading ? (
            <Card>
              <CardContent
                sx={{
                  p: 3,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <img
                  src={logo}
                  alt="Loading your AI generated course"
                  style={{ margin: "auto", width: "50%", height: "50%" }}
                />
                <LinearProgress sx={{ my: 3 }} />
                <Typography variant="h4" align="center">
                  {loadingText}
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <Card sx={{ margin: "auto", maxWidth: "720px" }}>
              <CardHeader
                title="Generate a course"
                subheader="AI personalization for your course"
                sx={{
                  p: theme => theme.spacing(3, 3, 0),
                  mb: 3,
                }}
              />
              <Divider />
              <CardContent sx={{ p: 2, px: 4 }}>
                <form onSubmit={handleCreateCourse}>
                  <Box sx={{ display: "flex", gap: 3 }}>
                    <TextField
                      label="Subject to give to AI"
                      fullWidth
                      margin="normal"
                      value={subject}
                      onChange={e => setSubject(e.target.value)}
                      helperText="Type any topic that you want to give to AI to generate a course"
                    />
                    <TextField
                      label="Num. of chapters"
                      fullWidth
                      margin="normal"
                      type="number"
                      inputProps={{
                        min: 3,
                        max: 7,
                        style: { textAlign: "center" },
                      }}
                      value={numChapters}
                      onChange={e => setNumChapters(e.target.value)}
                      sx={{ width: "30%" }}
                    />
                  </Box>
                  <Box>
                    <TextField
                      label="Title For Course"
                      fullWidth
                      margin="normal"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      label="Description"
                      fullWidth
                      margin="normal"
                      value={description}
                      multiline
                      minRows={4}
                      onChange={e => setDescription(e.target.value)}
                    />
                  </Box>
                  <Box
                    sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}
                  >
                    <LoadingButton
                      type="submit"
                      variant="contained"
                      color="primary"
                      loadingPosition="start"
                      loading={loading}
                      disabled={loading}
                      startIcon={<AutoAwesome />}
                    >
                      Create Course
                    </LoadingButton>
                  </Box>
                </form>
              </CardContent>
            </Card>
          )}
        </>
      )}
      <br />
      {!loading && course && (
        <Card>
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 1,
              }}
            >
              <Box sx={{ width: "60%" }}>
                <Typography variant="h4">Course Generated!</Typography>
                <Typography variant="subtitle" color="text.secondary">
                  We generated chapters for each of your units. Look over them
                  and make sure they are accurate.
                </Typography>
              </Box>
              <LoadingButton
                variant="contained"
                color="primary"
                onClick={handleGenerateTopics}
                loadingPosition="start"
                loading={genLoading}
                disabled={
                  genLoading || status === "All topics generated successfully"
                }
                startIcon={
                  <Icon
                    icon="streamline:ai-redo-spark"
                    width="20"
                    height="20"
                  />
                }
              >
                Generate Topics
              </LoadingButton>
            </Box>
            <Divider sx={{ borderStyle: "dashed", mt: 2, mx: -2 }} />
            <List sx={{ mt: 2 }}>
              {course.chapters.map((chapter, chapterIdx) => (
                <Box key={chapterIdx}>
                  <Typography variant="h6">
                    {chapterIdx + 1}. {chapter.title}
                  </Typography>
                  <List>
                    {chapter.topics.map((topic, topicIdx) => (
                      <ListItemButton
                        key={topicIdx}
                        disabled={
                          currentGeneratingTopic &&
                          currentGeneratingTopic.chapterIndex === chapterIdx &&
                          currentGeneratingTopic.topicIndex === topicIdx
                        }
                      >
                        <ListItemIcon>
                          {topic.generated ? (
                            <CheckCircle color="success" />
                          ) : currentGeneratingTopic &&
                            currentGeneratingTopic.chapterIndex ===
                              chapterIdx &&
                            currentGeneratingTopic.topicIndex === topicIdx ? (
                            <CircularProgress size={24} color="disabled" />
                          ) : (
                            <HourglassEmpty />
                          )}
                        </ListItemIcon>
                        <ListItemText primary={topic.title} sx={{ ml: -2 }} />
                      </ListItemButton>
                    ))}
                  </List>
                </Box>
              ))}
            </List>
          </CardContent>
        </Card>
      )}
      {status === "All topics generated successfully" && (
        <Box mt={4} textAlign="center">
          <Button
            onClick={() => navigate(`/course/${course._id}`)}
            variant="contained"
            color="primary"
            startIcon={
              <Icon
                icon="streamline:ai-technology-spark"
                width="24"
                height="24"
              />
            }
          >
            Take Course
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default CreateCourse;
