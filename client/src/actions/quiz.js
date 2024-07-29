import * as quizService from "../services/quiz.service";
import {
  CREATE_QUIZ_FAILURE,
  CREATE_QUIZ_REQUEST,
  CREATE_QUIZ_SUCCESS,
  DELETE_QUIZ_FAILURE,
  DELETE_QUIZ_REQUEST,
  DELETE_QUIZ_SUCCESS,
  FETCH_USERS_REQUEST,
  SET_CURRENT_QUIZ,
  SET_CURRENT_QUIZZES,
  SET_MESSAGE,
  UPDATE_QUIZ_FAILURE,
  UPDATE_QUIZ_REQUEST,
  UPDATE_QUIZ_SUCCESS,
} from "../types/types";

export const setCurrentQuizzes = quizzes => ({
  type: SET_CURRENT_QUIZZES,
  payload: quizzes,
});

export const fetchAllUsers = users => ({
  type: FETCH_USERS_REQUEST,
  payload: users,
});

export const setCurrentQuiz = quiz => ({
  type: SET_CURRENT_QUIZ,
  payload: quiz,
});

export const createQuizRequest = () => ({
  type: CREATE_QUIZ_REQUEST,
});

export const createQuizSuccess = quiz => ({
  type: CREATE_QUIZ_SUCCESS,
  payload: quiz,
});

export const createQuizFailure = error => ({
  type: CREATE_QUIZ_FAILURE,
  payload: error,
});

export const setMessage = message => ({
  type: SET_MESSAGE,
  payload: message,
});

export const createQuiz = (userId, quizData) => dispatch => {
  dispatch(createQuizRequest());

  return quizService.createQuiz(userId, quizData).then(
    data => {
      dispatch(createQuizSuccess(data.message));
      dispatch(setMessage(data.message));
      return Promise.resolve(data.message);
    },
    error => {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      dispatch(createQuizFailure(message));
      dispatch(setMessage(message));
      return Promise.reject(message);
    }
  );
};

export const updateQuizRequest = () => ({ type: UPDATE_QUIZ_REQUEST });
export const updateQuizSuccess = quiz => ({
  type: UPDATE_QUIZ_SUCCESS,
  payload: quiz,
});
export const updateQuizFailure = error => ({
  type: UPDATE_QUIZ_FAILURE,
  payload: error,
});

export const deleteQuizRequest = () => ({ type: DELETE_QUIZ_REQUEST });
export const deleteQuizSuccess = quizId => ({
  type: DELETE_QUIZ_SUCCESS,
  payload: quizId,
});
export const deleteQuizFailure = error => ({
  type: DELETE_QUIZ_FAILURE,
  payload: error,
});
