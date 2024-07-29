import {
  CREATE_QUIZ_REQUEST,
  CREATE_QUIZ_SUCCESS,
  CREATE_QUIZ_FAILURE,
  UPDATE_QUIZ_REQUEST,
  UPDATE_QUIZ_SUCCESS,
  UPDATE_QUIZ_FAILURE,
  DELETE_QUIZ_REQUEST,
  DELETE_QUIZ_SUCCESS,
  DELETE_QUIZ_FAILURE,
  SET_CURRENT_QUIZ,
  SET_CURRENT_QUIZZES,
} from "../types/types";

const initialState = {
  quizzes: [],
  currentQuiz: {},
  loading: false,
  finished: false,
  error: null,
};

const quizReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_QUIZ_REQUEST:
    case UPDATE_QUIZ_REQUEST:
    case DELETE_QUIZ_REQUEST:
      return { ...state, loading: true, finished: false, error: null };

    case CREATE_QUIZ_SUCCESS:
      return {
        ...state,
        quizzes: [...state.quizzes, action.payload],
        currentQuiz: action.payload,
        finished: true,
        loading: false,
        error: null,
      };

    case UPDATE_QUIZ_SUCCESS:
      return {
        ...state,
        quizzes: state.quizzes.map(quiz =>
          quiz._id === action.payload._id ? action.payload : quiz
        ),
        currentQuiz: action.payload,
        loading: false,
        error: null,
      };

    case DELETE_QUIZ_SUCCESS:
      return {
        ...state,
        quizzes: state.quizzes.filter(quiz => quiz._id !== action.payload),
        currentQuiz: {},
        loading: false,
        error: null,
      };

    case CREATE_QUIZ_FAILURE:
    case UPDATE_QUIZ_FAILURE:
    case DELETE_QUIZ_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case SET_CURRENT_QUIZ:
      return {
        ...state,
        currentQuiz: action.payload,
      };

    case SET_CURRENT_QUIZZES:
      return {
        ...state,
        quizzes: action.payload,
      };

    default:
      return state;
  }
};

export default quizReducer;
