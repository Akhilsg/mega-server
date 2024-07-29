import {
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAIL,
  SET_MESSAGE,
  SET_USER,
  FETCH_USER_REQUEST,
  FETCH_USER_SUCCESS,
  FETCH_USER_FAILURE,
} from "../types/types";
import UserService from "../services/user.service";

export const setUser = user => ({
  type: SET_USER,
  payload: user,
});

export const getUserById = userId => async dispatch => {
  dispatch({ type: FETCH_USER_REQUEST });

  return UserService.getUserById(userId)
    .then(data => {
      dispatch({ type: FETCH_USER_SUCCESS });

      dispatch({
        type: SET_USER,
        payload: data.message,
      });

      return Promise.resolve(data.message);
    })
    .catch(() => {
      dispatch({
        type: FETCH_USER_FAILURE,
      });

      return Promise.reject();
    });
};
