const db = require("../models");
const Course = db.course;

const getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).send({ message: "Course not found" });
    }
    res.status(200).send(course);
  } catch (error) {
    res.status(500).send({ message: "Error retrieving course" });
  }
};

const completeTopic = async (req, res) => {
  try {
    const { courseId, chapterIndex, topicIndex } = req.params;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).send({ message: "Course not found" });
    }
    course.chapters[chapterIndex].topics[topicIndex].completed = true;
    await course.save();
    res.status(200).send({ message: "Topic completed successfully" });
  } catch (error) {
    res.status(500).send({ message: "Error completing topic" });
  }
};

const enrollUser = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { userId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).send({ message: "Course not found" });
    }

    if (!course.enrolledUsers.includes(userId)) {
      course.enrolledUsers.push(userId);
      await course.save();
    }

    res.status(200).send({ message: "User enrolled successfully" });
  } catch (error) {
    res.status(500).send({ message: "Error enrolling user" });
  }
};

const getUserProgress = async (req, res) => {
  try {
    const { courseId, userId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).send({ message: "Course not found" });
    }

    const progress = course.chapters.map((chapter) => ({
      chapterTitle: chapter.title,
      topics: chapter.topics.map((topic) => ({
        topicTitle: topic.title,
        completed: topic.completed,
        score: topic.userResults.score,
      })),
    }));

    res.status(200).send(progress);
  } catch (error) {
    res.status(500).send({ message: "Error retrieving user progress" });
  }
};

module.exports = { getCourse, completeTopic, enrollUser, getUserProgress };
