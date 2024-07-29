import {
  Box,
  Card,
  CardContent,
  Grid,
  Grow,
  Pagination,
  Skeleton,
  Typography,
} from "@mui/material";
import Fuse from "fuse.js";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { fetchAllUsers, setCurrentQuizzes } from "../../../actions/quiz";
import { useSnackbar } from "../../../common/components/SnackbarContext";
import { deleteQuiz, getAllQuizzes } from "../../../services/quiz.service";
import { getAllUsers } from "../../../services/user.service";
import ActiveFilters from "./ActiveFilters";
import Filters from "./Filters";
import QuizCard from "./QuizCard";
import ShareDialog from "./ShareDialog";

const LoadingCard = () => {
  return (
    <Card
      sx={{
        borderRadius: "15px",
        mb: 3,
      }}
    >
      <Skeleton
        sx={{ height: 151, width: "auto", margin: "10px", borderRadius: 2 }}
        animation="wave"
        variant="rectangular"
      />
      <CardContent>
        <Box sx={{ width: 300 }}>
          <Typography component="div" fontSize="10px" gutterBottom>
            <Skeleton width="60%" />
          </Typography>
          <Typography component="div" fontSize="18px" gutterBottom>
            <Skeleton width="80%" />
          </Typography>
          <Typography
            variant="p"
            color="text.secondary"
            component="div"
            gutterBottom
          >
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

const QuizList = () => {
  const { quizzes } = useSelector(state => state.quiz);
  const { user } = useSelector(state => state.auth);
  const location = useLocation();
  const search = location?.search;

  const subjectFromUrl = search
    ? new URLSearchParams(search).get("subject")
    : null;

  const [searchTerm, setSearchTerm] = useState(
    search ? `${subjectFromUrl} Quiz` : ""
  );
  const [page, setPage] = useState(1);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState("Latest");
  const [loading, setLoading] = useState(false);
  const [filterValues, setFilterValues] = useState({
    startDate: null,
    endDate: null,
    gradeLevels: [],
    difficulty: [],
  });
  const dispatch = useDispatch();
  const snackbar = useSnackbar();
  const quizzesPerPage = 9;

  const myQuizzes = quizzes.filter(quiz => quiz.user === user.id);

  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);

      try {
        const quizData = await getAllQuizzes();
        const userData = await getAllUsers();

        let users = userData.users;
        const currentUser = users.find(person => person._id === user.id);
        users = users.filter(user => user._id !== currentUser._id);

        dispatch(setCurrentQuizzes(quizData.quizzes));
        dispatch(fetchAllUsers(users));
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchQuizzes();
  }, [dispatch, user.id]);

  const handleDelete = async quizId => {
    try {
      await deleteQuiz(quizId);
      const quizData = await getAllQuizzes();
      dispatch(setCurrentQuizzes(quizData.myQuizzes));

      snackbar.success("Quiz deleted successfully");
    } catch (error) {
      console.error(error);
    }
  };

  const handleShareClick = quizId => {
    setSelectedQuizId(quizId);
    setShareDialogOpen(true);
  };

  const handleSortChange = event => {
    setSortOrder(event.target.value);
  };

  const applyFilters = () => {
    let filteredQuizzes = myQuizzes;

    if (searchTerm) {
      const fuse = new Fuse(filteredQuizzes, {
        keys: ["description", "title", "gradeLevel", "difficulty"],
        threshold: 0.4,
      });
      filteredQuizzes = fuse.search(searchTerm).map(result => result.item);
    }

    if (filterValues.startDate) {
      filteredQuizzes = filteredQuizzes.filter(
        quiz => new Date(quiz.createdAt) >= new Date(filterValues.startDate)
      );
    }
    if (filterValues.endDate) {
      filteredQuizzes = filteredQuizzes.filter(
        quiz => new Date(quiz.createdAt) <= new Date(filterValues.endDate)
      );
    }
    if (filterValues.gradeLevels.length > 0) {
      filteredQuizzes = filteredQuizzes.filter(quiz =>
        filterValues.gradeLevels.includes(quiz.gradeLevel)
      );
    }
    if (filterValues.difficulty.length > 0) {
      filteredQuizzes = filteredQuizzes.filter(quiz =>
        filterValues.difficulty.includes(
          quiz.difficulty
        )
      );
    }

    filteredQuizzes = filteredQuizzes.sort((a, b) => {
      if (sortOrder === "Latest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
    });

    return filteredQuizzes;
  };

  const filteredQuizzes = applyFilters();

  const totalPages = Math.ceil(filteredQuizzes?.length / quizzesPerPage);
  const currentQuizzes = filteredQuizzes?.slice(
    (page - 1) * quizzesPerPage,
    page * quizzesPerPage
  );

  return (
    <>
      <Grid
        container
        spacing={2}
        padding={3}
        justifyContent={window.innerWidth < 900 ? "center" : "space-between"}
        alignItems="center"
      >
        {!loading && (
          <ActiveFilters
            myQuizzes={myQuizzes}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            setDrawerOpen={setDrawerOpen}
            filterValues={filterValues}
            sortOrder={sortOrder}
            handleSortChange={handleSortChange}
            filteredQuizzes={filteredQuizzes}
            setFilterValues={setFilterValues}
          />
        )}
        <Grid container spacing={3}>
          {loading &&
            Array.from({ length: 9 }).map((item, index) => (
              <Grid
                item
                xl={3}
                lg={4}
                md={6}
                xs={12}
                key={`loading-card-${index}`}
              >
                <LoadingCard />
              </Grid>
            ))}
        </Grid>
        {!loading && (
          <Grid container spacing={3} alignItems="center" mt={1}>
            {currentQuizzes?.map((filteredQuiz, index) => (
              <Grid item xl={3} lg={4} md={6} xs={12}>
                <QuizCard
                  key={index}
                  filteredQuiz={filteredQuiz}
                  handleDeleteQuiz={handleDelete}
                  handleShareClick={handleShareClick}
                />
              </Grid>
            ))}
          </Grid>
        )}
        {currentQuizzes?.length === 0 && !loading && (
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
                mt: 2,
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
        )}
        <Box sx={{ display: "flex", justifyContent: "end" }}>
          {totalPages > 1 && (
            <Pagination
              count={totalPages}
              page={page}
              onChange={(event, value) => setPage(value)}
              color="primary"
              variant="outlined"
              size="large"
            />
          )}
        </Box>
      </Grid>
      <ShareDialog
        open={shareDialogOpen}
        setOpen={setShareDialogOpen}
        selectedQuizId={selectedQuizId}
      />
      <Filters
        open={drawerOpen}
        setOpen={setDrawerOpen}
        filterValues={filterValues}
        setFilterValues={setFilterValues}
      />
    </>
  );
};

export default QuizList;
