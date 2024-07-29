const controller = require("../controllers/course.controller");
const takeController = require("../controllers/takeCourse.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/course/create/:userId", controller.createCourse);
  app.get("/api/course/generateTopics/:courseId", controller.generateTopics);

  //taking a course
  app.get("/api/course/:courseId", takeController.getCourse);
  app.post("/api/course/:courseId/enroll", takeController.enrollUser);
  app.post(
    "/api/course/:courseId/complete/:chapterIndex/:topicIndex",
    takeController.completeTopic
  );
  app.get(
    "/api/course/:courseId/progress/:userId",
    takeController.getUserProgress
  );
};
